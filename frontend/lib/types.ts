export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "email"
  | "number"
  | "yes_no"
  | "rating";

export interface Question {
  id: string;
  form_id: string;
  order_index: number;
  question_type: QuestionType;
  title: string;
  description: string | null;
  is_required: boolean;
  options_json: string | null; // JSON string of string[]
  validation_rules: string | null;
  created_at: string;
  updated_at: string;
}

export interface Form {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published";
  share_slug: string;
  theme_settings: string | null;
  created_at: string;
  updated_at: string;
  questions: Question[];
  response_count: number;
}

export interface FormListItem {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "published";
  share_slug: string;
  question_count: number;
  response_count: number;
  created_at: string;
  updated_at: string;
}

export interface PublicQuestion {
  id: string;
  order_index: number;
  question_type: QuestionType;
  title: string;
  description: string | null;
  is_required: boolean;
  options_json: string | null;
  validation_rules: string | null;
}

export interface PublicForm {
  id: string;
  title: string;
  description: string | null;
  share_slug: string;
  theme_settings: string | null;
  questions: PublicQuestion[];
}

export interface AnswerInput {
  question_id: string;
  answer_text?: string;
  answer_json?: string;
}

export interface AnswerResponse {
  id: string;
  question_id: string;
  question_title: string;
  question_type: QuestionType;
  answer_text: string | null;
  answer_json: string | null;
  created_at: string;
}

export interface SingleResponseDetail {
  id: string;
  form_id: string;
  submitted_at: string;
  answers: AnswerResponse[];
}

export interface QuestionStatItem {
  question_id: string;
  title: string;
  question_type: QuestionType;
  order_index: number;
  total_answers: number;
  summary_data: {
    distribution?: Record<string, number>;
    top_choice?: string;
    average?: number | null;
    min?: number;
    max?: number;
    count?: number;
    sample_count?: number;
    latest_samples?: string[];
  };
}

export interface FormAnalyticsResponse {
  form_id: string;
  form_title: string;
  total_responses: number;
  question_stats: QuestionStatItem[];
}
