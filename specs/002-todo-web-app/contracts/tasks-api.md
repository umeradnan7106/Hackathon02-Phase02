# Task Management API Contract

**Feature**: 002-todo-web-app
**API Domain**: Task CRUD Operations
**Date**: 2026-01-11
**Status**: Complete
**Base URL**: `/api/{user_id}`

## Overview

The Task Management API provides complete CRUD operations (Create, Read, Update, Delete, Toggle Completion) for user tasks. All endpoints require JWT authentication and enforce strict data isolation (users can only access their own tasks).

**Security**:
- All endpoints require JWT token in Authorization header
- All endpoints verify user_id from token matches user_id in URL path
- All database queries filter by authenticated user's user_id
- Returns 401 Unauthorized for invalid/expired tokens
- Returns 403 Forbidden for cross-user access attempts

**Authentication Method**: Bearer JWT Token

**Base URL Pattern**: `/api/{user_id}/tasks`
- `{user_id}`: UUID v4 of the authenticated user (must match JWT token user_id)

---

## Authentication

### Authorization Header

**All task endpoints require this header**:
```
Authorization: Bearer {jwt_token}
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User ID Verification

**Security Check (MANDATORY on every endpoint)**:

```python
# Extract user_id from JWT token
token_user_id = decode_jwt(token)["user_id"]

# Verify match with URL path user_id
if url_user_id != token_user_id:
    raise HTTPException(status_code=403, detail="Forbidden: Cannot access other users' data")
```

**Purpose**: Prevents users from accessing other users' tasks by manipulating URL parameters.

---

## Endpoints

### 1. GET /api/{user_id}/tasks

Retrieve all tasks for the authenticated user, ordered by creation date (newest first).

#### Request

**HTTP Method**: `GET`

**Endpoint**: `/api/{user_id}/tasks`

**Path Parameters**:
- `user_id` (string, required): UUID v4 of the user (must match JWT token user_id)

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Query Parameters**: None (Phase II does not include filtering, pagination, or sorting options)

#### Response

**Success Response (200 OK)**:
```typescript
{
  success: true;
  data: Task[];      // Array of task objects (can be empty)
  count: number;     // Total number of tasks
}
```

**Task Object Structure**:
```typescript
interface Task {
  id: number;                // Auto-incrementing integer
  user_id: string;           // UUID v4 of task owner
  title: string;             // 1-100 characters
  description: string | null; // Max 500 characters or null
  is_complete: boolean;      // true = done, false = pending
  created_at: string;        // ISO 8601 timestamp (UTC)
  updated_at: string;        // ISO 8601 timestamp (UTC)
}
```

**Success Response Example (with tasks)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
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
  ],
  "count": 2
}
```

**Success Response Example (empty list)**:
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

**Error Responses**:

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**403 Forbidden** - user_id mismatch:
```json
{
  "success": false,
  "error": "Forbidden: Cannot access other users' data"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "Unable to retrieve tasks. Please try again."
}
```

#### Implementation Notes

1. **Query**: `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`
2. **Ordering**: Always return newest tasks first (most recent created_at)
3. **Empty State**: Return empty array if user has no tasks (NOT 404)
4. **Performance**: Use user_id index for fast queries
5. **Security**: ALWAYS filter by authenticated user's user_id
6. **Timestamps**: Return as ISO 8601 strings (e.g., "2026-01-11T09:00:00Z")

#### cURL Example

```bash
curl -X GET http://localhost:8000/api/123e4567-e89b-12d3-a456-426614174000/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 2. POST /api/{user_id}/tasks

Create a new task for the authenticated user.

#### Request

**HTTP Method**: `POST`

**Endpoint**: `/api/{user_id}/tasks`

**Path Parameters**:
- `user_id` (string, required): UUID v4 of the user

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body**:
```typescript
{
  title: string;         // Required, 1-100 characters
  description?: string;  // Optional, max 500 characters
}
```

**Request Body Example**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, apples"
}
```

**Validation Rules**:
- `title`:
  - MUST be present (not empty, not null)
  - MUST be minimum 1 character (after trimming)
  - MUST be maximum 100 characters
  - Cannot be whitespace-only (e.g., "   " is invalid)
- `description`:
  - Optional (can be omitted or null)
  - Maximum 500 characters if provided

#### Response

**Success Response (201 Created)**:
```typescript
{
  success: true;
  message: string;
  data: Task;  // Newly created task object
}
```

