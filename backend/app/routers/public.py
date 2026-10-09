import re
import json
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Form, Question, Response, Answer
from ..schemas import PublicForm, PublicQuestion, SubmissionCreate, SubmissionResult

router = APIRouter(prefix="/public", tags=["Public Respondent Flow"])

EMAIL_REGEX = re.compile(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$")

@router.get("/forms/{share_slug}", response_model=PublicForm)
def get_public_form(share_slug: str, db: Session = Depends(get_db)):
    """Fetch published form and its questions for public filling. No auth required."""
    form = db.query(Form).filter(Form.share_slug == share_slug).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    if form.status != "published":
        raise HTTPException(status_code=403, detail="This form is currently in draft mode and not accepting responses.")

    # Sort questions by order_index
    questions = sorted(form.questions, key=lambda q: q.order_index)

    return PublicForm(
        id=form.id,
        title=form.title,
        description=form.description,
        share_slug=form.share_slug,
        theme_settings=form.theme_settings,
        questions=[PublicQuestion.model_validate(q) for q in questions]
    )

@router.post("/forms/{share_slug}/submit", response_model=SubmissionResult, status_code=status.HTTP_201_CREATED)
def submit_form(share_slug: str, payload: SubmissionCreate, request: Request, db: Session = Depends(get_db)):
    """Submit responses to a public form with strict server-side validation."""
    form = db.query(Form).filter(Form.share_slug == share_slug).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    if form.status != "published":
        raise HTTPException(status_code=403, detail="This form is not accepting responses.")

    # Create mapping of question_id -> Question
    question_map = {q.id: q for q in form.questions}
    submitted_answers_map = {a.question_id: a for a in payload.answers}

    # Validate each question
    for q_id, q in question_map.items():
        ans = submitted_answers_map.get(q_id)
        val = (ans.answer_text or "").strip() if ans else ""

        # 1. Required validation
        if q.is_required:
            if not ans or (not val and not ans.answer_json):
                raise HTTPException(
                    status_code=422,
                    detail=f"Question '{q.title}' is required."
                )

        # Skip type checks if not answered and not required
        if not val and (not ans or not ans.answer_json):
            continue

        # 2. Email format validation
        if q.question_type == "email" and val:
            if not EMAIL_REGEX.match(val):
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid email address provided for '{q.title}'."
                )

        # 3. Number format validation
        if q.question_type == "number" and val:
            try:
                float(val)
            except ValueError:
                raise HTTPException(
                    status_code=422,
                    detail=f"Answer for '{q.title}' must be a valid number."
                )

        # 4. Rating format validation
        if q.question_type == "rating" and val:
            try:
                rate_num = int(val)
                if rate_num < 1 or rate_num > 10:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Rating for '{q.title}' must be between 1 and 10."
                    )
            except ValueError:
                raise HTTPException(
                    status_code=422,
                    detail=f"Rating for '{q.title}' must be an integer."
                )

        # 5. Multiple choice / dropdown validation (if options defined)
        if q.question_type in ("multiple_choice", "dropdown") and q.options_json and val:
            try:
                valid_options = json.loads(q.options_json)
                if isinstance(valid_options, list) and val not in valid_options:
                    # Allow if valid_options is empty
                    if len(valid_options) > 0:
                        raise HTTPException(
                            status_code=422,
                            detail=f"Selected option '{val}' is not valid for '{q.title}'."
                        )
            except json.JSONDecodeError:
                pass

    # Create submission record
    client_host = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(client_host.encode("utf-8")).hexdigest()[:16]

    new_response = Response(
        form_id=form.id,
        respondent_ip_hash=ip_hash
    )
    db.add(new_response)
    db.commit()
    db.refresh(new_response)

    # Save answers
    for item in payload.answers:
        if item.question_id in question_map:
            db_answer = Answer(
                response_id=new_response.id,
                question_id=item.question_id,
                answer_text=item.answer_text,
                answer_json=item.answer_json
            )
            db.add(db_answer)

    db.commit()

    return SubmissionResult(
        success=True,
        response_id=new_response.id,
        message="Thank you! Your response has been recorded."
    )
