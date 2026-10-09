# Typeform Fullstack Clone — Architecture & Implementation Document

## 1. Executive Summary & Scope

This project is a high-fidelity, production-grade clone of **Typeform** built to satisfy the **SDE Fullstack Assignment** specification while replicating the signature visual language and interactive feel of the modern Typeform web platform (as documented in the screenshots and assignment markdown).

The project is split into two primary layers:
1. **Frontend (`/frontend`)**: Next.js (App Router, TypeScript, Vanilla CSS + Tailwind/CSS Modules) featuring:
   - **Modern Marketing / Showcase Landing Page**: Sleek dark aesthetic matching the screenshots, dynamic glowing ambient backgrounds, interactive animated video/motion cards with 3D perspective, tab switching between feature flows (*ASK*, *ACT*, *LEARN*), social proof, and integration galleries.
   - **Form Builder**: Drag-and-drop question reordering, question settings sidebar, live split-screen preview, multi-type question engine, and publishing controls.
   - **Conversational Respondent Flow**: Full-screen, one-question-at-a-time filling experience with smooth directional transitions, keyboard navigation (Enter, Tab, arrows, hotkeys `[A]`, `[B]`, etc.), progress bar, and animated completion screen.
   - **Responses & Analytics Dashboard**: Submissions table, per-question aggregation charts, individual response viewer, and CSV export.
2. **Backend (`/backend`)**: Python with **FastAPI** (fast, type-safe with Pydantic v2, async, auto-generating OpenAPI docs):
   - Clean REST API for Form CRUD, question management, public form retrieval, and response ingestion.
   - **Database**: SQLite with SQLAlchemy ORM (custom schema designed with foreign keys, cascading deletes, and JSON configuration support).
   - Database seeding script with pre-populated realistic forms and responses for immediate out-of-the-box demonstration.

---

## 2. Infrastructure & Hosting Analysis: Docker vs. Nginx

The prompt specifically asked: *"tell me in the doc if we should use nginx or docker as well because we will need to host it as well so if it would be easier"*.

### A. Comparison Matrix

| Aspect | Standalone Nginx on Host | Docker Containerization | **Recommended: Docker Compose + Nginx Reverse Proxy** |
| :--- | :--- | :--- | :--- |
| **Portability** | Low. Host OS must have Python 3.14+, Node.js, and Nginx installed manually. | High. Any server with Docker can run the entire stack with `docker compose up`. | **Highest**. Single command spins up Frontend, Backend, and Nginx gateway. |
| **Hosting Deployment** | High effort. Requires configuring systemd services for FastAPI and Next.js, firewall rules, and certbot on the bare VPS. | Low effort on container platforms (Render, Railway, Fly.io, or any $5 VPS). | **Lowest friction**. One Git push or `docker compose up -d` on any cloud VPS (Ubuntu, Debian, EC2, etc.). |
| **CORS & Domain Routing** | Must configure separate domains or host Nginx manually. | Backend and Frontend run on separate ports, requiring CORS headers across origins. | **Unified Domain**: Nginx routes `/api/*` to FastAPI (`:8000`) and `/*` to Next.js (`:3000`), completely eliminating cross-origin CORS hurdles and SSL certificate complexity. |
| **SQLite Persistence** | Local file on host. | Mounted via Docker volume to prevent data loss across restarts. | Mounted via Docker volume (`./backend/data/typeform.db:/app/data/typeform.db`). |

### B. Final Recommendation & Hosting Strategy

**We recommend Docker containerization with a lightweight Docker Compose setup (Next.js + FastAPI + optional Nginx reverse proxy):**
1. **Local Development**:
   - Run directly: `npm run dev` for frontend, `uvicorn app.main:app --reload` for backend.
2. **Production Hosting Options**:
   - **Option 1 (Easiest Cloud PaaS — Zero DevOps)**:
     - Deploy **Frontend** on **Vercel** (connects directly to GitHub repo, instant Next.js SSR, free tier).
     - Deploy **Backend** on **Render** or **Railway** (uses backend `Dockerfile`, free/low-cost Python hosting with persistent SQLite disk).
   - **Option 2 (Single VPS / Cloud Server with Docker Compose)**:
     - A single `docker-compose.yml` defining `frontend`, `backend`, and `nginx:alpine` routing port 80/443. All services start in isolation with persistent SQLite volume.

---

## 3. UI/UX & Visual Design Strategy (Matching Screenshots & Typeform Aesthetics)