**Success Response Example**:
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 4,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, apples",
    "is_complete": false,
    "created_at": "2026-01-11T11:00:00Z",
    "updated_at": "2026-01-11T11:00:00Z"
  }
}
```

**Error Responses**:

**400 Bad Request** - Title empty:
```json
{
  "success": false,
  "error": "Title is required and cannot be empty"
}
```

**400 Bad Request** - Title too long:
```json
{
  "success": false,
  "error": "Title too long (maximum 100 characters)"
}
```

**400 Bad Request** - Description too long:
```json
{
  "success": false,
  "error": "Description too long (maximum 500 characters)"
}
```

**400 Bad Request** - Whitespace-only title:
```json
{
  "success": false,
  "error": "Title cannot be only whitespace"
}
```

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**403 Forbidden** - user_id mismatch:
```json
{
  "success": false,
  "error": "Forbidden: Cannot create tasks for other users"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "Unable to create task. Please try again."
}
```

#### Implementation Notes

1. **Auto-Set Fields**:
   - `user_id`: Set from JWT token (NOT from request body)
   - `is_complete`: Default to false
   - `created_at`: Set to current timestamp (UTC)
   - `updated_at`: Set to current timestamp (UTC)

2. **Validation Order**:
   - Check title not empty/null
   - Trim title, check not whitespace-only
   - Check title length ≤ 100
   - Check description length ≤ 500 (if provided)

3. **Security**: Use user_id from JWT token, ignore any user_id in request body

4. **Database**: Insert with SQLModel, return created task with auto-generated ID

#### cURL Example

```bash
curl -X POST http://localhost:8000/api/123e4567-e89b-12d3-a456-426614174000/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, apples"
  }'
```

---

### 3. PUT /api/{user_id}/tasks/{task_id}

Update an existing task's title and/or description.

#### Request

**HTTP Method**: `PUT`

**Endpoint**: `/api/{user_id}/tasks/{task_id}`

**Path Parameters**:
- `user_id` (string, required): UUID v4 of the user
- `task_id` (integer, required): ID of the task to update

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body**:
```typescript
{
  title: string;         // Required, 1-100 characters
  description?: string;  // Optional, max 500 characters (can be null to clear)
}
```

**Request Body Example**:
```json
{
  "title": "Buy groceries and fruits",
  "description": "Milk, eggs, bread, apples, oranges"
}
```

**Validation Rules**: Same as POST /tasks (title 1-100 chars, description max 500 chars)

#### Response

**Success Response (200 OK)**:
```typescript
{
  success: true;
  message: string;
  data: Task;  // Updated task object
}
```

**Success Response Example**:
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 4,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries and fruits",
    "description": "Milk, eggs, bread, apples, oranges",
    "is_complete": false,
    "created_at": "2026-01-11T11:00:00Z",
    "updated_at": "2026-01-11T11:30:00Z"
  }
}
```

**Error Responses**:

**400 Bad Request** - Validation errors (same as POST)

**404 Not Found** - Task not found or not owned by user:
```json
{
  "success": false,
  "error": "Task not found"
}
```

**401 Unauthorized** - Missing or invalid token

**403 Forbidden** - user_id mismatch

**500 Internal Server Error**

#### Implementation Notes

1. **Query**: `SELECT * FROM tasks WHERE id = ? AND user_id = ?` (verify ownership)
2. **Update**: Update title, description, and updated_at timestamp
3. **Atomicity**: Use database transaction to ensure consistency
4. **Security**: Verify task belongs to authenticated user before update
5. **Timestamps**: created_at unchanged, updated_at set to current time (UTC)
6. **404 vs 403**: Return 404 if task not found OR doesn't belong to user (don't reveal task existence)

#### cURL Example

```bash
curl -X PUT http://localhost:8000/api/123e4567-e89b-12d3-a456-426614174000/tasks/4 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and fruits",
    "description": "Milk, eggs, bread, apples, oranges"
  }'
```

---

### 4. DELETE /api/{user_id}/tasks/{task_id}

Permanently delete a task.

#### Request

**HTTP Method**: `DELETE`

**Endpoint**: `/api/{user_id}/tasks/{task_id}`

**Path Parameters**:
- `user_id` (string, required): UUID v4 of the user
- `task_id` (integer, required): ID of the task to delete

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request Body**: None

#### Response

**Success Response (200 OK)**:
```typescript
{
  success: true;
  message: string;
}
```

**Success Response Example**:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses**:

**404 Not Found** - Task not found or not owned by user:
```json
{
  "success": false,
  "error": "Task not found"
}
```

**401 Unauthorized** - Missing or invalid token

**403 Forbidden** - user_id mismatch

**500 Internal Server Error**

