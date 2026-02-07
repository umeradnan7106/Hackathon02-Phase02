"""
Authentication endpoints for user signup and login.
Handles email/password authentication with JWT tokens.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr, Field
from database import get_session
from models import User
from auth import hash_password, verify_password, create_access_token


router = APIRouter()


# Request/Response Models
class SignupRequest(BaseModel):
    """Request body for user signup."""
    email: EmailStr
    password: str = Field(min_length=8, description="Minimum 8 characters")
    name: str | None = None


class LoginRequest(BaseModel):
    """Request body for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User data returned in API responses (excludes password_hash)."""
    id: str
    email: str
    name: str | None
    created_at: str


class AuthResponse(BaseModel):
    """Authentication response with token and user data."""
    token: str
    user: UserResponse
    message: str


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(
    request: SignupRequest,
    session: Session = Depends(get_session),
):
    """
    Create a new user account.

    Args:
        request: Signup request with email, password, and optional name
        session: Database session

    Returns:
        AuthResponse: Success message with user data (no token on signup)

    Raises:
        HTTPException 400: Invalid email format or password too short
        HTTPException 409: Email already registered

    Example:
        POST /api/auth/signup
        {
            "email": "user@example.com",
            "password": "securepass123",
            "name": "John Doe"
        }
    """
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered. Please use a different email or log in.",
        )

    # Hash password with bcrypt (12 rounds)
    hashed_password = hash_password(request.password)

    # Create new user
    new_user = User(
        email=request.email,
        name=request.name,
        password_hash=hashed_password,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Return user data without token (user must log in after signup)
    user_response = UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        name=new_user.name,
        created_at=new_user.created_at.isoformat(),
    )

    # For Phase II, we'll return a token immediately for convenience
    token = create_access_token(new_user.id, new_user.email)

    return AuthResponse(
        token=token,
        user=user_response,
        message="Account created successfully. You are now logged in.",
    )


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    session: Session = Depends(get_session),
):
    """
    Authenticate user and return JWT token.

    Args:
        request: Login request with email and password
        session: Database session

    Returns:
        AuthResponse: JWT token (valid 7 days) and user data

    Raises:
        HTTPException 400: Missing email or password
        HTTPException 401: Invalid credentials

    Example:
        POST /api/auth/login
        {
            "email": "user@example.com",
            "password": "securepass123"
        }

        Response:
        {
            "token": "eyJhbGciOiJIUzI1NiIs...",
            "user": {"id": "...", "email": "...", "name": "..."},
            "message": "Login successful"
        }
    """
    # Find user by email
    user = session.exec(select(User).where(User.email == request.email)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Verify password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Generate JWT token (7-day expiration)
    token = create_access_token(user.id, user.email)

    # Return token and user data
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        created_at=user.created_at.isoformat(),
    )

    return AuthResponse(
        token=token,
        user=user_response,
        message="Login successful. Welcome back!",
    )
