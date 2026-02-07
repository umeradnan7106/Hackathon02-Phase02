# Data Model: Todo Full-Stack Web Application

**Feature**: 002-todo-web-app
**Phase**: 1 - Data Model Definition
**Date**: 2026-01-11
**Status**: Complete

## Overview

This document defines the complete data model for the Todo application, including entity definitions, relationships, constraints, and validation rules. The data model supports multi-user task management with complete data isolation and persistent cloud storage.

---

## Entity Relationship Diagram

```
┌─────────────────────────────┐
│         User                │
│ (Managed by Better Auth)    │
├─────────────────────────────┤
│ id: TEXT (PK)               │
│ email: TEXT (UNIQUE)        │
│ name: TEXT (nullable)       │
│ password_hash: TEXT         │
│ created_at: TIMESTAMP       │
└──────────────┬──────────────┘
               │
               │ 1:N (one user has many tasks)
               │
               ↓
┌─────────────────────────────┐
│         Task                │
│ (Application Entity)         │
├─────────────────────────────┤
│ id: SERIAL (PK)             │
│ user_id: TEXT (FK) →────────┘ [CASCADE DELETE]
│ title: VARCHAR(100)         │
│ description: TEXT           │
│ is_complete: BOOLEAN        │
│ created_at: TIMESTAMP       │
│ updated_at: TIMESTAMP       │
└─────────────────────────────┘
```

---

## Entities

### 1. User Entity

**Purpose**: Stores user account information for authentication and task ownership.

**Managed By**: Better Auth library (automatic user table creation and management).

**Table Name**: `users`

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **id** | TEXT | PRIMARY KEY | UUID v4 format, unique user identifier |
| **email** | TEXT | UNIQUE, NOT NULL, INDEXED | User's email address (lowercase, valid format) |
| **name** | TEXT | NULL | User's optional display name |
| **password_hash** | TEXT | NOT NULL | bcrypt hashed password (12+ rounds, never exposed in API) |
| **created_at** | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp (UTC) |

#### TypeScript Interface

```typescript
export interface User {
  id: string;              // UUID v4 format
  email: string;           // Unique, lowercase, valid email
  name: string | null;     // Optional display name
  password_hash: string;   // NEVER included in API responses
  created_at: Date;        // ISO 8601 timestamp
}

// API Response Type (excludes password_hash)
export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  created_at: string;  // ISO 8601 string
}
```

#### Python SQLModel Definition

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import List, Optional

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks (one user has many tasks)
    tasks: List["Task"] = Relationship(back_populates="user", cascade_delete=True)
```

#### Database Schema (SQL)

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### Validation Rules

- **email**:
  - MUST match valid email regex pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
  - MUST be unique across all users
  - MUST be lowercase normalized before storage
  - Cannot be empty or whitespace only

- **password** (before hashing):
  - MUST be minimum 8 characters
  - SHOULD contain mix of uppercase, lowercase, numbers (recommended in UI, not enforced)
  - Hashed using bcrypt with 12+ rounds before storage

- **password_hash**:
  - Generated via `passlib.hash.bcrypt.hash(password, rounds=12)`
  - NEVER exposed in API responses or logs
  - Cannot be empty

- **name**:
  - Optional field (nullable)
  - Maximum 100 characters (convention, not enforced at DB level)

#### Security Considerations

1. **Password Storage**: Passwords MUST be hashed with bcrypt (12+ rounds) before storage. Plain text passwords NEVER stored.

2. **API Response Sanitization**: `password_hash` field MUST be excluded from all API responses to prevent exposure.

3. **Email Uniqueness**: Enforced at database level via UNIQUE constraint to prevent duplicate accounts.

4. **Indexing**: Email field indexed for fast login queries.

---

### 2. Task Entity

**Purpose**: Stores individual todo items linked to specific users for multi-user task management.

**Managed By**: Application (custom SQLModel model with CRUD operations).

**Table Name**: `tasks`

#### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **id** | SERIAL | PRIMARY KEY | Auto-incrementing integer, unique task identifier |
| **user_id** | TEXT | FOREIGN KEY → users(id), NOT NULL, INDEXED | Owner of the task (references User.id) |
| **title** | VARCHAR(100) | NOT NULL | Task title (1-100 characters, no whitespace-only) |
| **description** | TEXT | NULL | Optional task description (max 500 chars client-side) |
| **is_complete** | BOOLEAN | NOT NULL, DEFAULT FALSE, INDEXED | Completion status (true = done, false = pending) |
| **created_at** | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp (UTC) |
| **updated_at** | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp (UTC) |

#### TypeScript Interface

```typescript
export interface Task {
  id: number;                  // Auto-incrementing integer
  user_id: string;             // UUID of owning user
  title: string;               // 1-100 characters
  description: string | null;  // Max 500 characters or null
  is_complete: boolean;        // true = done, false = pending
  created_at: Date;            // ISO 8601 timestamp
  updated_at: Date;            // ISO 8601 timestamp
}

