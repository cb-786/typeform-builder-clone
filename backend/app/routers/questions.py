from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Form, Question
from ..schemas import QuestionCreate, QuestionUpdate, QuestionResponse, QuestionReorderRequest

router = APIRouter(prefix="/forms/{form_id}/questions", tags=["Questions"])

VALID_QUESTION_TYPES = {
    "short_text",
    "long_text",
    "multiple_choice",
    "dropdown",
    "email",
    "number",
    "yes_no",
    "rating"
}

@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def add_question(form_id: str, payload: QuestionCreate, db: Session = Depends(get_db)):
    """Add a question to a form."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    if payload.question_type not in VALID_QUESTION_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid question type '{payload.question_type}'. Must be one of: {list(VALID_QUESTION_TYPES)}"
        )

    # Determine order_index if not supplied
    order_idx = payload.order_index
    if order_idx is None:
        max_idx = db.query(func.max(Question.order_index)).filter(Question.form_id == form_id).scalar()
        order_idx = (max_idx + 1) if max_idx is not None else 0

    new_question = Question(
        form_id=form_id,
        order_index=order_idx,
        question_type=payload.question_type,
        title=payload.title,
        description=payload.description,
        is_required=payload.is_required,
        options_json=payload.options_json,
        validation_rules=payload.validation_rules
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

@router.put("/reorder", response_model=list[QuestionResponse])
def reorder_questions(form_id: str, payload: QuestionReorderRequest, db: Session = Depends(get_db)):
    """Reorder questions within a form in bulk."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    for item in payload.questions:
        q = db.query(Question).filter(Question.id == item.id, Question.form_id == form_id).first()
        if q:
            q.order_index = item.order_index

    db.commit()
    questions = db.query(Question).filter(Question.form_id == form_id).order_by(Question.order_index).all()
    return questions

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(form_id: str, question_id: str, payload: QuestionUpdate, db: Session = Depends(get_db)):
    """Update question title, type, settings, or options."""
    question = db.query(Question).filter(Question.id == question_id, Question.form_id == form_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    if payload.question_type is not None:
        if payload.question_type not in VALID_QUESTION_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid question type '{payload.question_type}'. Must be one of: {list(VALID_QUESTION_TYPES)}"
            )
        question.question_type = payload.question_type

    if payload.title is not None:
        question.title = payload.title
    if payload.description is not None:
        question.description = payload.description
    if payload.is_required is not None:
        question.is_required = payload.is_required
    if payload.options_json is not None:
        question.options_json = payload.options_json
    if payload.validation_rules is not None:
        question.validation_rules = payload.validation_rules
    if payload.order_index is not None:
        question.order_index = payload.order_index

    db.commit()
    db.refresh(question)
    return question

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(form_id: str, question_id: str, db: Session = Depends(get_db)):
    """Delete a question from a form."""
    question = db.query(Question).filter(Question.id == question_id, Question.form_id == form_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(question)
    db.commit()
    return None
