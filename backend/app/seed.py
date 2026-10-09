import json
from datetime import datetime, timezone, timedelta
from .database import engine, SessionLocal, Base
from .models import Form, Question, Response, Answer

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing = db.query(Form).filter(Form.share_slug == "feedback-2026").first()
        if existing:
            print("Database already seeded with demo forms. Skipping.")
            return

        print("Seeding database with sample forms and responses...")

        now = datetime.now(timezone.utc)

        # ---------------- FORM 1: Customer Feedback (Published) ----------------
        form1 = Form(
            title="Product Experience & Customer Feedback",
            description="Help us shape the future of our product with your candid thoughts and experience.",
            status="published",
            share_slug="feedback-2026",
            theme_settings=json.dumps({
                "accentColor": "#8b5cf6",
                "backgroundColor": "#121214",
                "textColor": "#f4f4f5",
                "fontFamily": "Inter"
            }),
            created_at=now - timedelta(days=5),
            updated_at=now - timedelta(days=1)
        )
        db.add(form1)
        db.commit()
        db.refresh(form1)

        q1_1 = Question(
            form_id=form1.id,
            order_index=0,
            question_type="short_text",
            title="What is your full name?",
            description="We'd love to know who we are talking to",
            is_required=True
        )
        q1_2 = Question(
            form_id=form1.id,
            order_index=1,
            question_type="email",
            title="What is your best email address?",
            description="We will only reach out if we have questions about your feedback",
            is_required=True
        )
        q1_3 = Question(
            form_id=form1.id,
            order_index=2,
            question_type="multiple_choice",
            title="How did you first hear about us?",
            description="Select the channel where you first discovered our app",
            is_required=True,
            options_json=json.dumps([
                "Search Engine (Google/Bing)",
                "Social Media (X / LinkedIn)",
                "Friend or Colleague recommendation",
                "Podcast or Tech Newsletter",
                "Other"
            ])
        )
        q1_4 = Question(
            form_id=form1.id,
            order_index=3,
            question_type="rating",
            title="How would you rate your overall product experience?",
            description="On a scale from 1 (Poor) to 10 (Exceptional)",
            is_required=True
        )
        q1_5 = Question(
            form_id=form1.id,
            order_index=4,
            question_type="dropdown",
            title="Which team department do you primarily represent?",
            description="Choose the best match for your role",
            is_required=False,
            options_json=json.dumps([
                "Engineering & Architecture",
                "Product & Design",
                "Marketing & Growth",
                "Sales & Operations",
                "Executive Leadership"
            ])
        )
        q1_6 = Question(
            form_id=form1.id,
            order_index=5,
            question_type="yes_no",
            title="Would you recommend our product to a peer or partner?",
            description="Honest answers help us benchmark our Net Promoter Score",
            is_required=True
        )
        q1_7 = Question(
            form_id=form1.id,
            order_index=6,
            question_type="number",
            title="How many team members actively collaborate with you?",
            description="Enter the approximate number of members in your squad",
            is_required=False
        )
        q1_8 = Question(
            form_id=form1.id,
            order_index=7,
            question_type="long_text",
            title="What is one feature or enhancement you would love to see next?",
            description="Feel free to write as much detail as you like",
            is_required=False
        )

        db.add_all([q1_1, q1_2, q1_3, q1_4, q1_5, q1_6, q1_7, q1_8])
        db.commit()

        # Seed realistic responses for Form 1
        responses_data = [
            {
                "offset_hours": 72,
                "answers": [
                    (q1_1.id, "Sarah Connor"),
                    (q1_2.id, "sarah@cyberdyne.io"),
                    (q1_3.id, "Social Media (X / LinkedIn)"),
                    (q1_4.id, "9"),
                    (q1_5.id, "Engineering & Architecture"),
                    (q1_6.id, "Yes"),
                    (q1_7.id, "12"),
                    (q1_8.id, "Real-time websocket sync and collaborative editing would be game changing!")
                ]
            },
            {
                "offset_hours": 48,
                "answers": [
                    (q1_1.id, "Alex Rivera"),
                    (q1_2.id, "alex.rivera@designstudio.co"),
                    (q1_3.id, "Friend or Colleague recommendation"),
                    (q1_4.id, "10"),
                    (q1_5.id, "Product & Design"),
                    (q1_6.id, "Yes"),
                    (q1_7.id, "6"),
                    (q1_8.id, "The UI transitions are buttery smooth. Keep up the high design standards.")
                ]
            },
            {
                "offset_hours": 24,
                "answers": [
                    (q1_1.id, "Marcus Chen"),
                    (q1_2.id, "mchen@fintechflow.org"),
                    (q1_3.id, "Search Engine (Google/Bing)"),
                    (q1_4.id, "8"),
                    (q1_5.id, "Marketing & Growth"),
                    (q1_6.id, "Yes"),
                    (q1_7.id, "25"),
                    (q1_8.id, "Faster CSV export with custom date filtering.")
                ]
            },
            {
                "offset_hours": 12,
                "answers": [
                    (q1_1.id, "Elena Rostova"),
                    (q1_2.id, "elena@nordicventures.eu"),
                    (q1_3.id, "Podcast or Tech Newsletter"),
                    (q1_4.id, "9"),
                    (q1_5.id, "Executive Leadership"),
                    (q1_6.id, "Yes"),
                    (q1_7.id, "4"),
                    (q1_8.id, "Better native integrations with Notion and HubSpot.")
                ]
            },
            {
                "offset_hours": 3,
                "answers": [
                    (q1_1.id, "David Kim"),
                    (q1_2.id, "dkim@startupbuilder.dev"),
                    (q1_3.id, "Search Engine (Google/Bing)"),
                    (q1_4.id, "7"),
                    (q1_5.id, "Engineering & Architecture"),
                    (q1_6.id, "No"),
                    (q1_7.id, "2"),
                    (q1_8.id, "Offline support for slow network connections.")
                ]
            }
        ]

        for item in responses_data:
            resp = Response(
                form_id=form1.id,
                submitted_at=now - timedelta(hours=item["offset_hours"]),
                respondent_ip_hash="d3b07384d113edec"
            )
            db.add(resp)
            db.commit()
            db.refresh(resp)

            for q_id, val in item["answers"]:
                db.add(Answer(
                    response_id=resp.id,
                    question_id=q_id,
                    answer_text=val
                ))
            db.commit()

        # ---------------- FORM 2: Developer Tooling Survey (Published) ----------------
        form2 = Form(
            title="Developer Tooling & AI Adoption Survey",
            description="A quick 1-minute survey exploring modern engineering workflows and AI adoption.",
            status="published",
            share_slug="dev-survey",
            theme_settings=json.dumps({
                "accentColor": "#ec4899",
                "backgroundColor": "#09090b",
                "textColor": "#fafafa"
            }),
            created_at=now - timedelta(days=3),
            updated_at=now - timedelta(hours=6)
        )
        db.add(form2)
        db.commit()
        db.refresh(form2)

        q2_1 = Question(
            form_id=form2.id,
            order_index=0,
            question_type="multiple_choice",
            title="What is your primary programming language for daily development?",
            is_required=True,
            options_json=json.dumps(["TypeScript / JavaScript", "Python", "Go", "Rust", "Other"])
        )
        q2_2 = Question(
            form_id=form2.id,
            order_index=1,
            question_type="yes_no",
            title="Do you use AI coding assistants daily?",
            is_required=True
        )
        q2_3 = Question(
            form_id=form2.id,
            order_index=2,
            question_type="rating",
            title="Rate your satisfaction with modern frontend developer experience (1-5):",
            is_required=True
        )
        q2_4 = Question(
            form_id=form2.id,
            order_index=3,
            question_type="email",
            title="Drop your email for early access to the survey findings report:",
            is_required=False
        )
        db.add_all([q2_1, q2_2, q2_3, q2_4])
        db.commit()

        # Seed responses for Form 2
        for r_item in [
            ("TypeScript / JavaScript", "Yes", "5", "dev1@tech.com"),
            ("Python", "Yes", "4", "pythonista@ai.org"),
            ("Rust", "Yes", "5", None),
            ("Go", "No", "4", "gopher@cloud.dev")
        ]:
            resp = Response(
                form_id=form2.id,
                submitted_at=now - timedelta(hours=18)
            )
            db.add(resp)
            db.commit()
            db.refresh(resp)
            db.add(Answer(response_id=resp.id, question_id=q2_1.id, answer_text=r_item[0]))
            db.add(Answer(response_id=resp.id, question_id=q2_2.id, answer_text=r_item[1]))
            db.add(Answer(response_id=resp.id, question_id=q2_3.id, answer_text=r_item[2]))
            if r_item[3]:
                db.add(Answer(response_id=resp.id, question_id=q2_4.id, answer_text=r_item[3]))
            db.commit()

        # ---------------- FORM 3: Draft Form ----------------
        form3 = Form(
            title="AI Innovation Summit 2026 - Registration (Draft)",
            description="Pre-registration intake for the upcoming AI Summit.",
            status="draft",
            share_slug="summit-rsvp",
            created_at=now - timedelta(days=1),
            updated_at=now
        )
        db.add(form3)
        db.commit()
        db.refresh(form3)

        q3_1 = Question(
            form_id=form3.id,
            order_index=0,
            question_type="short_text",
            title="Full Name",
            is_required=True
        )
        q3_2 = Question(
            form_id=form3.id,
            order_index=1,
            question_type="email",
            title="Corporate / Work Email",
            is_required=True
        )
        db.add_all([q3_1, q3_2])
        db.commit()

        print("Database seeded successfully with 3 forms and 9 realistic respondent submissions!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