The screenshots exhibit Typeform's signature modern design language:
- **Dark Elegance**: Deep background `#111113` / `#16161a` with subtle borders `#27272a` and soft lavender / electric purple ambient glow `#8b5cf6`, `#a855f7`, `#ec4899`.
- **Hero & Landing Showcase**:
  - Top navigation bar with blurred backdrop (`backdrop-filter: blur(12px)`).
  - Elegant serif display typography for headlines (*Playfair Display* / *Newsreader* / *Fraunces* or Google Fonts equivalent) paired with clean geometric sans-serif for UI (*Inter* or *Outfit*).
  - Flow tabs (*ASK - Intelligent Forms*, *ACT - Growth Flow*, *LEARN - Research Flow*) with animated progress highlight indicator.
- **Side "Videos" & Interactive Motion Visuals (Being Creative)**:
  - In Typeform's marketing site, side video showcases demonstrate interactive forms and AI enrichments with floating cards and smooth glowing motion.
  - **Creative Implementation**:
    - We will build **dynamic, interactive interactive visual canvases**: high-frame-rate CSS/SVG keyframe-animated floating glassmorphic cards (e.g. "Rate your recent class ★★★★★", "Enrich contact data", "AI Listening...").
    - Option to embed high-quality lightweight looping WebM/MP4 video backgrounds or animated SVG/Canvas mesh gradients with realistic floating UI overlays that react to cursor movement (parallax 3D tilt).
- **Form Builder Experience**:
  - Three-column layout: Left navigation (Question list & drag-drop reordering), Center workspace (active question editor & live interactive preview tab), Right inspector (required toggle, question settings, help text, choices manager).
  - Quick action toolbar: Add Question menu with icons for all 8 required types.
- **Respondent Form-Filling Experience**:
  - Immersive full-screen experience with no distractions.
  - Progress bar at the top or bottom with completion percentage.
  - Smooth directional slide/fade transitions: advancing slides up/left, navigating backwards reverses the transition.
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

## 7. Step-by-Step Implementation Roadmap

### Phase 1: Repository & Foundation Setup
- [x] Initialize Git repository on `main` branch.
- [ ] Create project structure: `/frontend`, `/backend`, `docker-compose.yml`, `.gitignore`.
- [ ] Backend foundation: FastAPI project setup with SQLite database connection, SQLAlchemy models, and Alembic/schema init.
- [ ] Seed script: Pre-fill database with sample forms and mock respondent submissions.

### Phase 2: Backend Core API Implementation
- [ ] Implement CRUD endpoints for forms and question reordering.
- [ ] Implement public form retrieval and response submission with server-side validation.
- [ ] Implement analytics aggregation and CSV export endpoints.
- [ ] Write integration test verification script for all endpoints.

### Phase 3: Frontend Foundation & Landing Page
- [ ] Initialize Next.js project with App Router, TypeScript, and TailwindCSS / modern CSS tokens.
- [ ] Build the Typeform-style landing page with dark theme, ambient glow, navigation, interactive side motion cards (creative animated video/card showcases), and flow tabs.

### Phase 4: Creator Dashboard & Form Builder
- [ ] Creator dashboard with form cards, status badges, response counts, duplicate/delete/rename modals.
- [ ] Form builder interface:
  - Drag-and-drop question reordering (using lightweight HTML5 drag-and-drop or `@dnd-kit`).
  - Question editor supporting all 8 question types with live validation.
  - Per-question settings drawer (is_required, help text, option manager).
  - Real-time live preview tab.
  - Share link modal with copy-to-clipboard functionality.

### Phase 5: Respondent Flow (The Signature Typeform Experience)
- [ ] Full-screen respondent layout with zero distractions.
- [ ] Directional view transition animations between questions (up/down or slide transitions).
- [ ] Keyboard navigation handling (`Enter`, `Tab`, arrow keys, letter keys for choices).
- [ ] Client-side validation before advancing to the next question.
- [ ] Thank-you screen with animated completion checkmark.

### Phase 6: Results, Analytics & Polish
- [ ] Responses table with timestamp, pagination, and expandable detail view.
- [ ] Question summary statistics (choice breakdown percentages, average ratings).
- [ ] CSV export download.
- [ ] Toast notification system for user actions (form saved, link copied, errors).

### Phase 7: Containerization & Deployment Documentation
- [ ] Multi-stage `Dockerfile` for Next.js frontend.
- [ ] `Dockerfile` for FastAPI backend.
- [ ] `docker-compose.yml` orchestrating frontend, backend, and Nginx.
- [ ] Comprehensive `README.md` with architecture diagrams, schema details, local run instructions, and cloud deployment guide (Vercel + Render/Railway).
