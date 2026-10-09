import {
  Form,
  FormListItem,
  PublicForm,
  Question,
  SingleResponseDetail,
  FormAnalyticsResponse,
  AnswerInput
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options?.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (res.status === 204) {
      return null as T;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.detail || `HTTP Error ${res.status}`;
      throw new ApiError(errorMsg, res.status);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new Error(err.message || "Network connection failure");
  }
}

export const api = {
  // Forms
  getForms: () => request<FormListItem[]>("/forms"),
  getForm: (id: string) => request<Form>(`/forms/${id}`),
  createForm: (title: string, description?: string) =>
    request<Form>("/forms", {
      method: "POST",
      body: JSON.stringify({ title, description })
    }),
  updateForm: (id: string, data: Partial<Form>) =>
    request<Form>(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
  deleteForm: (id: string) =>
    request<void>(`/forms/${id}`, {
      method: "DELETE"
    }),
  duplicateForm: (id: string) =>
    request<Form>(`/forms/${id}/duplicate`, {
      method: "POST"
    }),
  togglePublish: (id: string) =>
    request<Form>(`/forms/${id}/publish`, {
      method: "PATCH"
    }),

  // Questions
  addQuestion: (formId: string, question: Partial<Question>) =>
    request<Question>(`/forms/${formId}/questions`, {
      method: "POST",
      body: JSON.stringify(question)
    }),
  updateQuestion: (formId: string, questionId: string, question: Partial<Question>) =>
    request<Question>(`/forms/${formId}/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(question)
    }),
  deleteQuestion: (formId: string, questionId: string) =>
    request<void>(`/forms/${formId}/questions/${questionId}`, {
      method: "DELETE"
    }),
  reorderQuestions: (formId: string, questions: { id: string; order_index: number }[]) =>
    request<Question[]>(`/forms/${formId}/questions/reorder`, {
      method: "PUT",
      body: JSON.stringify({ questions })
    }),

  // Public Respondent Flow
  getPublicForm: (slug: string) => request<PublicForm>(`/public/forms/${slug}`),
  submitForm: (slug: string, answers: AnswerInput[]) =>
    request<{ success: boolean; response_id: string; message: string }>(
      `/public/forms/${slug}/submit`,
      {
        method: "POST",
        body: JSON.stringify({ answers })
      }
    ),

  // Results & Analytics
  getResponses: (formId: string) => request<SingleResponseDetail[]>(`/forms/${formId}/responses`),
  getResponse: (formId: string, responseId: string) =>
    request<SingleResponseDetail>(`/forms/${formId}/responses/${responseId}`),
  getAnalytics: (formId: string) => request<FormAnalyticsResponse>(`/forms/${formId}/analytics`),
  getExportCsvUrl: (formId: string) => `${API_BASE}/forms/${formId}/export/csv`
};
