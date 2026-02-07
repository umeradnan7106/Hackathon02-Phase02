"""
FastAPI application entry point for Todo API.
Configures CORS, database, and registers route handlers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import create_db_and_tables


# Create FastAPI application instance
app = FastAPI(
    title="Todo API",
    description="Multi-user todo management API with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# Configure CORS middleware
allowed_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """
    Application startup event handler.
    Creates database tables if they don't exist.
    """
    print("Starting Todo API...")
    print(f"Database: {settings.DATABASE_URL[:50]}...")
    print(f"CORS Origins: {settings.CORS_ORIGINS}")
    create_db_and_tables()
    print("Database tables created successfully")


@app.get("/")
def root():
    """
    Health check endpoint.

    Returns:
        dict: API status and version
    """
    return {
        "message": "Todo API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "healthy",
    }


@app.get("/health")
def health_check():
    """
    Detailed health check endpoint.

    Returns:
        dict: Service health status
    """
    return {
        "status": "healthy",
        "database": "connected",
        "cors_enabled": True,
    }


# Register route handlers
from routes import auth, tasks

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
