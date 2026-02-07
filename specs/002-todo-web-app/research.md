# Technology Research & Decisions: Todo Full-Stack Web Application

**Feature**: 002-todo-web-app
**Phase**: 0 - Research & Technology Decisions
**Date**: 2026-01-11
**Status**: Complete

## Overview

This document captures all technology choices, architectural patterns, and best practices for implementing the Todo Full-Stack Web Application. Each decision includes rationale, alternatives considered, and implementation guidelines.

---

## 1. Next.js 16 App Router Best Practices

### Decision: Use App Router with Server and Client Components

**Chosen Approach**:
- **Server Components (default)**: Use for static layouts, pages that fetch data server-side
- **Client Components**: Use only when needed (forms, interactive elements, hooks, browser APIs)
- Mark client components explicitly with `'use client'` directive

**Rationale**:
- **Better Performance**: Server Components reduce JavaScript sent to client, improving load times
- **SEO Friendly**: Server-side rendering improves search engine indexing
- **Security**: API keys and sensitive logic stay on server
- **Future-Proof**: App Router is the recommended approach for Next.js 16+

**Alternatives Considered**:
1. **Pages Router**: Older Next.js routing system - rejected because:
   - Not the recommended approach for new projects in Next.js 16+
   - Missing features like streaming, Server Components
   - Less optimized bundle sizes

2. **All Client Components**: Simpler mental model - rejected because:
   - Larger JavaScript bundles
   - Slower page loads
   - Misses benefits of server-side rendering

**Implementation Guidelines**:
```typescript
// ✅ Server Component (default)
// app/page.tsx - No 'use client', static content
export default function HomePage() {
  return <div>Welcome to Todo App</div>;
}

// ✅ Client Component (interactive)
// components/LoginForm.tsx - Uses hooks, form state
'use client';
import { useState } from 'react';
export default function LoginForm() {
  const [email, setEmail] = useState('');
  // ... form logic
}
```

### Decision: Environment Variable Access Pattern

**Chosen Approach**:
- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Store backend API URL as `NEXT_PUBLIC_API_URL`
- Never expose secrets (BETTER_AUTH_SECRET) to client

**Rationale**:
- Next.js 16 requires `NEXT_PUBLIC_` prefix for client-side access
- Explicit prefix prevents accidental secret exposure
- Server-side variables remain secure

**Implementation**:
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000  # ✅ Available in browser
BETTER_AUTH_SECRET=xxx  # ✅ Server-only, not exposed
DATABASE_URL=xxx  # ✅ Server-only (Better Auth needs it)
```

### Decision: Loading and Error State Pattern

**Chosen Approach**:
- Use `loading.tsx` and `error.tsx` files in app directory for automatic UI
- Use React Suspense for component-level loading states
- Use error boundaries for component-level errors

**Rationale**:
- Automatic loading states reduce boilerplate
- Error boundaries prevent entire page crashes
- Better user experience with granular loading/error feedback

**Implementation**:
```typescript
// app/tasks/loading.tsx
export default function Loading() {
  return <div className="animate-spin">Loading tasks...</div>;
}

// app/tasks/error.tsx
'use client';
export default function Error({ error, reset }) {
  return <div>Error loading tasks: {error.message}</div>;
}
```

---

## 2. Better Auth Integration Patterns

### Decision: Better Auth for JWT-based Authentication

**Chosen Approach**:
- Use Better Auth library for user management and JWT generation
- Store JWT tokens in localStorage (not cookies)
- Frontend includes token in Authorization header for API calls
- Backend validates JWT on every protected endpoint

**Rationale**:
- **Automatic User Management**: Better Auth handles user table creation, password hashing
- **JWT Native**: Built-in JWT token generation with configurable expiration
- **Next.js Optimized**: Designed for Next.js applications
- **Minimal Configuration**: Simple setup with environment variables

**Alternatives Considered**:
1. **NextAuth.js**: Full-featured auth solution - rejected because:
   - Overkill for simple JWT authentication
   - Requires session database (adds complexity)
   - Constitution specifies Better Auth

2. **Custom JWT Implementation**: Build from scratch - rejected because:
   - Reinventing the wheel
   - Higher risk of security vulnerabilities
   - More time-consuming for hackathon timeline

3. **Clerk/Auth0**: Third-party SaaS - rejected because:
   - External dependency (free tier limits)
   - Less control over authentication flow
   - Constitution mandates self-hosted solution

**Implementation Guidelines**:
```typescript
// lib/auth.ts (Better Auth configuration)
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    provider: 'postgres',
    url: process.env.DATABASE_URL!,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  jwt: {
    expiresIn: '7d',  // Token valid for 7 days
    algorithm: 'HS256',
  },
});

