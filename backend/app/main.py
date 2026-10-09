from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routers import forms, questions, public, results

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema tables are created
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(forms.router, prefix=settings.API_PREFIX)
app.include_router(questions.router, prefix=settings.API_PREFIX)
app.include_router(public.router, prefix=settings.API_PREFIX)
app.include_router(results.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "message": "Typeform Clone API is running",
        "docs": "/docs",
        "version": settings.PROJECT_VERSION
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