// API Response Type (same as Task)
export interface TaskResponse extends Task {}

// API Create/Update Request Types
export interface TaskCreateRequest {
  title: string;               // Required, 1-100 chars
  description?: string;        // Optional, max 500 chars
}

export interface TaskUpdateRequest {
  title?: string;              // Optional, 1-100 chars if provided
  description?: string;        // Optional, max 500 chars if provided
}
```

#### Python SQLModel Definition

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=100)
    description: Optional[str] = None
    is_complete: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user (many tasks belong to one user)
    user: User = Relationship(back_populates="tasks")
```

#### Database Schema (SQL)

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_is_complete ON tasks(is_complete);
```

#### Validation Rules

- **title**:
  - MUST be present (not null, not empty string)
  - MUST be minimum 1 character (after trimming whitespace)
  - MUST be maximum 100 characters
  - Cannot be whitespace-only string (e.g., "   " is invalid)
  - Type MUST be string

- **description**:
  - Optional field (can be null or empty string)
  - Maximum 500 characters if provided (enforced client-side and API validation)
  - Type MUST be string if provided

- **user_id**:
  - MUST reference valid user.id (foreign key constraint)
  - MUST match authenticated user's ID from JWT token (enforced in API)
  - Cannot be null or empty

- **is_complete**:
  - MUST be boolean (true or false)
  - Defaults to false on creation

- **Timestamps**:
  - created_at: Set automatically on creation, never modified
  - updated_at: Set automatically on creation, updated on every modification

#### Security Considerations

1. **Data Isolation**: ALL database queries MUST filter by authenticated user's user_id to prevent cross-user data access.

2. **Foreign Key Constraint**: user_id references users(id) ensures tasks always belong to valid users.

3. **Cascade Delete**: ON DELETE CASCADE ensures no orphaned tasks when users are deleted.

4. **User ID Verification**: Every API endpoint MUST verify that user_id in URL matches user_id in JWT token (403 Forbidden if mismatch).

5. **Input Sanitization**: All text inputs (title, description) sanitized by framework (React, FastAPI) to prevent XSS attacks.

---

## Relationships

### User ↔ Task Relationship

**Type**: One-to-Many (1:N)

**Description**: One user can have many tasks, but each task belongs to exactly one user.

**Direction**: User (1) → Tasks (N)

**Foreign Key**: `task.user_id` → `user.id`

**Cascade Behavior**: `ON DELETE CASCADE` (deleting a user automatically deletes all their tasks)

**Rationale**:
- Ensures data integrity (no orphaned tasks)
- Enforces single ownership (tasks cannot be shared in Phase II)
- Simplifies cleanup (user deletion handles task cleanup automatically)

#### Database Implementation

```sql
-- Foreign key constraint with cascade delete
ALTER TABLE tasks
  ADD CONSTRAINT fk_tasks_user_id
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;
```

#### SQLModel Implementation

```python
# User model
class User(SQLModel, table=True):
    tasks: List["Task"] = Relationship(back_populates="user", cascade_delete=True)

# Task model
class Task(SQLModel, table=True):
    user_id: str = Field(foreign_key="users.id", index=True)
    user: User = Relationship(back_populates="tasks")
```

#### Query Patterns

```python
# Get all tasks for a user
user = session.get(User, user_id)
user_tasks = user.tasks  # Uses relationship

# Alternative: Direct query (ALWAYS filter by user_id for security)
statement = select(Task).where(Task.user_id == user_id)
user_tasks = session.exec(statement).all()

# Get user from task
task = session.get(Task, task_id)
task_owner = task.user  # Uses relationship
```

---

## Indexes

### Performance Optimization

Indexes are critical for query performance, especially as the dataset grows.

#### 1. Email Index (User table)

```sql
CREATE INDEX idx_users_email ON users(email);
```

**Purpose**: Fast login queries (email lookup during authentication)

**Query**: `SELECT * FROM users WHERE email = ?`

**Impact**: O(log n) instead of O(n) for email lookups

#### 2. User ID Index (Task table)

```sql
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