// Token storage pattern
// After successful login:
localStorage.setItem('token', response.data.token);

// API client with token injection:
import axios from 'axios';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Decision: Protected Route Implementation

**Chosen Approach**:
- Use middleware to check JWT token validity
- Redirect to /login if no token or token expired
- Redirect to /tasks if authenticated and accessing /login or /signup

**Rationale**:
- Centralized authentication logic
- Consistent redirect behavior
- No redundant token checks in each page

**Implementation**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token') ||
                localStorage.getItem('token');

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/tasks');

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tasks/:path*', '/login', '/signup'],
};
```

---

## 3. FastAPI Application Structure

### Decision: Router-based Organization with Dependency Injection

**Chosen Approach**:
- Separate routers for auth and tasks (`routes/auth.py`, `routes/tasks.py`)
- Dependency injection for database session and JWT verification
- Centralized configuration using Pydantic Settings
- Middleware for CORS and error handling

**Rationale**:
- **Scalability**: Easy to add new route modules as features grow
- **Testability**: Dependency injection enables mocking for tests
- **Separation of Concerns**: Each router handles one domain (auth, tasks)
- **Type Safety**: Pydantic validates configuration at startup

**Alternatives Considered**:
1. **Single main.py File**: All routes in one file - rejected because:
   - Poor organization for 7+ endpoints
   - Difficult to maintain as project grows
   - Violates separation of concerns

2. **Class-based Views**: Django-style views - rejected because:
   - Not idiomatic FastAPI pattern
   - More boilerplate code
   - Function-based views are simpler for this scope

**Implementation Guidelines**:
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, tasks
from config import settings

app = FastAPI(title="Todo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session

router = APIRouter()

@router.post("/signup")
async def signup(user: UserCreate, session: Session = Depends(get_session)):
    # Implementation
    pass

# routes/tasks.py
from fastapi import APIRouter, Depends
from auth import get_current_user

router = APIRouter()

@router.get("/{user_id}/tasks")
async def get_tasks(
    user_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    # Implementation
    pass
```

### Decision: Pydantic Models for Request/Response Validation

**Chosen Approach**:
- Define Pydantic models for all request bodies and responses
- Use FastAPI's automatic validation and OpenAPI documentation generation
- Separate models from SQLModel database models

**Rationale**:
- **Automatic Validation**: FastAPI validates request data against Pydantic models
- **API Documentation**: Auto-generates OpenAPI/Swagger docs
- **Type Safety**: Ensures data integrity throughout application
- **Clear Contracts**: API consumers know exact request/response structure

**Implementation**:
```python
# models.py (Pydantic request/response models)
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str | None = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None
    created_at: datetime

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)

class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: str | None
    is_complete: bool
    created_at: datetime
    updated_at: datetime
```

---

## 4. SQLModel ORM Patterns

### Decision: SQLModel for Type-Safe ORM with Automatic Migrations

**Chosen Approach**:
- Use SQLModel for all database operations (no raw SQL)
- Define models with type hints and constraints
- Use `create_db_and_tables()` for schema creation (Phase II simplification)
- Index frequently queried fields (user_id, is_complete)

**Rationale**:
- **Type Safety**: Python type hints ensure correct data types
- **SQL Injection Prevention**: Parameterized queries automatically
- **Pydantic Integration**: Works seamlessly with FastAPI
- **Simple Migrations**: No Alembic needed for Phase II scope

