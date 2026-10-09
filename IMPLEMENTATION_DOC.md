# Typeform Fullstack Clone — Architecture & Implementation Document

## 1. Executive Summary & Scope

This project is a high-fidelity, production-grade clone of **Typeform** built to satisfy the **SDE Fullstack Assignment** specification while replicating the signature visual language and interactive feel of the modern Typeform web platform (as documented in the screenshots and assignment markdown).

The project is split into two primary layers:
1. **Frontend (`/frontend`)**: Next.js (App Router, TypeScript, modern CSS & TailwindCSS tokens) featuring:
   - **Modern Marketing / Showcase Landing Page**: Sleek dark aesthetic matching the screenshots, dynamic glowing ambient backgrounds, interactive animated micro-demos with 3D perspective tilt, tab switching between feature flows (*ASK*, *ACT*, *LEARN*), social proof, and integration galleries.
   - **Form Builder**: Drag-and-drop question reordering, question settings sidebar, live split-screen preview, multi-type question engine, and publishing controls.
   - **Conversational Respondent Flow**: Full-screen, one-question-at-a-time filling experience with smooth directional transitions, keyboard navigation (Enter, Tab, arrows, hotkeys `[A]`, `[B]`, etc.), progress bar, and animated completion screen.
   - **Responses & Analytics Dashboard**: Submissions table, per-question aggregation charts, individual response viewer, and CSV export.
2. **Backend (`/backend`)**: Python with **FastAPI** (fast, type-safe with Pydantic v2, async, auto-generating OpenAPI docs):
   - Clean REST API for Form CRUD, question management, public form retrieval, and response ingestion.
   - **Database**: SQLite with SQLAlchemy ORM (custom schema designed with foreign keys, cascading deletes, and JSON configuration support).
   - Database seeding script with pre-populated realistic forms and responses for immediate out-of-the-box demonstration.
3. **Containerization & Deployment (`docker-compose.yml`, `Dockerfile`s)**:
   - Full Docker containerization for both frontend and backend, with optional Nginx reverse proxy.
   - Configured for 100% free-tier public cloud deployment (Render, Koyeb, Fly.io, or Vercel).

---

## 2. Infrastructure & Hosting Analysis: Docker vs. Nginx

### A. Comparison & Architecture Evaluation

The assignment requires the application to be reviewed live by an evaluator via a hosted link, while also requiring robust Docker containerization.

| Dimension | Standalone Nginx on Host | Bare Host Scripts | **Recommended: Dockerized Services + Free Cloud Hosting** |
| :--- | :--- | :--- | :--- |
| **Portability** | Requires installing OS packages, configuring systemd services, and debugging host env mismatches. | High chance of "works on my machine" failures during evaluation. | **100% Reproducible**. A single command `docker compose up --build` launches everything identical to cloud. |
| **Reverse Proxy (Nginx)** | Hard to configure SSL/certs manually on free cloud tiers. | None. | **Embedded Nginx container**: provides single-origin routing (`/api/*` -> FastAPI, `/*` -> Next.js), eliminating CORS issues. |
| **Evaluator Experience** | Hard to spin up independently. | Requires installing Python 3.14 + Node 26. | Evaluator can inspect the live web link, OR clone the repo and run `docker compose up`. |

### B. Free-Tier Cloud Hosting Strategy (Free Alternatives for Review)

To ensure the executive/evaluator can immediately access the live demo online at zero cost:

1. **Top Free Tier Option: Koyeb or Render (Native Docker Hosting)**:
   - **Render**: Free web service tier supporting direct `Dockerfile` deployments. You can deploy the FastAPI backend using Docker for free, and deploy Next.js frontend on Vercel (free, high performance).
   - **Koyeb**: Offers free Docker container hosting with global edge network and built-in HTTPS domain (`*.koyeb.app`).
   - **Fly.io**: Free allowance with Docker container deployment via `fly launch`.
2. **Zero-Configuration Split Hosting (Fastest & Most Reliable Free Setup)**:
   - **Frontend on Vercel**: Connects directly to GitHub repo with 1 click; gives a free `https://your-typeform.vercel.app` domain with instant Next.js edge performance.
   - **Backend on Render (Docker)**: Automatically builds `/backend/Dockerfile` on Git push; gives a free `https://your-typeform-api.onrender.com` domain with automated OpenAPI `/docs`.
   - **Local & VPS**: Fully orchestrated with `docker-compose.yml` (Frontend + Backend + Nginx) for single-command evaluation.