**Purpose**: Fast task retrieval for specific users (most common query)

**Query**: `SELECT * FROM tasks WHERE user_id = ?`

**Impact**: Critical for data isolation performance

**Rationale**: Every task query filters by user_id for security, making this index essential

#### 3. Completion Status Index (Task table)

```sql
CREATE INDEX idx_tasks_is_complete ON tasks(is_complete);
```

**Purpose**: Fast filtering by completion status (future feature: filter by completed/incomplete)

**Query**: `SELECT * FROM tasks WHERE user_id = ? AND is_complete = true`

**Impact**: Efficient composite queries (user_id + is_complete)

---

## State Transitions

### Task Completion Status

```
           [User clicks checkbox]
┌──────────────┐                    ┌──────────────┐
│  Incomplete  │ ─────────────────→ │   Complete   │
│ (is_complete │                    │ (is_complete │
│  = false)    │ ←───────────────── │  = true)     │
└──────────────┘                    └──────────────┘
           [User clicks checkbox again]
```

**Valid Transitions**:
- Incomplete → Complete: User marks task as done
- Complete → Incomplete: User marks task as not done (e.g., needs to redo)

**No Invalid States**: is_complete is boolean, no intermediate states

**Side Effects**:
- Every status change updates `updated_at` timestamp
- No cascade effects (completion status isolated to single task)

---

## Data Integrity Rules

### Database-Level Constraints

1. **Primary Keys**:
   - User.id: TEXT PRIMARY KEY (UUID v4)
   - Task.id: SERIAL PRIMARY KEY (auto-incrementing integer)

2. **Foreign Keys**:
   - Task.user_id REFERENCES User.id ON DELETE CASCADE

3. **Unique Constraints**:
   - User.email UNIQUE (prevent duplicate accounts)

4. **Not Null Constraints**:
   - User: id, email, password_hash, created_at
   - Task: id, user_id, title, is_complete, created_at, updated_at

5. **Default Values**:
   - Task.is_complete: DEFAULT FALSE
   - User.created_at, Task.created_at, Task.updated_at: DEFAULT NOW()

### Application-Level Validation

1. **Title Validation**:
   - Check length: 1 ≤ title.length ≤ 100
   - Check content: title.trim() !== '' (not whitespace-only)

2. **Description Validation**:
   - Check length: description.length ≤ 500 (if provided)

3. **Email Validation**:
   - Check format: regex pattern match
   - Check uniqueness: query before insert (race condition handled by DB UNIQUE constraint)

4. **User ID Verification**:
   - Verify JWT token user_id matches URL user_id
   - Verify task belongs to authenticated user before operations

5. **Password Validation**:
   - Check length: password.length ≥ 8
   - Hash with bcrypt (12+ rounds) before storage

---

## Migration Strategy

### Phase II Approach: Direct Schema Creation

**Method**: Use SQLModel's `create_db_and_tables()` function

**Rationale**:
- Simple setup for hackathon project
- No schema changes planned during Phase II
- Avoids Alembic complexity

**Implementation**:
```python
# database.py
from sqlmodel import create_engine, SQLModel

engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# main.py (startup)
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
```

**Future Enhancement**: Add Alembic migrations if schema changes needed in production

---

## Sample Data

### Example User

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "alice@example.com",
  "name": "Alice Johnson",
  "password_hash": "$2b$12$KIXxR.Y3Z1a2b3c4d5e6f.G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1",
  "created_at": "2026-01-10T10:00:00Z"
}
```

### Example Tasks

```json
[
  {
    "id": 1,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, apples",
    "is_complete": false,
    "created_at": "2026-01-11T09:00:00Z",
    "updated_at": "2026-01-11T09:00:00Z"
  },
  {
    "id": 2,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Finish project report",
    "description": null,
    "is_complete": true,
    "created_at": "2026-01-10T14:30:00Z",
    "updated_at": "2026-01-11T10:15:00Z"
  }
]
```

---

## Summary

**Entities**: 2 (User, Task)

**Relationships**: 1 (User 1:N Task)

**Indexes**: 3 (users.email, tasks.user_id, tasks.is_complete)

**Constraints**: 5 (primary keys, foreign key, unique, not null, defaults)

**Validation Rules**: 8 (title, description, email, password, user_id, is_complete, timestamps, whitespace)

**Security Mechanisms**: 5 (bcrypt hashing, JWT verification, user_id filtering, cascade delete, API sanitization)

**Status**: ✅ Complete - Ready for API contract definition

**Next Step**: Generate API contracts in `contracts/` directory
