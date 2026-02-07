# Authentication API Contract

**Feature**: 002-todo-web-app
**API Domain**: Authentication & User Management
**Date**: 2026-01-11
**Status**: Complete
**Base URL**: `/api/auth`

## Overview

The Authentication API provides endpoints for user account creation (signup) and authentication (login). All authentication endpoints use JWT tokens (HS256 algorithm, 7-day expiration) for session management.

**Security**:
- Passwords hashed with bcrypt (12+ rounds) before storage
- JWT tokens include user_id and email in payload
- Token secret stored in environment variable (BETTER_AUTH_SECRET)

**Authentication Method**: None (these are public endpoints)

---

## Endpoints

### 1. POST /api/auth/signup

Create a new user account with email and password.

#### Request

**HTTP Method**: `POST`

**Endpoint**: `/api/auth/signup`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
{
  email: string;        // Required, valid email format, unique
  password: string;     // Required, minimum 8 characters
  name?: string;        // Optional, display name
}
```

**Request Body Example**:
```json
{
  "email": "alice@example.com",
  "password": "securepass123",
  "name": "Alice Johnson"
}
```

**Validation Rules**:
- `email`:
  - MUST be valid email format
  - MUST be unique (not already registered)
  - Normalized to lowercase before storage
- `password`:
  - MUST be minimum 8 characters
  - Hashed with bcrypt (12+ rounds) before storage
- `name`:
  - Optional field
  - Maximum 100 characters (convention)

#### Response

**Success Response (201 Created)**:
```typescript
{
  success: true;
  message: string;
  data: {
    id: string;          // UUID v4
    email: string;       // Lowercase email
    name: string | null; // Display name or null
  }
}
```

**Success Response Example**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "alice@example.com",
    "name": "Alice Johnson"
  }
}
```

**Error Responses**:

**400 Bad Request** - Invalid email format:
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**400 Bad Request** - Password too short:
```json
{
  "success": false,
  "error": "Password must be at least 8 characters"
}
```

**400 Bad Request** - Missing required fields:
```json
{
  "success": false,
  "error": "Email and password are required"
}
```

**409 Conflict** - Email already registered:
```json
{
  "success": false,
  "error": "Email already registered"
}
```

**500 Internal Server Error** - Server error:
```json
{
  "success": false,
  "error": "Unable to create account. Please try again."
}
```

#### Implementation Notes

1. **Email Normalization**: Convert email to lowercase before uniqueness check and storage
2. **Password Hashing**: Use `passlib.hash.bcrypt.hash(password, rounds=12)`
3. **UUID Generation**: Use `uuid.uuid4()` for user ID generation
4. **Database Transaction**: Ensure atomicity (rollback on error)
5. **Security**: Never log passwords (plain or hashed) in application logs
6. **Redirect Flow**: After successful signup, redirect user to /login page (not auto-login)

#### cURL Example

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123",
    "name": "Alice Johnson"
  }'
```

---

### 2. POST /api/auth/login

Authenticate user with email and password, receive JWT token.

#### Request

**HTTP Method**: `POST`

**Endpoint**: `/api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
{
  email: string;     // Required, registered email
  password: string;  // Required, user's password
}
```

**Request Body Example**:
```json
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

**Validation Rules**:
- `email`: MUST be provided (not empty)
- `password`: MUST be provided (not empty)

#### Response

**Success Response (200 OK)**:
```typescript
{
  success: true;
  data: {
    token: string;  // JWT token (HS256, 7-day expiration)
    user: {
      id: string;          // UUID v4
      email: string;       // User's email
      name: string | null; // Display name or null
    }
  }
}
```

**Success Response Example**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIiwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsImV4cCI6MTczNjY0OTYwMCwiaWF0IjoxNzM2MDQ0ODAwfQ.dGhpc19pc19hX2Zha2VfdG9rZW5fc2lnbmF0dXJl",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "alice@example.com",
      "name": "Alice Johnson"
    }
  }
}
```

**JWT Token Payload** (decoded):
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "alice@example.com",
  "exp": 1736649600,  // Expiration timestamp (7 days from issue)
  "iat": 1736044800   // Issued at timestamp
}
```

**Error Responses**:

**400 Bad Request** - Missing email or password:
```json
{
  "success": false,
  "error": "Email and password are required"
}
```

**401 Unauthorized** - Invalid credentials:
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**500 Internal Server Error** - Server error:
```json
{
  "success": false,
  "error": "Unable to log in. Please try again."
}
```

#### Implementation Notes

1. **Email Lookup**: Convert email to lowercase before database query
2. **Password Verification**: Use `passlib.hash.bcrypt.verify(password, user.password_hash)`
3. **JWT Generation**: Use `python-jose` library with HS256 algorithm
4. **Token Expiration**: Set expiration to 7 days from issue time
5. **Payload Contents**: Include only `user_id`, `email`, `exp`, `iat` (no sensitive data)
6. **Security**: Use constant-time comparison for password verification (bcrypt handles this)
7. **Client Storage**: Frontend stores token in localStorage for subsequent API calls
8. **Redirect Flow**: After successful login, redirect user to /tasks page

#### JWT Token Generation (Python)

```python
from jose import jwt
from datetime import datetime, timedelta
from config import settings

def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm="HS256")
    return token
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123"
  }'
```

---

## Authentication Flow

### Signup Flow

