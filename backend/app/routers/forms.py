import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Form, Question, Response
from ..schemas import FormCreate, FormUpdate, FormListItem, FormDetailResponse, QuestionResponse

router = APIRouter(prefix="/forms", tags=["Forms"])

def generate_share_slug() -> str:
    return secrets.token_urlsafe(8)

@router.get("", response_model=list[FormListItem])
def list_forms(db: Session = Depends(get_db)):
    """List all forms with question counts and response counts."""
    forms = db.query(Form).order_by(Form.updated_at.desc()).all()
    result = []
    for form in forms:
        q_count = db.query(func.count(Question.id)).filter(Question.form_id == form.id).scalar() or 0
        r_count = db.query(func.count(Response.id)).filter(Response.form_id == form.id).scalar() or 0
        result.append(FormListItem(
            id=form.id,
            title=form.title,
            description=form.description,
            status=form.status,
            share_slug=form.share_slug,
            question_count=q_count,
            response_count=r_count,
            created_at=form.created_at,
            updated_at=form.updated_at
        ))
    return result

@router.post("", response_model=FormDetailResponse, status_code=status.HTTP_201_CREATED)
def create_form(payload: FormCreate, db: Session = Depends(get_db)):
    """Create a new form with default welcome question."""
    slug = generate_share_slug()
    # Ensure unique slug
    while db.query(Form).filter(Form.share_slug == slug).first():
        slug = generate_share_slug()

    new_form = Form(
        title=payload.title,
        description=payload.description,
        status="draft",
        share_slug=slug,
        theme_settings=payload.theme_settings
    )
    db.add(new_form)
    db.commit()
    db.refresh(new_form)

    # Add a default first question
    default_question = Question(
        form_id=new_form.id,
        order_index=0,
        question_type="short_text",
        title="What is your name?",
        description="Please introduce yourself",
        is_required=True
    )
    db.add(default_question)
    db.commit()
    db.refresh(new_form)

    return FormDetailResponse(
        id=new_form.id,
        title=new_form.title,
        description=new_form.description,
        status=new_form.status,
        share_slug=new_form.share_slug,
        theme_settings=new_form.theme_settings,
        created_at=new_form.created_at,
        updated_at=new_form.updated_at,
        questions=[QuestionResponse.model_validate(q) for q in new_form.questions],
        response_count=0
    )

@router.get("/{form_id}", response_model=FormDetailResponse)
def get_form(form_id: str, db: Session = Depends(get_db)):
    """Get full form definition including ordered questions."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    r_count = db.query(func.count(Response.id)).filter(Response.form_id == form.id).scalar() or 0
    return FormDetailResponse(
        id=form.id,
        title=form.title,
        description=form.description,
        status=form.status,
        share_slug=form.share_slug,
        theme_settings=form.theme_settings,
        created_at=form.created_at,
        updated_at=form.updated_at,
        questions=[QuestionResponse.model_validate(q) for q in form.questions],
        response_count=r_count
    )

@router.put("/{form_id}", response_model=FormDetailResponse)
def update_form(form_id: str, payload: FormUpdate, db: Session = Depends(get_db)):
    """Update form metadata (title, description, status, theme)."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    if payload.title is not None:
        form.title = payload.title
    if payload.description is not None:
        form.description = payload.description
    if payload.status is not None:
        form.status = payload.status
    if payload.theme_settings is not None:
        form.theme_settings = payload.theme_settings

    db.commit()
    db.refresh(form)

    r_count = db.query(func.count(Response.id)).filter(Response.form_id == form.id).scalar() or 0
    return FormDetailResponse(
        id=form.id,
        title=form.title,
        description=form.description,
        status=form.status,
        share_slug=form.share_slug,
        theme_settings=form.theme_settings,
        created_at=form.created_at,
        updated_at=form.updated_at,
        questions=[QuestionResponse.model_validate(q) for q in form.questions],
        response_count=r_count
    )

@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(form_id: str, db: Session = Depends(get_db)):
    """Delete a form and all associated questions and responses."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    db.delete(form)
    db.commit()
    return None

@router.post("/{form_id}/duplicate", response_model=FormDetailResponse, status_code=status.HTTP_201_CREATED)
def duplicate_form(form_id: str, db: Session = Depends(get_db)):
    """Duplicate an existing form with its questions."""
    original = db.query(Form).filter(Form.id == form_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Form not found")

    new_slug = generate_share_slug()
    duplicated_form = Form(
        title=f"{original.title} (Copy)",
        description=original.description,
        status="draft",
        share_slug=new_slug,
        theme_settings=original.theme_settings
    )
    db.add(duplicated_form)
    db.commit()
    db.refresh(duplicated_form)

    # Duplicate questions
    for q in original.questions:
        new_q = Question(
            form_id=duplicated_form.id,
            order_index=q.order_index,
            question_type=q.question_type,
            title=q.title,
            description=q.description,
            is_required=q.is_required,
            options_json=q.options_json,
            validation_rules=q.validation_rules
        )
        db.add(new_q)
    db.commit()
    db.refresh(duplicated_form)

    return FormDetailResponse(
        id=duplicated_form.id,
        title=duplicated_form.title,
        description=duplicated_form.description,
        status=duplicated_form.status,
        share_slug=duplicated_form.share_slug,
        theme_settings=duplicated_form.theme_settings,
        created_at=duplicated_form.created_at,
        updated_at=duplicated_form.updated_at,
        questions=[QuestionResponse.model_validate(q) for q in duplicated_form.questions],
        response_count=0
    )

@router.patch("/{form_id}/publish", response_model=FormDetailResponse)
def toggle_publish(form_id: str, db: Session = Depends(get_db)):
    """Toggle publish status between 'draft' and 'published'."""
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    form.status = "published" if form.status == "draft" else "draft"
    db.commit()
    db.refresh(form)

    r_count = db.query(func.count(Response.id)).filter(Response.form_id == form.id).scalar() or 0
    return FormDetailResponse(
        id=form.id,
        title=form.title,
        description=form.description,
        status=form.status,
        share_slug=form.share_slug,
        theme_settings=form.theme_settings,
        created_at=form.created_at,
        updated_at=form.updated_at,
        questions=[QuestionResponse.model_validate(q) for q in form.questions],
        response_count=r_count
    )
