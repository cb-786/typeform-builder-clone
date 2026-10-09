import json
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Typeform Clone API" in data["message"]

def test_list_forms():
    response = client.get("/api/forms")
    assert response.status_code == 200
    forms = response.json()
    assert isinstance(forms, list)
    assert len(forms) >= 2
    # Check seeded forms exist
    slugs = [f["share_slug"] for f in forms]
    assert "feedback-2026" in slugs
    assert "dev-survey" in slugs

def test_create_and_get_form():
    payload = {
        "title": "Unit Test Form",
        "description": "Testing form creation",
        "theme_settings": '{"accentColor": "#6366f1"}'
    }
    create_resp = client.post("/api/forms", json=payload)
    assert create_resp.status_code == 201
    form_data = create_resp.json()
    form_id = form_data["id"]
    assert form_data["title"] == "Unit Test Form"
    assert len(form_data["questions"]) == 1  # Default starter question

    # Fetch form by id
    get_resp = client.get(f"/api/forms/{form_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == form_id

def test_duplicate_form():
    forms = client.get("/api/forms").json()
    original_id = forms[0]["id"]

    dup_resp = client.post(f"/api/forms/{original_id}/duplicate")
    assert dup_resp.status_code == 201
    dup_data = dup_resp.json()
    assert "(Copy)" in dup_data["title"]
    assert dup_data["status"] == "draft"

def test_add_and_reorder_questions():
    f_resp = client.post("/api/forms", json={"title": "Reorder Test Form"})
    form_id = f_resp.json()["id"]

    q2_resp = client.post(f"/api/forms/{form_id}/questions", json={
        "title": "Rating Question",
        "question_type": "rating",
        "is_required": True
    })
    assert q2_resp.status_code == 201
    q2_id = q2_resp.json()["id"]

    q3_resp = client.post(f"/api/forms/{form_id}/questions", json={
        "title": "Choice Question",
        "question_type": "multiple_choice",
        "options_json": '["A", "B"]'
    })
    assert q3_resp.status_code == 201
    q3_id = q3_resp.json()["id"]

    reorder_payload = {
        "questions": [
            {"id": q3_id, "order_index": 0},
            {"id": q2_id, "order_index": 1}
        ]
    }
    reorder_resp = client.put(f"/api/forms/{form_id}/questions/reorder", json=reorder_payload)
    assert reorder_resp.status_code == 200

def test_public_form_flow():
    resp = client.get("/api/public/forms/feedback-2026")
    assert resp.status_code == 200
    data = resp.json()
    assert data["share_slug"] == "feedback-2026"
    assert len(data["questions"]) > 0

    draft_resp = client.get("/api/public/forms/summit-rsvp")
    assert draft_resp.status_code == 403

def test_public_submission_validation():
    form_data = client.get("/api/public/forms/feedback-2026").json()
    questions = form_data["questions"]
    name_q = next(q for q in questions if q["question_type"] == "short_text")
    email_q = next(q for q in questions if q["question_type"] == "email")

    # Missing required field
    bad_submission = {
        "answers": [
            {"question_id": name_q["id"], "answer_text": ""}
        ]
    }
    res = client.post("/api/public/forms/feedback-2026/submit", json=bad_submission)
    assert res.status_code == 422

    # Invalid email format
    bad_email_sub = {
        "answers": [
            {"question_id": name_q["id"], "answer_text": "Test User"},
            {"question_id": email_q["id"], "answer_text": "not-an-email"}
        ]
    }
    res = client.post("/api/public/forms/feedback-2026/submit", json=bad_email_sub)
    assert res.status_code == 422

    # Valid submission mapping all required fields with appropriate valid values
    answers = []
    for q in questions:
        if not q["is_required"]:
            continue
        val = "Valid Answer"
        if q["question_type"] == "email":
            val = "tester@domain.com"
        elif q["question_type"] == "rating":
            val = "8"
        elif q["question_type"] == "yes_no":
            val = "Yes"
        elif q["question_type"] == "multiple_choice":
            options = json.loads(q["options_json"]) if q["options_json"] else ["Opt1"]
            val = options[0]
        answers.append({"question_id": q["id"], "answer_text": val})

    res = client.post("/api/public/forms/feedback-2026/submit", json={"answers": answers})
    assert res.status_code == 201
    assert res.json()["success"] is True

def test_results_and_analytics():
    forms = client.get("/api/forms").json()
    feedback_form = next(f for f in forms if f["share_slug"] == "feedback-2026")
    form_id = feedback_form["id"]

    resp_list = client.get(f"/api/forms/{form_id}/responses")
    assert resp_list.status_code == 200
    submissions = resp_list.json()
    assert len(submissions) >= 5

    analytics_resp = client.get(f"/api/forms/{form_id}/analytics")
    assert analytics_resp.status_code == 200
    stats = analytics_resp.json()
    assert stats["total_responses"] >= 5
    assert len(stats["question_stats"]) > 0

    csv_resp = client.get(f"/api/forms/{form_id}/export/csv")
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    assert "Submission ID" in csv_resp.text