**Alternatives Considered**:
1. **SQLAlchemy Core**: Lower-level API - rejected because:
   - More boilerplate code
   - Less type safety
   - SQLModel is built on SQLAlchemy, adds convenience

2. **Raw SQL with psycopg2**: Direct PostgreSQL access - rejected because:
   - Risk of SQL injection
   - No type safety
   - Constitution prohibits raw SQL
   - More error-prone

3. **Alembic Migrations**: Full migration system - rejected because:
   - Overkill for Phase II (no schema changes planned)
   - Adds complexity to hackathon project
   - `create_db_and_tables()` sufficient for initial deployment

**Implementation Guidelines**:
```python
# models.py (SQLModel database models)
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str | None = None
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=100)
    description: str | None = Field(default=None)
    is_complete: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")

# database.py
from sqlmodel import create_engine, Session, SQLModel

DATABASE_URL = "postgresql://..."
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# Query patterns (always filter by user_id for security)
def get_user_tasks(user_id: str, session: Session):
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks

# Update pattern (auto-update updated_at)
def update_task(task_id: int, user_id: str, title: str, session: Session):
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    task = session.exec(statement).first()
    if not task:
        raise HTTPException(status_code=404)
    task.title = title
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

### Decision: Cascade Delete for User-Task Relationship

**Chosen Approach**:
- Configure `ON DELETE CASCADE` on user_id foreign key
- When user deleted, all their tasks automatically deleted
- Enforced at database level, not application level

**Rationale**:
- **Data Integrity**: Prevents orphaned tasks
- **Simplicity**: No manual cleanup code needed
- **Database-Level Guarantee**: Works even if deletion happens outside application

**Implementation**:
```python
# SQLModel defines the relationship
user_id: str = Field(foreign_key="users.id", index=True)

# Database creates constraint:
# FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

---

## 5. JWT Security Best Practices

### Decision: HS256 Algorithm with 7-Day Expiration

**Chosen Approach**:
- Use HS256 symmetric signing algorithm
- 32+ character secret key stored in environment variable
- 7-day token expiration (per constitution)
- Include user_id and email in payload

**Rationale**:
- **HS256 Simplicity**: Symmetric key easier to manage for single-server deployment
- **Sufficient Security**: HMAC-SHA256 cryptographically secure for this use case
- **Fast Performance**: Symmetric signing faster than asymmetric (RS256)
- **Constitutional Compliance**: Meets 7-day expiration requirement

**Alternatives Considered**:
1. **RS256 (Asymmetric)**: Public/private key pair - rejected because:
   - Overkill for single-server deployment
   - More complex key management
   - Slower performance
   - Use case doesn't require public verification

2. **Refresh Tokens**: Long-lived refresh + short-lived access - rejected because:
   - Out of scope for Phase II
   - Adds complexity (token storage, rotation logic)
   - 7-day expiration acceptable for hackathon project

3. **Session-based Auth**: Server-side sessions - rejected because:
   - Requires session storage (Redis/database)
   - Less scalable than stateless JWT
   - Constitution mandates JWT

**Implementation Guidelines**:
```python
# auth.py (JWT utilities)
from jose import JWTError, jwt
from datetime import datetime, timedelta
from config import settings

SECRET_KEY = settings.BETTER_AUTH_SECRET
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(
    authorization: str = Header(...),
    session: Session = Depends(get_session)
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = payload.get("user_id")

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
```

### Decision: Token Storage in localStorage

**Chosen Approach**:
- Store JWT token in browser localStorage after login
- Include token in Authorization header for every API request
- Clear token on logout

**Rationale**:
- **Simplicity**: Easiest implementation for Phase II
- **Persistence**: Survives page refreshes (7-day expiration allows multi-day sessions)
- **No Server State**: Aligns with JWT stateless design

**Alternatives Considered**:
1. **httpOnly Cookies**: Server-set cookies - rejected because:
   - More complex setup (CORS cookie credentials)
   - Better for XSS protection but adds complexity
   - localStorage sufficient for Phase II security requirements

