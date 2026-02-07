"""
Database connection and session management using SQLModel.
Creates database tables on startup and provides session dependency for FastAPI.
"""

from sqlmodel import SQLModel, create_engine, Session
from config import settings


# Create database engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,  # Log SQL queries in development
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,  # Recycle connections after 1 hour
)


def create_db_and_tables() -> None:
    """
    Create all database tables defined in SQLModel models.
    Called once during application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    FastAPI dependency that provides a database session.
    Automatically commits on success and rolls back on error.

    Yields:
        Session: SQLModel database session

    Example:
        @app.get("/tasks")
        def get_tasks(session: Session = Depends(get_session)):
            return session.exec(select(Task)).all()
    """
    with Session(engine) as session:
        yield session