#### Implementation Notes

1. **Query**: `SELECT * FROM tasks WHERE id = ? AND user_id = ?` (verify ownership)
2. **Delete**: `DELETE FROM tasks WHERE id = ? AND user_id = ?`
3. **Security**: Verify task belongs to authenticated user before deletion
4. **Irreversible**: No soft delete, permanent removal from database
5. **404 vs 403**: Return 404 if task not found OR doesn't belong to user (don't reveal task existence)
6. **Frontend Confirmation**: Frontend should show confirmation dialog before calling this endpoint

#### cURL Example

```bash
curl -X DELETE http://localhost:8000/api/123e4567-e89b-12d3-a456-426614174000/tasks/4 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5. PATCH /api/{user_id}/tasks/{task_id}/complete

Toggle task completion status (complete ↔ incomplete).

#### Request

**HTTP Method**: `PATCH`

**Endpoint**: `/api/{user_id}/tasks/{task_id}/complete`

**Path Parameters**:
- `user_id` (string, required): UUID v4 of the user
- `task_id` (integer, required): ID of the task to toggle

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request Body**: None (endpoint automatically toggles current status)

#### Response

**Success Response (200 OK)**:
```typescript
{
  success: true;
  message: string;
  data: Task;  // Task object with toggled is_complete status
}
```

**Success Response Example (marked as complete)**:
```json
{
  "success": true,
  "message": "Task marked as complete",
  "data": {
    "id": 4,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, apples",
    "is_complete": true,
    "created_at": "2026-01-11T11:00:00Z",
    "updated_at": "2026-01-11T12:00:00Z"
  }
}
```

**Success Response Example (marked as incomplete)**:
```json
{
  "success": true,
  "message": "Task marked as incomplete",
  "data": {
    "id": 4,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, apples",
    "is_complete": false,
    "created_at": "2026-01-11T11:00:00Z",
    "updated_at": "2026-01-11T12:05:00Z"
  }
}
```

**Error Responses**:

**404 Not Found** - Task not found or not owned by user:
```json
{
  "success": false,
  "error": "Task not found"
}
```

**401 Unauthorized** - Missing or invalid token

**403 Forbidden** - user_id mismatch

**500 Internal Server Error**

#### Implementation Notes

1. **Query**: `SELECT * FROM tasks WHERE id = ? AND user_id = ?` (verify ownership)
2. **Toggle Logic**:
   ```python
   task.is_complete = not task.is_complete
   task.updated_at = datetime.utcnow()
   ```
3. **Message**: Return "Task marked as complete" if toggled to true, "Task marked as incomplete" if toggled to false
4. **Security**: Verify task belongs to authenticated user before toggle
5. **Timestamps**: created_at unchanged, updated_at set to current time
6. **Frontend**: Optimistic update (toggle UI immediately, revert on error)

#### cURL Example

```bash
curl -X PATCH http://localhost:8000/api/123e4567-e89b-12d3-a456-426614174000/tasks/4/complete \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Security Implementation

### Required Security Checks (MANDATORY on every endpoint)

```python
from fastapi import Header, Depends, HTTPException
from auth import verify_token

async def verify_user_access(
    user_id: str,
    authorization: str = Header(..., alias="Authorization")
) -> str:
    """Verify JWT token and user_id match."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.replace("Bearer ", "")

    try:
        payload = verify_token(token)  # Decode JWT
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    token_user_id = payload.get("user_id")

    if token_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other users' data"
        )

    return token_user_id


# Usage in endpoints
@router.get("/{user_id}/tasks")
async def get_tasks(
    user_id: str,
    verified_user_id: str = Depends(verify_user_access),
    session: Session = Depends(get_session)
):
    # Query with verified_user_id
    statement = select(Task).where(Task.user_id == verified_user_id)
    tasks = session.exec(statement).all()
    return {"success": True, "data": tasks, "count": len(tasks)}
```

### Database Query Pattern (ALWAYS filter by user_id)

