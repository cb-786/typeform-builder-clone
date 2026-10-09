from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# --- Question Schemas ---

class QuestionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=1000)
    description: Optional[str] = None
    question_type: str = Field(..., description="short_text | long_text | multiple_choice | dropdown | email | number | yes_no | rating")
    is_required: bool = False
    options_json: Optional[str] = None  # JSON array string e.g. '["Option 1", "Option 2"]'
    validation_rules: Optional[str] = None

class QuestionCreate(QuestionBase):
    order_index: Optional[int] = None

class QuestionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=1000)
    description: Optional[str] = None
    question_type: Optional[str] = None
    is_required: Optional[bool] = None
    options_json: Optional[str] = None
    validation_rules: Optional[str] = None
    order_index: Optional[int] = None

class QuestionReorderItem(BaseModel):
    id: str
    order_index: int

class QuestionReorderRequest(BaseModel):
    questions: list[QuestionReorderItem]

class QuestionResponse(QuestionBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    form_id: str
    order_index: int
    created_at: datetime
    updated_at: datetime

# --- Form Schemas ---

class FormBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    theme_settings: Optional[str] = None

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|published)$")
    theme_settings: Optional[str] = None

class FormListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str] = None
    status: str
    share_slug: str
    question_count: int = 0
    response_count: int = 0
    created_at: datetime
    updated_at: datetime

class FormDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str] = None
    status: str
    share_slug: str
    theme_settings: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    questions: list[QuestionResponse] = []
    response_count: int = 0

# --- Public Form Schemas (Respondent Flow) ---

class PublicQuestion(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_index: int
    question_type: str
    title: str
    description: Optional[str] = None
    is_required: bool
    options_json: Optional[str] = None
    validation_rules: Optional[str] = None

class PublicForm(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str] = None
    share_slug: str
    theme_settings: Optional[str] = None
    questions: list[PublicQuestion] = []

class AnswerInput(BaseModel):
    question_id: str
    answer_text: Optional[str] = None
    answer_json: Optional[str] = None

class SubmissionCreate(BaseModel):
    answers: list[AnswerInput]

class SubmissionResult(BaseModel):
    success: bool
    response_id: str
    message: str = "Response submitted successfully"

# --- Response & Analytics Schemas ---

class AnswerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    question_id: str
    question_title: Optional[str] = None
    question_type: Optional[str] = None
    answer_text: Optional[str] = None
    answer_json: Optional[str] = None
    created_at: datetime

class SingleResponseDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    form_id: str
    submitted_at: datetime
    answers: list[AnswerResponse] = []

class QuestionStatItem(BaseModel):
    question_id: str
    title: str
    question_type: str
    order_index: int
    total_answers: int
    summary_data: dict[str, Any]  # choice distribution, average rating/number, etc.

class FormAnalyticsResponse(BaseModel):
    form_id: str
    form_title: str
    total_responses: int
    question_stats: list[QuestionStatItem] = []
