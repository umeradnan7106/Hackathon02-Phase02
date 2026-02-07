"""
Database models for User and Task entities.
Uses SQLModel for ORM with automatic table creation.
"""

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from uuid import UUID, uuid4


class User(SQLModel, table=True):
    """
    User account model - managed by Better Auth library.

    Attributes:
        id: Unique user identifier (UUID v4)
        email: User's email address (unique, required for login)
        name: User's display name (optional)
        password_hash: Bcrypt-hashed password (never expose in API responses)
        created_at: Account creation timestamp

    Relationships:
        tasks: All tasks owned by this user (one-to-many)
    """

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False, max_length=255)
    name: Optional[str] = Field(default=None, max_length=100)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user", cascade_delete=True)


class Task(SQLModel, table=True):
    """
    Task model for todo items.

    Attributes:
        id: Auto-incrementing task identifier
        user_id: Foreign key to users table (CASCADE delete)
        title: Task title (1-100 characters, required)
        description: Task details (max 500 characters, optional)
        is_complete: Completion status (default: False)
        created_at: Task creation timestamp
        updated_at: Last modification timestamp

    Relationships:
        user: The user who owns this task (many-to-one)

    Indexes:
        idx_tasks_user_id: For fast filtering by user_id
        idx_tasks_is_complete: For filtering complete/incomplete tasks
    """

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(nullable=False, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    is_complete: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")