```python
# ✅ CORRECT: Filter by authenticated user_id
statement = select(Task).where(Task.user_id == verified_user_id)

# ❌ WRONG: No user_id filter (returns all users' tasks!)
statement = select(Task)  # SECURITY VULNERABILITY
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (task created) |
| 400 | Bad Request | Validation errors (title empty, too long, etc.) |
| 401 | Unauthorized | Missing, invalid, or expired JWT token |
| 403 | Forbidden | user_id mismatch (accessing other user's tasks) |
| 404 | Not Found | Task not found or not owned by user |
| 500 | Internal Server Error | Database errors, unexpected errors |

### User-Friendly Error Messages

All error responses follow consistent format:
```typescript
{
  success: false;
  error: string;  // Clear, actionable message (no technical jargon)
}
```

---

## Testing Scenarios

### GET /tasks Tests

- ✅ **Test 1**: Valid token → 200 OK with user's tasks
- ✅ **Test 2**: Empty task list → 200 OK with empty array (count: 0)
- ✅ **Test 3**: No token → 401 Unauthorized
- ✅ **Test 4**: Invalid token → 401 Unauthorized
- ✅ **Test 5**: Expired token → 401 Unauthorized
- ✅ **Test 6**: user_id mismatch → 403 Forbidden

### POST /tasks Tests

- ✅ **Test 1**: Valid request → 201 Created with task data
- ✅ **Test 2**: Title only (no description) → 201 Created (description null)
- ✅ **Test 3**: Empty title → 400 Bad Request
- ✅ **Test 4**: Whitespace-only title → 400 Bad Request
- ✅ **Test 5**: Title 101 characters → 400 Bad Request
- ✅ **Test 6**: Description 501 characters → 400 Bad Request
- ✅ **Test 7**: No token → 401 Unauthorized
- ✅ **Test 8**: user_id mismatch → 403 Forbidden

### PUT /tasks/{task_id} Tests

- ✅ **Test 1**: Valid update → 200 OK with updated task
- ✅ **Test 2**: Update title only → 200 OK (description unchanged)
- ✅ **Test 3**: Update description only → 200 OK (title unchanged)
- ✅ **Test 4**: Invalid title → 400 Bad Request
- ✅ **Test 5**: Task not found → 404 Not Found
- ✅ **Test 6**: Task belongs to other user → 404 Not Found (hide existence)
- ✅ **Test 7**: updated_at timestamp changed → Verify timestamp

### DELETE /tasks/{task_id} Tests

- ✅ **Test 1**: Valid delete → 200 OK, task removed from database
- ✅ **Test 2**: Task not found → 404 Not Found
- ✅ **Test 3**: Task belongs to other user → 404 Not Found
- ✅ **Test 4**: No token → 401 Unauthorized
- ✅ **Test 5**: Verify deletion in database → Task no longer exists

### PATCH /tasks/{task_id}/complete Tests

- ✅ **Test 1**: Toggle incomplete → complete → 200 OK (is_complete: true)
- ✅ **Test 2**: Toggle complete → incomplete → 200 OK (is_complete: false)
- ✅ **Test 3**: Toggle twice → Back to original state
- ✅ **Test 4**: Task not found → 404 Not Found
- ✅ **Test 5**: updated_at timestamp changed → Verify timestamp

### Security Tests

- ✅ **Test 1**: User A creates task → User B cannot access via GET
- ✅ **Test 2**: User A creates task → User B cannot update via PUT
- ✅ **Test 3**: User A creates task → User B cannot delete via DELETE
- ✅ **Test 4**: Crafted API call with other user's task_id → 404 Not Found
- ✅ **Test 5**: All database queries include user_id filter → Verify SQL logs

---

## Frontend Integration

### API Client Setup (TypeScript)

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Inject JWT token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Task API functions
export async function getTasks(userId: string) {
  const response = await api.get(`/api/${userId}/tasks`);
  return response.data;
}

export async function createTask(userId: string, title: string, description?: string) {
  const response = await api.post(`/api/${userId}/tasks`, { title, description });
  return response.data;
}

export async function updateTask(userId: string, taskId: number, title: string, description?: string) {
  const response = await api.put(`/api/${userId}/tasks/${taskId}`, { title, description });
  return response.data;
}

export async function deleteTask(userId: string, taskId: number) {
  const response = await api.delete(`/api/${userId}/tasks/${taskId}`);
  return response.data;
}

export async function toggleTaskComplete(userId: string, taskId: number) {
  const response = await api.patch(`/api/${userId}/tasks/${taskId}/complete`);
  return response.data;
}
```

---

## Summary

**Endpoints**: 5 (GET all tasks, POST create, PUT update, DELETE remove, PATCH toggle complete)

**Authentication**: Bearer JWT token (mandatory on all endpoints)

**Security Checks**: user_id verification, token validation, database query filtering

**Status Codes**: 200 (success), 201 (created), 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

**Testing Scenarios**: 25 (6 GET, 8 POST, 7 PUT, 5 DELETE, 5 PATCH, 5 security)

**Status**: ✅ Complete - Ready for backend implementation

**Next Step**: Generate `quickstart.md` for developer onboarding
