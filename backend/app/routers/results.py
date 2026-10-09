import io
import csv
import json
from collections import Counter
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response as FastApiResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Form, Question, Response, Answer
from ..schemas import (
    SingleResponseDetail,
    AnswerResponse,
    FormAnalyticsResponse,
    QuestionStatItem
)

router = APIRouter(prefix="/forms/{form_id}", tags=["Results & Analytics"])

@router.get("/responses", response_model=list[SingleResponseDetail])
def list_form_responses(form_id: str, db: Session = Depends(get_db)):
    """List all submissions for a given form with their answers."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    responses = db.query(Response).filter(Response.form_id == form_id).order_by(Response.submitted_at.desc()).all()
    results = []

    # Map question_id to question object for title & type
    q_map = {q.id: q for q in form.questions}

    for r in responses:
        ans_list = []
        for a in r.answers:
            q = q_map.get(a.question_id)
            ans_list.append(AnswerResponse(
                id=a.id,
                question_id=a.question_id,
                question_title=q.title if q else "Deleted Question",
                question_type=q.question_type if q else "unknown",
                answer_text=a.answer_text,
                answer_json=a.answer_json,
                created_at=a.created_at
            ))
        results.append(SingleResponseDetail(
            id=r.id,
            form_id=r.form_id,
            submitted_at=r.submitted_at,
            answers=ans_list
        ))

    return results

@router.get("/responses/{response_id}", response_model=SingleResponseDetail)
def get_single_response(form_id: str, response_id: str, db: Session = Depends(get_db)):
    """View an individual response in full."""
    resp = db.query(Response).filter(Response.id == response_id, Response.form_id == form_id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Response not found")

    form = db.query(Form).filter(Form.id == form_id).first()
    q_map = {q.id: q for q in form.questions} if form else {}

    ans_list = []
    for a in resp.answers:
        q = q_map.get(a.question_id)
        ans_list.append(AnswerResponse(
            id=a.id,
            question_id=a.question_id,
            question_title=q.title if q else "Deleted Question",
            question_type=q.question_type if q else "unknown",
            answer_text=a.answer_text,
            answer_json=a.answer_json,
            created_at=a.created_at
        ))

    return SingleResponseDetail(
        id=resp.id,
        form_id=resp.form_id,
        submitted_at=resp.submitted_at,
        answers=ans_list
    )

@router.get("/analytics", response_model=FormAnalyticsResponse)
def get_form_analytics(form_id: str, db: Session = Depends(get_db)):
    """Get aggregated summary statistics per question."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    total_responses = db.query(Response).filter(Response.form_id == form_id).count()
    ordered_questions = sorted(form.questions, key=lambda q: q.order_index)

    question_stats = []
    for q in ordered_questions:
        answers = db.query(Answer).join(Response).filter(
            Response.form_id == form_id,
            Answer.question_id == q.id
        ).all()

        total_ans = len(answers)
        summary: dict = {}

        if q.question_type in ("multiple_choice", "dropdown", "yes_no"):
            counter = Counter(a.answer_text for a in answers if a.answer_text)
            # Include options with 0 counts if options_json exists
            if q.options_json:
                try:
                    opts = json.loads(q.options_json)
                    for opt in opts:
                        if opt not in counter:
                            counter[opt] = 0
                except json.JSONDecodeError:
                    pass
            summary = {
                "distribution": dict(counter),
                "top_choice": counter.most_common(1)[0][0] if counter else None
            }

        elif q.question_type in ("rating", "number"):
            nums = []
            for a in answers:
                if a.answer_text:
                    try:
                        nums.append(float(a.answer_text))
                    except ValueError:
                        pass
            if nums:
                avg = round(sum(nums) / len(nums), 2)
                min_val = min(nums)
                max_val = max(nums)
                summary = {
                    "average": avg,
                    "min": min_val,
                    "max": max_val,
                    "count": len(nums)
                }
            else:
                summary = {"average": None, "count": 0}

        else:
            # Text / Email
            recent_samples = [a.answer_text for a in answers[-5:] if a.answer_text]
            summary = {
                "sample_count": total_ans,
                "latest_samples": recent_samples
            }

        question_stats.append(QuestionStatItem(
            question_id=q.id,
            title=q.title,
            question_type=q.question_type,
            order_index=q.order_index,
            total_answers=total_ans,
            summary_data=summary
        ))

    return FormAnalyticsResponse(
        form_id=form.id,
        form_title=form.title,
        total_responses=total_responses,
        question_stats=question_stats
    )

@router.get("/export/csv")
def export_responses_csv(form_id: str, db: Session = Depends(get_db)):
    """Export all form submissions as a formatted CSV spreadsheet."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    ordered_questions = sorted(form.questions, key=lambda q: q.order_index)
    responses = db.query(Response).filter(Response.form_id == form_id).order_by(Response.submitted_at.asc()).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Header row: Response ID, Submitted At, Question 1 Title, Question 2 Title, ...
    headers = ["Submission ID", "Submitted At (UTC)"] + [q.title for q in ordered_questions]
    writer.writerow(headers)

    for r in responses:
        ans_by_q = {a.question_id: (a.answer_text or a.answer_json or "") for a in r.answers}
        row = [
            r.id,
            r.submitted_at.strftime("%Y-%m-%d %H:%M:%S")
        ]
        for q in ordered_questions:
            row.append(ans_by_q.get(q.id, ""))
        writer.writerow(row)

    csv_content = output.getvalue()
    filename = f"responses_{form.share_slug}.csv"

    return FastApiResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
