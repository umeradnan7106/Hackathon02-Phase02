"""
JWT authentication and password hashing utilities.
Handles token creation, verification, and user authentication.
"""

from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from config import settings
from database import get_session
from models import User


# Security scheme for JWT bearer tokens
security = HTTPBearer()


# JWT configuration
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt with 12 rounds.

    Args:
        password: Plain text password

    Returns:
        str: Bcrypt hashed password
    """
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its bcrypt hash.

    Args:
        plain_password: Password to verify
        hashed_password: Stored bcrypt hash

    Returns:
        bool: True if password matches, False otherwise
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def create_access_token(user_id: UUID, email: str) -> str:
    """
    Create a JWT access token valid for 7 days.

    Args:
        user_id: User's unique identifier
        email: User's email address

    Returns:
        str: Encoded JWT token
    """
    expiration = datetime.utcnow() + timedelta(days=JWT_EXPIRATION_DAYS)
    payload = {
        "user_id": str(user_id),
        "email": email,
        "exp": expiration,
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=JWT_ALGORITHM)
    return token


def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string

    Returns:
        dict: Decoded token payload with user_id and email

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> User:
    """
    FastAPI dependency to get the currently authenticated user.
    Extracts JWT token from Authorization header and validates it.

    Args:
        credentials: HTTP Bearer token from request header
        session: Database session

    Returns:
        User: Authenticated user object

    Raises:
        HTTPException: 401 if token is invalid or user not found

    Example:
        @app.get("/protected")
        def protected_route(current_user: User = Depends(get_current_user)):
            return {"message": f"Hello {current_user.email}"}
    """
    token = credentials.credentials
    payload = verify_token(token)
    user_id = UUID(payload["user_id"])

    # Query user from database
    user = session.exec(select(User).where(User.id == user_id)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found. Please log in again.",
        )

    return user


def verify_user_access(user_id: str, current_user: User = Depends(get_current_user)) -> User:
    """
    Verify that the authenticated user matches the user_id in the URL.
    Prevents users from accessing other users' data.

    Args:
        user_id: User ID from URL path parameter
        current_user: Currently authenticated user

    Returns:
        User: Authenticated user if access is allowed

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user

    Example:
        @app.get("/api/{user_id}/tasks")
        def get_tasks(user: User = Depends(verify_user_access)):
            return user.tasks
    """
    if str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access other user's data.",
        )
    return current_user