2. **sessionStorage**: Browser session only - rejected because:
   - Lost on browser close (poor UX for 7-day tokens)
   - Doesn't align with JWT's multi-day expiration

**Security Considerations**:
- XSS vulnerability exists (if attacker injects script, can steal token)
- Mitigation: Sanitize all user inputs, use React's built-in XSS protection
- Future enhancement: Move to httpOnly cookies for production

---

## 6. Tailwind CSS Component Patterns

### Decision: Utility-First with Component Composition

**Chosen Approach**:
- Use Tailwind utility classes directly in JSX
- No custom CSS files or CSS-in-JS
- Create reusable components for common patterns (Button, Input, Modal)
- Use Tailwind's `@apply` directive sparingly (only for truly repeated patterns)

**Rationale**:
- **Rapid Development**: No context switching between HTML and CSS files
- **Consistency**: Tailwind's design tokens ensure consistent spacing/colors
- **Bundle Size**: PurgeCSS removes unused styles automatically
- **Maintainability**: Colocation of styles with components

**Alternatives Considered**:
1. **Custom CSS Files**: Separate stylesheets - rejected because:
   - Constitution mandates Tailwind CSS
   - More files to maintain
   - No automatic purging of unused styles

2. **CSS-in-JS (styled-components)**: JavaScript-based styling - rejected because:
   - Runtime performance cost
   - Larger bundle size
   - Tailwind's utility-first approach is simpler

3. **Tailwind @apply Everywhere**: Extract all styles - rejected because:
   - Loses utility-first benefits
   - Creates abstraction layer that's hard to modify
   - Recommended pattern: use utilities directly, extract only when 3+ duplicates

**Implementation Guidelines**:
```typescript
// ✅ Good: Utility classes directly in JSX
<button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
  Submit
</button>

// ✅ Good: Reusable component for common patterns
export function Button({ children, variant = 'primary', ...props }) {
  const baseClasses = "font-semibold py-2 px-4 rounded transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ❌ Bad: Extracting every style with @apply
// globals.css
.btn {
  @apply bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded;
}
// (Only use @apply for truly repeated patterns across many components)
```

### Decision: Mobile-First Responsive Design

**Chosen Approach**:
- Write base styles for mobile (320px+)
- Use responsive prefixes for larger screens (sm:, md:, lg:)
- Test at three breakpoints: 320px (mobile), 768px (tablet), 1920px (desktop)

**Rationale**:
- **Progressive Enhancement**: Ensure mobile users get functional experience first
- **Simpler Code**: Mobile styles are default, desktop overrides are additive
- **Performance**: Mobile-first matches Tailwind's default behavior

**Implementation**:
```typescript
// Mobile-first responsive pattern
<div className="
  flex flex-col          /* Mobile: stack vertically */
  md:flex-row            /* Tablet+: horizontal layout */
  gap-4                  /* Mobile: 1rem gap */
  md:gap-6               /* Tablet+: 1.5rem gap */
  p-4                    /* Mobile: 1rem padding */
  md:p-6                 /* Tablet+: 1.5rem padding */
  lg:p-8                 /* Desktop: 2rem padding */
">
  {/* Content */}
</div>
```

---

## 7. API Error Handling Standards

### Decision: Consistent Error Response Format with User-Friendly Messages

**Chosen Approach**:
- Standard error response: `{ success: false, error: "User-friendly message" }`
- HTTP status codes: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- User-friendly error messages (no technical jargon or stack traces)
- Log detailed errors server-side for debugging

**Rationale**:
- **Consistency**: Frontend can handle errors uniformly
- **User Experience**: Clear, actionable error messages
- **Security**: Don't expose implementation details to clients
- **Debugging**: Server logs capture full error context