---

## 3. UI/UX & Visual Design Strategy (Matching Screenshots & Typeform Aesthetics)

The screenshots exhibit Typeform's signature modern design language:
- **Dark Elegance**: Deep background `#111113` / `#16161a` with subtle borders `#27272a` and soft lavender / electric purple ambient glow `#8b5cf6`, `#a855f7`, `#ec4899`.
- **Hero & Landing Showcase**:
  - Top navigation bar with blurred backdrop (`backdrop-filter: blur(12px)`).
  - Elegant serif display typography for headlines paired with clean geometric sans-serif for UI (*Inter* or *Outfit*).
  - Flow tabs (*ASK - Intelligent Forms*, *ACT - Growth Flow*, *LEARN - Research Flow*) with animated progress highlight indicator.
- **Creative Side Motion Micro-Demos (Zero Load Lag & Crisp 60fps)**:
  - Interactive, dynamic live UI previews with 3D perspective tilt that respond to cursor movement and automatic subtle breathing animations:
    - **Intelligent Forms Showcase**: Floating glassmorphic survey cards ("Rate your recent class ★★★★★", floating prompt "Build a feedback form for my fitness studio", live avatar pills).
    - **Growth Flow Showcase**: Flow step cards ("Enrich contact data", "Contact added to PROSPECT LIST", "Sign up for more classes!").
    - **Research Flow Showcase**: Interactive AI interview simulation ("How familiar are you with e-bikes?", dynamic pulsating audio wave "Listening...").
- **Form Builder Experience**:
  - Three-column layout: Left navigation (Question list & drag-drop reordering), Center workspace (active question editor & live interactive preview tab), Right inspector (required toggle, question settings, help text, choices manager).
  - Quick action toolbar: Add Question menu with icons for all 8 required types.
- **Respondent Form-Filling Experience**:
  - Immersive full-screen experience with no distractions.
  - Progress bar with completion percentage.
  - Smooth directional slide/fade transitions: advancing slides up/in, navigating backwards reverses the transition.
  - Keyboard navigation: `Enter` to submit/advance, `Up`/`Down` or `Shift+Tab`/`Tab` to navigate, hotkeys `A`, `B`, `C`... for multiple choice options.
  - Instant validation feedback with micro-shake animations on errors.
  - Celebratory thank-you screen upon submission.

---

## 4. Database Schema Design (SQLite + SQLAlchemy)

```mermaid
erDiagram
    FORMS ||--o{ QUESTIONS : contains
    FORMS ||--o{ RESPONSES : receives
    RESPONSES ||--o{ ANSWERS : includes
    QUESTIONS ||--o{ ANSWERS : answers_to

    FORMS {
        string id PK "UUID"
        string title
        string description
        string status "draft | published"
        string share_slug UNIQUE
        string theme_settings "JSON (accent_color, bg_color, font)"
        datetime created_at
        datetime updated_at
    }

    QUESTIONS {
        string id PK "UUID"
        string form_id FK
        integer order_index
        string question_type "short_text | long_text | multiple_choice | dropdown | email | number | yes_no | rating"
        string title
        string description
        boolean is_required
        string options_json "JSON list of options for choice/dropdown"
        string validation_rules "JSON (min, max, etc.)"
        datetime created_at
        datetime updated_at
    }

    RESPONSES {
        string id PK "UUID"
        string form_id FK
        datetime completed_at
        string respondent_ip_hash
    }

    ANSWERS {
        string id PK "UUID"
        string response_id FK
        string question_id FK
        string answer_text
        string answer_json "JSON for complex values"
        datetime created_at
    }
```

---

## 5. Backend REST API Architecture (FastAPI)

### Form Management Endpoints (`/api/forms`)
- `GET /api/forms`: List all forms with status, question count, and submission count.
- `POST /api/forms`: Create a new form (with default welcome/first question).
- `GET /api/forms/{form_id}`: Get full form definition including ordered questions.
- `PUT /api/forms/{form_id}`: Update form metadata (title, description, settings).
- `POST /api/forms/{form_id}/duplicate`: Duplicate an existing form with its questions.
- `DELETE /api/forms/{form_id}`: Delete a form and its questions/submissions.
- `PATCH /api/forms/{form_id}/publish`: Toggle publish state (generate/invalidate share link).

