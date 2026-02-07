"""
Task management endpoints for CRUD operations.
All endpoints require authentication and enforce user_id-based access control.
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel, Field
from typing import Optional
from database import get_session
from models import Task, User
from auth import verify_user_access


router = APIRouter()


# Request/Response Models
class TaskCreateRequest(BaseModel):
    """Request body for creating a new task."""
    title: str = Field(min_length=1, max_length=100, description="Task title (1-100 characters)")
    description: Optional[str] = Field(None, max_length=500, description="Task description (max 500 characters)")


class TaskUpdateRequest(BaseModel):
    """Request body for updating a task."""
    title: str = Field(min_length=1, max_length=100, description="Task title (1-100 characters)")
    description: Optional[str] = Field(None, max_length=500, description="Task description (max 500 characters)")


class TaskResponse(BaseModel):
    """Task data returned in API responses."""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    is_complete: bool
    created_at: str
    updated_at: str


class TasksListResponse(BaseModel):
    """Response for GET /tasks endpoint."""
    tasks: list[TaskResponse]
    count: int


@router.get("/{user_id}/tasks", response_model=TasksListResponse)
def get_tasks(
    user_id: str,
    user: User = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    """
    Get all tasks for the authenticated user.
    Tasks are ordered by creation date (newest first).

    Args:
        user_id: User ID from URL (must match authenticated user)
        user: Authenticated user from JWT token
        session: Database session

    Returns:
        TasksListResponse: List of tasks and total count

    Raises:
        HTTPException 401: Invalid or missing JWT token
        HTTPException 403: user_id doesn't match authenticated user

    Example:
        GET /api/{user_id}/tasks
        Authorization: Bearer <jwt_token>

        Response:
        {
            "tasks": [
                {
                    "id": 1,
                    "user_id": "...",
                    "title": "Buy groceries",
                    "description": "Milk, eggs, bread",
                    "is_complete": false,
                    "created_at": "2026-01-22T10:00:00",
                    "updated_at": "2026-01-22T10:00:00"
                }
            ],
            "count": 1
        }
    """
    # Query tasks filtered by user_id, ordered by newest first
    statement = (
        select(Task)
        .where(Task.user_id == user.id)
        .order_by(Task.created_at.desc())
    )
    tasks = session.exec(statement).all()

    # Convert to response format
    task_responses = [
        TaskResponse(
            id=task.id,
            user_id=str(task.user_id),
            title=task.title,
            description=task.description,
            is_complete=task.is_complete,
            created_at=task.created_at.isoformat(),
            updated_at=task.updated_at.isoformat(),
        )
        for task in tasks
    ]

    return TasksListResponse(tasks=task_responses, count=len(task_responses))


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    request: TaskCreateRequest,
    user: User = Depends(verify_user_access),
    session: Session = Depends(get_session),
):
    """
    Create a new task for the authenticated user.

    Args:
        user_id: User ID from URL (must match authenticated user)
        request: Task creation request with title and optional description
        user: Authenticated user from JWT token
        session: Database session

    Returns:
        TaskResponse: Created task data

    Raises:
        HTTPException 400: Invalid title (empty, too long, or whitespace-only)
        HTTPException 401: Invalid or missing JWT token
        HTTPException 403: user_id doesn't match authenticated user

    Example:
        POST /api/{user_id}/tasks
        Authorization: Bearer <jwt_token>
        Content-Type: application/json

        {
            "title": "Buy groceries",
            "description": "Milk, eggs, bread"
        }

        Response (201):
        {
            "id": 1,
            "user_id": "...",
            "title": "Buy groceries",
            "description": "Milk, eggs, bread",
            "is_complete": false,
            "created_at": "2026-01-22T10:00:00",
            "updated_at": "2026-01-22T10:00:00"
        }
    """
    # Validate title is not whitespace-only
    if not request.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title cannot be empty or whitespace-only.",
        )

    # Create new task
    new_task = Task(
        user_id=user.id,
        title=request.title.strip(),
        description=request.description.strip() if request.description else None,
        is_complete=False,
    )

    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    # Return created task
    return TaskResponse(
        id=new_task.id,
        user_id=str(new_task.user_id),
        title=new_task.title,
        description=new_task.description,
        is_complete=new_task.is_complete,
        created_at=new_task.created_at.isoformat(),
        updated_at=new_task.updated_at.isoformat(),
    )