**Alternatives Considered**:
1. **HTTP Status Only**: No body messages - rejected because:
   - Poor UX (user doesn't know what went wrong)
   - Frontend must maintain error message mapping

2. **Verbose Error Objects**: Include stack traces, error codes - rejected because:
   - Security risk (exposes implementation details)
   - Confusing for users

**Implementation Guidelines**:
```python
# Backend error handling
from fastapi import HTTPException
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

# Custom exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP error: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )

# Usage in endpoints
@router.post("/tasks")
async def create_task(task: TaskCreate, current_user: User = Depends(get_current_user)):
    if not task.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Title is required and cannot be empty"
        )
    if len(task.title) > 100:
        raise HTTPException(
            status_code=400,
            detail="Title too long (maximum 100 characters)"
        )
    # Success case
    return {"success": True, "message": "Task created", "data": new_task}
```

```typescript
// Frontend error handling
// lib/api.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server returned error response
      const message = error.response.data?.error || 'An error occurred';

      if (error.response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      return Promise.reject(new Error(message));
    }
    // Network error
    return Promise.reject(new Error('Network error - please try again'));
  }
);

// Component error handling
try {
  const response = await api.post(`/api/${userId}/tasks`, { title, description });
  setSuccessMessage('Task created successfully');
} catch (error) {
  setErrorMessage(error.message); // User-friendly message from API
}
```

---

## 8. TypeScript Configuration

### Decision: Strict Mode with Path Aliases

**Chosen Approach**:
- Enable TypeScript strict mode in tsconfig.json
- Configure path aliases for cleaner imports (`@/components`, `@/lib`)
- Use interface for object types, type for unions/primitives
- Explicit return types on all exported functions

**Rationale**:
- **Type Safety**: Strict mode catches more errors at compile time
- **Developer Experience**: Path aliases reduce relative import hell (`../../../components`)
- **Code Quality**: Explicit types serve as documentation
- **Maintainability**: Type errors caught before runtime

**Alternatives Considered**:
1. **Loose TypeScript**: Disable strict mode - rejected because:
   - Defeats purpose of TypeScript
   - Constitution mandates strict type safety

2. **No Path Aliases**: Use relative imports - rejected because:
   - Difficult to refactor (moving files breaks imports)
   - Hard to read (`../../../components/Button`)

**Implementation Guidelines**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,  // ✅ Enable strict mode
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],  // ✅ Path aliases
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"]
    }
  }
}
```

```typescript
// ✅ Good: Explicit types and path aliases
// lib/types.ts
export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: Date;
  updated_at: Date;
}

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// components/TaskList.tsx
import { Task } from '@/lib/types';  // ✅ Clean import with alias
import TaskItem from '@/components/TaskItem';

export default function TaskList({ tasks }: { tasks: Task[] }): JSX.Element {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
```

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Frontend Framework** | Next.js 16 App Router | Modern, optimized, Server Components |
| **Frontend Language** | TypeScript (strict mode) | Type safety, better DX, catches errors early |
| **Frontend Styling** | Tailwind CSS (utility-first) | Rapid development, consistent design |
| **Authentication** | Better Auth + JWT (HS256, 7-day) | Simple, secure, constitutional compliance |
| **Backend Framework** | FastAPI with routers | Scalable, type-safe, auto-documentation |
| **Database ORM** | SQLModel | Type-safe, SQL injection prevention, Pydantic integration |
| **Database** | Neon PostgreSQL | Serverless, free tier, auto-backups |
| **API Errors** | Consistent JSON format | User-friendly messages, uniform handling |
| **Token Storage** | localStorage | Simple, persistent, sufficient for Phase II |
| **Route Protection** | Middleware | Centralized auth logic, consistent redirects |
| **Responsive Design** | Mobile-first | Progressive enhancement, Tailwind default |
| **State Management** | React hooks (useState) | Sufficient for app scope, no Redux needed |

---

## Implementation Readiness

✅ **All technology choices documented**
✅ **Best practices defined for each stack component**
✅ **Alternatives considered and rejected with rationale**
✅ **Implementation patterns provided with code examples**
✅ **Security considerations addressed**
✅ **Performance patterns documented**

**Status**: Research phase complete - Ready for Phase 1 (Data Model & Contracts)

**Next Step**: Generate `data-model.md`, `contracts/`, and `quickstart.md` artifacts