```
1. User visits /signup page
2. User enters email, password, name (optional)
3. Frontend validates inputs locally (email format, password length)
4. Frontend sends POST /api/auth/signup request
5. Backend validates inputs
6. Backend checks email uniqueness
7. Backend hashes password (bcrypt, 12+ rounds)
8. Backend creates user record in database
9. Backend returns success response with user data (NO password_hash)
10. Frontend displays success message
11. Frontend redirects to /login page
```

### Login Flow

```
1. User visits /login page
2. User enters email and password
3. Frontend validates inputs locally (not empty)
4. Frontend sends POST /api/auth/login request
5. Backend looks up user by email (lowercase)
6. Backend verifies password using bcrypt
7. Backend generates JWT token (7-day expiration)
8. Backend returns token + user data
9. Frontend stores token in localStorage
10. Frontend redirects to /tasks page
```

### Protected Route Access Flow

```
1. User navigates to /tasks page
2. Frontend checks if token exists in localStorage
3. If no token: redirect to /login
4. If token exists: include in Authorization header for all API requests
5. Backend validates token on every protected endpoint
6. Backend extracts user_id from token payload
7. Backend uses user_id to filter database queries
```

---

## Security Considerations

### Password Security

1. **Hashing Algorithm**: bcrypt with 12+ rounds (slow hashing intentional for security)
2. **No Plain Text Storage**: Passwords NEVER stored as plain text
3. **No Logging**: Passwords (plain or hashed) NEVER logged
4. **Secure Transmission**: HTTPS required in production (Vercel enforces automatically)

### JWT Token Security

1. **Secret Key**: 32+ character random string stored in environment variable
2. **Expiration**: 7-day maximum expiration (per constitution)
3. **Algorithm**: HS256 (HMAC-SHA256) symmetric signing
4. **Payload Limitation**: Only user_id and email (no sensitive data)
5. **No Refresh Tokens**: Out of scope for Phase II (7-day expiration acceptable)

### Brute Force Protection

**Phase II Scope**: No rate limiting implemented

**Future Enhancements**:
- Rate limiting on login endpoint (e.g., 5 failed attempts per minute)
- Account lockout after N failed login attempts
- CAPTCHA after repeated failures

### HTTPS Enforcement

**Development**: HTTP acceptable (localhost)

**Production**: HTTPS enforced by Vercel (automatic redirect from HTTP)

---

## Error Handling

### Error Response Format

All error responses follow consistent structure:
```typescript
{
  success: false;
  error: string;  // User-friendly error message
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful login |
| 201 | Created | Successful signup (user created) |
| 400 | Bad Request | Validation errors (invalid email, short password, missing fields) |
| 401 | Unauthorized | Invalid credentials (wrong email/password) |
| 409 | Conflict | Duplicate resource (email already registered) |
| 500 | Internal Server Error | Server-side errors (database down, unexpected errors) |

### User-Friendly Error Messages

❌ **Bad**: "SQLAlchemyError: duplicate key value violates unique constraint users_email_key"

✅ **Good**: "Email already registered"

**Rationale**: Error messages MUST be clear and actionable for users, hiding technical implementation details.

---

## Testing Scenarios

### Signup Tests

- ✅ **Test 1**: Valid signup → 201 Created with user data
- ✅ **Test 2**: Duplicate email → 409 Conflict
- ✅ **Test 3**: Invalid email format → 400 Bad Request
- ✅ **Test 4**: Password < 8 chars → 400 Bad Request
- ✅ **Test 5**: Missing email → 400 Bad Request
- ✅ **Test 6**: Missing password → 400 Bad Request
- ✅ **Test 7**: Optional name field → 201 Created (name included or null)

### Login Tests

- ✅ **Test 1**: Valid credentials → 200 OK with token
- ✅ **Test 2**: Invalid email → 401 Unauthorized
- ✅ **Test 3**: Invalid password → 401 Unauthorized
- ✅ **Test 4**: Missing email → 400 Bad Request
- ✅ **Test 5**: Missing password → 400 Bad Request
- ✅ **Test 6**: Token contains user_id and email → Verify payload
- ✅ **Test 7**: Token expires in 7 days → Verify exp claim

### Security Tests

- ✅ **Test 1**: Password_hash NOT in signup response
- ✅ **Test 2**: Password_hash NOT in login response
- ✅ **Test 3**: Token signature verification → Invalid signature rejected
- ✅ **Test 4**: Expired token → 401 Unauthorized on protected endpoints

---

## Frontend Integration

### API Client Setup (TypeScript)

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Signup function
export async function signup(email: string, password: string, name?: string) {
  const response = await api.post('/api/auth/signup', { email, password, name });
  return response.data;
}

// Login function
export async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login', { email, password });
  if (response.data.success) {
    // Store token in localStorage
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
}

// Logout function
export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

### Usage in Components

```typescript
// components/LoginForm.tsx
'use client';
import { useState } from 'react';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/tasks');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
```

---

## Summary

**Endpoints**: 2 (Signup, Login)

**Authentication Method**: JWT tokens (HS256, 7-day expiration)

**Security Mechanisms**: bcrypt password hashing (12+ rounds), environment-based secret key

**Status Codes**: 200 (login success), 201 (signup success), 400 (validation), 401 (invalid credentials), 409 (duplicate), 500 (server error)

**Testing Scenarios**: 14 (7 signup tests, 7 login tests, 4 security tests)

**Status**: ✅ Complete - Ready for backend implementation

**Next Contract**: `tasks-api.md` (Task CRUD endpoints)