### Question Endpoints (`/api/forms/{form_id}/questions`)
- `POST /api/forms/{form_id}/questions`: Add a new question.
- `PUT /api/forms/{form_id}/questions/{question_id}`: Update question details, type, or settings.
- `DELETE /api/forms/{form_id}/questions/{question_id}`: Delete a question.
- `PUT /api/forms/{form_id}/questions/reorder`: Update `order_index` for all questions in bulk.

### Public Respondent Endpoints (`/api/public`)
- `GET /api/public/forms/{share_slug}`: Fetch published form and questions (no authentication required).
- `POST /api/public/forms/{share_slug}/submit`: Validate answers against schema and store submission.

### Analytics & Results Endpoints (`/api/forms/{form_id}/results`)
- `GET /api/forms/{form_id}/responses`: List all submissions with timestamp and summary answers.
- `GET /api/forms/{form_id}/responses/{response_id}`: Detailed view of a single response.
- `GET /api/forms/{form_id}/analytics`: Aggregated statistics per question (choice distribution counts, average rating/number, total completion rate).
- `GET /api/forms/{form_id}/export/csv`: Export submissions as CSV format.

---

## 6. Frontend Component Architecture (Next.js 15+ App Router)

```
frontend/
├── app/
│   ├── page.tsx                    # Landing Page (Hero, Video/Mesh Cards, Showcase, Tabs)
│   ├── dashboard/
│   │   └── page.tsx                # Forms List Dashboard (CRUD, duplicate, status, counts)
│   ├── builder/
│   │   └── [formId]/
│   │       └── page.tsx            # Form Builder (Left list, Center editor/preview, Right settings)
│   ├── share/
│   │   └── [slug]/
│   │       └── page.tsx            # Public Respondent Flow (One-at-a-time, keyboard nav)
│   └── forms/
│       └── [formId]/
│           └── results/
│               └── page.tsx        # Responses Table & Analytics Dashboard
├── components/
│   ├── landing/                    # Hero, AnimatedShowcaseCard, VideoMesh, FlowTabs
│   ├── builder/                    # QuestionList, QuestionEditor, LivePreview, TypePickerModal
│   ├── respondent/                 # QuestionCard, KeyboardHelper, ProgressBar, ThankYouScreen
│   │   └── inputs/                 # ShortTextInput, ChoiceInput, RatingInput, YesNoInput, etc.
│   ├── dashboard/                  # FormCard, CreateFormModal, StatusBadge
│   ├── results/                    # SubmissionsTable, StatsOverview, ResponseDetailModal
│   └── ui/                         # Button, Input, Modal, Dropdown, Toast, GlassCard
└── lib/
    ├── api.ts                      # Typed API client for FastAPI backend
    └── types.ts                    # Shared TypeScript interfaces
```

---

## 7. Implementation Roadmap & Milestones

- **Milestone 1 (Repo & Foundation)**:
  - Dockerfiles (`frontend/Dockerfile`, `backend/Dockerfile`) and `docker-compose.yml`.
  - FastAPI project initialized with SQLAlchemy models, SQLite configuration, and seed data.
  - Verification test script.
- **Milestone 2 (Backend Core API)**:
  - Form CRUD, question reordering, public respondent submission, and analytics endpoints.
- **Milestone 3 (Landing Page & Design System)**:
  - Next.js application with dark aesthetic, Google Fonts typography, glowing ambient lighting, and interactive 3D motion micro-demos matching the screenshots.
- **Milestone 4 (Creator Dashboard & Builder)**:
  - Dashboard with form metrics and CRUD actions.
  - Typeform drag-and-drop question builder with live interactive split-screen preview and settings drawer.
- **Milestone 5 (Respondent Flow)**:
  - Fullscreen conversational one-question-at-a-time runner with keyboard navigation, directional transitions, validation, and completion screen.
- **Milestone 6 (Results, Analytics & CSV Export)**:
  - Submission table, detailed responses drawer, and stats charts.
- **Milestone 7 (Packaging & Deployment)**:
  - Docker testing, verification, README documentation, and instructions for free-tier cloud deployment.
