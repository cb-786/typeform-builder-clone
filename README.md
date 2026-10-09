# Typeform Fullstack Clone

A modern, high-fidelity Typeform clone replicating Typeform's signature design system, drag-and-drop form builder, public conversational respondent flow, and real-time response analytics.

---

## Tech Stack

- **Frontend**: Next.js (App Router, TypeScript, modern CSS & TailwindCSS tokens)
- **Backend**: Python 3.12+ with **FastAPI**, **Pydantic v2**, and **SQLAlchemy**
- **Database**: **SQLite** (structured schema with foreign keys and cascading deletes)
- **Containerization**: **Docker** & **Docker Compose**

---

## Database Schema Design

```
+-----------------------------------------------------------+
|                          FORMS                            |
+-----------------------------------------------------------+
| id (UUID, PK)                                             |
| title (String, Not Null)                                  |
| description (Text, Nullable)                              |
| status (String: 'draft' | 'published')                    |
| share_slug (String, Unique, Index)                        |
| theme_settings (JSON Text: colors, fonts)                 |
| created_at (DateTime UTC)                                 |
| updated_at (DateTime UTC)                                 |
+-----------------------------+-----------------------------+
                              | 1
                              |
                              | has many (CASCADE)
                              v *
+-----------------------------------------------------------+
|                        QUESTIONS                          |
+-----------------------------------------------------------+
| id (UUID, PK)                                             |
| form_id (UUID FK -> forms.id)                             |
| order_index (Integer, Index)                              |
| question_type (String: short_text, email, rating, etc.)   |
| title (Text, Not Null)                                    |
| description (Text, Nullable)                              |
| is_required (Boolean)                                     |
| options_json (JSON Text Array for choices)                |
| validation_rules (JSON Text)                              |
| created_at / updated_at (DateTime UTC)                    |
+-----------------------------+-----------------------------+
                              |
                              +--------------------+
                                                   | 1
                                                   |
                                                   v *
+-----------------------------+       +-----------------------------+
|          RESPONSES          |       |           ANSWERS           |
+-----------------------------+       +-----------------------------+
| id (UUID, PK)               | 1   * | id (UUID, PK)               |
| form_id (UUID FK)           +------>| response_id (UUID FK)       |
| submitted_at (DateTime UTC) |       | question_id (UUID FK)       |
| respondent_ip_hash (String) |       | answer_text (Text, Nullable)|
+-----------------------------+       | answer_json (Text, Nullable)|
                                      | created_at (DateTime UTC)   |
                                      +-----------------------------+
```

---

## Quickstart & Local Setup

### Option 1: Run with Docker Compose (Recommended)

Run the entire backend with auto-seeding and persistent SQLite volume in one command:

```bash
docker compose up --build
```

- API Base: `http://localhost:8000`
- Interactive Swagger OpenAPI Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/health`

### Option 2: Run Backend Natively with Python Virtualenv

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Seed sample forms and realistic responses:
python -m app.seed

# Run dev server with auto-reload:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run automated tests:
pytest test_backend.py -v
```

---

## Free-Tier Cloud Hosting Deployment Guide

### Deploying the Backend on Render (Free Tier with Docker)
1. Fork or push this repository to GitHub.
2. Sign in to [Render.com](https://render.com) (free account).
3. Click **New +** -> **Web Service** -> Connect your GitHub repository.
4. Set the following configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Plan**: `Free`
5. Click **Deploy Web Service**.
6. Render builds the `Dockerfile` automatically and provides a live public HTTPS URL:
   `https://<your-service-name>.onrender.com/docs`

---

## API Overview

### Forms
- `GET /api/forms` — List all forms with question counts and response counts.
- `POST /api/forms` — Create a new form (pre-populated with starter question).
- `GET /api/forms/{id}` — Get form details with ordered questions.
- `PUT /api/forms/{id}` — Update form title, description, or theme.
- `POST /api/forms/{id}/duplicate` — Duplicate form and its questions.
- `PATCH /api/forms/{id}/publish` — Toggle between draft and published status.
- `DELETE /api/forms/{id}` — Delete form and all associated questions & responses.

### Questions
- `POST /api/forms/{id}/questions` — Add question (short_text, email, rating, dropdown, multiple_choice, etc.).
- `PUT /api/forms/{id}/questions/{qid}` — Update question title, type, settings, or choices.
- `PUT /api/forms/{id}/questions/reorder` — Reorder questions in bulk.
- `DELETE /api/forms/{id}/questions/{qid}` — Delete question.

### Public Respondent (No Auth Required)
- `GET /api/public/forms/{share_slug}` — Public form filling endpoint.
- `POST /api/public/forms/{share_slug}/submit` — Submit answers with server validation.

### Analytics & Results
- `GET /api/forms/{id}/responses` — Submissions list with timestamps and answers.
- `GET /api/forms/{id}/responses/{rid}` — Full detail of single submission.
- `GET /api/forms/{id}/analytics` — Aggregated stats (choice distribution, average rating/numbers).
- `GET /api/forms/{id}/export/csv` — Direct CSV download of all submissions.
