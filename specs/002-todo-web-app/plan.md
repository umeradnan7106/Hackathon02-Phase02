# Implementation Plan: Todo Full-Stack Web Application

**Branch**: `002-todo-web-app` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-todo-web-app/spec.md`

**Note**: This plan implements the comprehensive specification for a multi-user todo management web application with JWT authentication, persistent cloud storage, and complete data isolation between users.

## Summary

Build a production-ready, multi-user todo management web application where users can securely create accounts, manage personal task lists with full CRUD operations (Create, Read, Update, Delete), and toggle task completion status. The application enforces complete data privacy between users through JWT-based authentication and user_id-based database filtering, with all data persisted in Neon PostgreSQL cloud database.

**Technical Approach**: Three-tier architecture using Next.js 16+ (TypeScript, Tailwind CSS) for the frontend, FastAPI (Python 3.13+, SQLModel) for the RESTful backend API, and Neon serverless PostgreSQL for persistent storage. Authentication handled via Better Auth library with JWT tokens (7-day expiration, HS256 signing). Security enforced at all layers: bcrypt password hashing (12+ rounds), user_id verification on every API request, and ORM-only database access to prevent SQL injection.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.0+, Next.js 16+, Node.js 20+
- Backend: Python 3.13+, FastAPI 0.109+

**Primary Dependencies**:
- Frontend: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Better Auth 1.0+, axios
- Backend: FastAPI 0.109+, SQLModel 0.14+, passlib[bcrypt] 1.7+, python-jose[cryptography] 3.3+, pydantic-settings 2.1+, uvicorn[standard] 0.27+

**Storage**: Neon Serverless PostgreSQL (cloud-hosted, free tier available)

**Testing**:
- Manual testing following test scenarios in Section 12 of constitution
- API testing with cURL/Postman during backend development
- Browser testing for frontend (Chrome, Firefox, Safari)
- Responsive design testing (320px mobile, 768px tablet, 1920px desktop)

**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), deployed to Vercel (frontend)

**Project Type**: Full-stack web application (monorepo with frontend/ and backend/ directories)

**Performance Goals**:
- Page load time: <3 seconds on standard broadband
- API response time: <500ms for task operations (p95 latency)
- Task list rendering: 1000 tasks without pagination
- Concurrent users: 100+ simultaneous users

**Constraints**:
- 100% of code MUST be generated via Claude Code (per constitution)
- All secrets MUST be in environment variables, never hardcoded
- JWT tokens MUST expire after maximum 7 days
- Passwords MUST use bcrypt with minimum 12 rounds
- All database operations MUST use SQLModel ORM (raw SQL prohibited)
- Frontend MUST use TypeScript strict mode
- Backend MUST use Python type hints on all functions
- Must deploy frontend to Vercel (per constitution)
- Must use Neon PostgreSQL (per constitution)

**Scale/Scope**:
- Phase II hackathon project (estimated 18-20 hours development time)
- 10 iterations from setup to deployment
- 2 main entities (User, Task)
- 7 API endpoints (2 auth, 5 task CRUD)
- 4 main pages (landing, login, signup, tasks)
- 8-10 React components
- 36 functional requirements across 4 categories
- 32 test cases across 4 categories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Development Philosophy Gates

✅ **Spec-Driven Development**: Specification complete at `specs/002-todo-web-app/spec.md` with 5 user stories, 36 functional requirements, and 12 measurable success criteria. All requirements testable and unambiguous.

✅ **AI-Assisted Implementation**: 100% code generation via Claude Code enforced. Manual coding prohibited except for specifications and documentation.

✅ **Iterative Approach**: 10-iteration strategy defined in constitution Section 10.2, building from project setup → backend → frontend → deployment.

✅ **Quality Over Speed**: Production-ready standards mandatory. Security built in from start (JWT, bcrypt, data isolation). Type safety enforced (TypeScript strict mode, Python type hints).

✅ **Documentation First**: Constitution established, specification complete, implementation plan (this file) created before any code generation begins.

### Quality Standards Gates

✅ **Clean Code**: Enforced via Claude Code generation with clear naming conventions, TypeScript/Python formatting standards, and proper code organization.

✅ **Type Safety**: TypeScript strict mode mandatory for frontend. Python type hints mandatory for all backend functions and classes.

✅ **Security First**:
- JWT authentication with HS256 signing, 7-day expiration
- bcrypt password hashing (12+ rounds minimum)
- Complete data isolation via user_id filtering on all queries
- Input validation on all user inputs (title 1-100 chars, description max 500 chars)
- SQL injection prevention via SQLModel ORM only (raw SQL prohibited)
- Environment variables for all secrets (DATABASE_URL, BETTER_AUTH_SECRET)

✅ **User Experience**:
- Responsive design (320px mobile, 768px tablet, 1920px desktop)
- Loading spinners for all async operations
- Clear error messages (no technical jargon)
- Confirmation dialogs for destructive actions (delete)
- Visual feedback (hover, focus, disabled, active states)

✅ **Professional Grade**: All deliverables meet production-ready standards suitable for deployment and portfolio presentation.

### Technical Stack Compliance

✅ **Frontend**: Next.js 16+ (App Router), TypeScript (strict mode), Tailwind CSS, Better Auth

✅ **Backend**: FastAPI (Python 3.13+), SQLModel ORM, Neon PostgreSQL

✅ **Authentication**: Better Auth + JWT tokens (HS256, 7-day expiration, user_id in payload)

✅ **Deployment**: Vercel (frontend), Neon (database), optional backend deployment (Render/Railway/Fly.io)

### Security Requirements Compliance

✅ **Authentication Security**:
- bcrypt password hashing (passlib library, 12+ rounds)
- JWT token signing (HS256, 32+ char secret, 7-day max expiration)
- HTTPS in production (Vercel enforces automatically)

✅ **Data Isolation**:
- Every API endpoint verifies JWT token validity
- Every API endpoint extracts user_id from JWT payload
- Every API endpoint verifies URL user_id matches JWT user_id
- All database queries filtered by authenticated user's user_id
- Return 401 Unauthorized for invalid/expired tokens
- Return 403 Forbidden for cross-user access attempts

✅ **Input Validation**:
- Title: required, 1-100 characters, no whitespace-only
- Description: optional, max 500 characters
- Email: valid format, unique, lowercase normalized
- Password: minimum 8 characters
- All validation before database operations

✅ **SQL Injection Prevention**:
- SQLModel ORM for all database operations
- No string concatenation in queries
- No f-strings with user input in SQL
- No raw SQL execution with user input
- Parameterized queries only (ORM handles automatically)

**GATE STATUS**: ✅ **ALL GATES PASSED** - Proceed to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-web-app/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file - implementation plan
├── research.md          # Phase 0 output - technology research
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - developer onboarding
├── contracts/           # Phase 1 output - API specifications
│   ├── auth-api.md     # Authentication endpoints
│   └── tasks-api.md    # Task CRUD endpoints
├── checklists/
│   └── requirements.md # Quality validation checklist (COMPLETE)
└── tasks.md             # Phase 2 output (NOT created by /sp.plan)
```

### Source Code (repository root)

```text
phase02/
├── .specify/              # Spec-Kit Plus configuration
│   ├── memory/
│   │   └── constitution.md    # Project constitution (COMPLETE)
│   ├── templates/             # Templates for specs, plans, tasks
│   └── scripts/               # Automation scripts
│
├── specs/                     # All feature specifications
│   └── 002-todo-web-app/     # This feature (COMPLETE)
│
├── history/                   # Development logs
│   ├── prompts/              # Prompt History Records
│   └── adr/                  # Architecture Decision Records
│
├── frontend/                  # Next.js application
│   ├── app/                  # App Router pages
│   │   ├── page.tsx          # Landing page (/)
│   │   ├── login/
│   │   │   └── page.tsx      # Login page (/login)
│   │   ├── signup/
│   │   │   └── page.tsx      # Signup page (/signup)
│   │   └── tasks/
│   │       └── page.tsx      # Tasks page (/tasks, protected)
│   │
│   ├── components/           # Reusable UI components
│   │   ├── LoginForm.tsx     # Login form with validation
│   │   ├── SignupForm.tsx    # Signup form with validation
│   │   ├── TaskList.tsx      # Task list container
│   │   ├── TaskItem.tsx      # Individual task display
│   │   ├── TaskForm.tsx      # Create/edit task form (reusable)
│   │   ├── Modal.tsx         # Modal overlay component
│   │   └── ConfirmDialog.tsx # Delete confirmation dialog
│   │
│   ├── lib/                  # Utilities and API client
│   │   ├── api.ts            # Axios API client with JWT interceptor
│   │   ├── auth.ts           # Better Auth configuration
│   │   └── types.ts          # TypeScript interfaces
│   │
│   ├── public/               # Static assets (images, favicon)
│   ├── .env.local            # Environment variables (GITIGNORED)
│   ├── .env.example          # Environment template (COMMITTED)
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript configuration (strict mode)
│   ├── tailwind.config.ts    # Tailwind CSS configuration
│   └── next.config.js        # Next.js configuration
│
├── backend/                   # FastAPI application
│   ├── main.py               # Application entry point
│   │                         # - FastAPI app initialization
│   │                         # - CORS middleware configuration
│   │                         # - Route registration
│   │
│   ├── config.py             # Configuration management
│   │                         # - Load environment variables
│   │                         # - Pydantic Settings model
│   │                         # - DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
│   │
│   ├── database.py           # Database connection
│   │                         # - SQLModel engine creation
│   │                         # - Session factory
│   │                         # - create_db_and_tables() function
│   │
│   ├── models.py             # SQLModel database models
│   │                         # - User model (managed by Better Auth)
│   │                         # - Task model with user_id foreign key
│   │                         # - Validation logic
│   │
│   ├── auth.py               # JWT utilities
│   │                         # - create_access_token()
│   │                         # - verify_token()
│   │                         # - get_current_user()
│   │                         # - hash_password()
│   │                         # - verify_password()
│   │
│   ├── routes/               # API endpoint modules
│   │   ├── __init__.py       # Route package initialization
│   │   ├── auth.py           # Authentication endpoints
│   │   │                     # - POST /api/auth/signup
│   │   │                     # - POST /api/auth/login
│   │   └── tasks.py          # Task CRUD endpoints
│   │                         # - GET /api/{user_id}/tasks
│   │                         # - POST /api/{user_id}/tasks
│   │                         # - PUT /api/{user_id}/tasks/{task_id}
│   │                         # - DELETE /api/{user_id}/tasks/{task_id}
│   │                         # - PATCH /api/{user_id}/tasks/{task_id}/complete
│   │
│   ├── .env                  # Environment variables (GITIGNORED)
│   ├── .env.example          # Environment template (COMMITTED)
│   └── pyproject.toml        # Dependencies (UV format)
│
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
└── CLAUDE.md                  # Development guide and log
```

**Structure Decision**:

Selected **Option 2: Web application** structure with separate `frontend/` and `backend/` directories in a monorepo. This structure is optimal for this project because:

1. **Clear Separation of Concerns**: Frontend (Next.js) and backend (FastAPI) use different languages, package managers, and build processes. Separate directories prevent conflicts and simplify dependency management.

2. **Independent Deployment**: Frontend deploys to Vercel, backend optionally deploys separately (Render/Railway/Fly.io). Separate directories enable independent deployment pipelines.

3. **Monorepo Benefits**: Keeping both in one repository simplifies version control, enables atomic commits across frontend/backend, and maintains single source of truth for specifications and documentation.

4. **Developer Experience**: Developers can run frontend and backend concurrently in different terminal windows, with clear file organization making it easy to locate components.

5. **Hackathon Suitability**: Simple structure appropriate for 10-iteration project scope without unnecessary complexity of microservices or separate repositories.

## Complexity Tracking

**No constitutional violations detected** - This section intentionally left blank as all quality gates passed.

The implementation follows constitutional principles:
- Uses exactly 2 projects (frontend, backend) as prescribed for web applications
- No unnecessary abstraction layers (repositories, service classes) added
- Direct SQLModel ORM usage for database operations
- Straightforward component architecture without over-engineering
- RESTful API design following standard patterns

## Phase 0: Research & Technology Decisions

**Objective**: Document all technology choices, best practices, and architectural decisions with rationale and alternatives considered.

**Output**: `research.md` with decisions on:

1. **Next.js 16 App Router Best Practices**
   - Server vs Client Components strategy
   - Metadata API usage
   - Route handlers vs API routes
   - Loading and error state patterns
   - Environment variable access (NEXT_PUBLIC_ prefix)

2. **Better Auth Integration Patterns**
   - Setup and configuration
   - JWT token generation and validation
   - Session management
   - Protected route implementation
   - Token storage (localStorage vs cookies)

3. **FastAPI Application Structure**
   - Router organization and registration
   - Dependency injection patterns
   - Middleware configuration (CORS, authentication)
   - Pydantic model validation
   - Error handling and HTTP exceptions

4. **SQLModel ORM Patterns**
   - Model definition with relationships
   - Foreign key constraints and CASCADE delete
   - Index creation for query performance
   - Session management and engine configuration
   - Migration strategy (direct model application for Phase II)

5. **JWT Security Best Practices**
   - HS256 vs RS256 algorithm choice
   - Token payload structure
   - Expiration strategy
   - Secret key generation and storage
   - Token refresh patterns (out of scope for Phase II)

6. **Tailwind CSS Component Patterns**
   - Utility-first design principles
   - Responsive breakpoint usage
   - Component composition patterns
   - Dark mode preparation (out of scope but noted)
   - Custom configuration for project-specific colors

7. **API Error Handling Standards**
   - Consistent error response format
   - Status code conventions (400, 401, 403, 404, 500)
   - User-friendly vs developer error messages
   - Frontend error display patterns

8. **TypeScript Configuration**
   - Strict mode benefits and enforcement
   - Path aliases configuration
   - Type definitions for external libraries
   - Interface vs Type usage patterns

**Deliverable**: `specs/002-todo-web-app/research.md`

## Phase 1: Design & Data Model

**Objective**: Define data structures, API contracts, and developer onboarding documentation.

### 1.1 Data Model Definition

**Output**: `data-model.md` with complete entity specifications

**User Entity**:
```typescript
interface User {
  id: string;              // UUID v4, primary key
  email: string;           // Unique, lowercase, valid format
  name: string | null;     // Optional display name
  password_hash: string;   // bcrypt hashed (12+ rounds), never exposed in API
  created_at: Date;        // Account creation timestamp (UTC)
}
```

**Constraints**:
- email: UNIQUE, NOT NULL, indexed for login queries
- password_hash: NOT NULL, never returned in API responses
- Managed by Better Auth library (automatic user table creation)

**Task Entity**:
```typescript
interface Task {
  id: number;              // Auto-incrementing integer, primary key
  user_id: string;         // Foreign key to users.id, CASCADE delete
  title: string;           // 1-100 characters, NOT NULL
  description: string | null; // Max 500 characters, optional
  is_complete: boolean;    // Default false
  created_at: Date;        // Creation timestamp (UTC)
  updated_at: Date;        // Last modification timestamp (UTC)
}
```

**Constraints**:
- user_id: NOT NULL, REFERENCES users(id) ON DELETE CASCADE, indexed
- title: NOT NULL, VARCHAR(100), minimum 1 character
- description: TEXT, nullable, client-side limit 500 characters
- is_complete: NOT NULL, DEFAULT false, indexed for filtering
- Timestamps auto-managed by database

**Relationships**:
- User ← Task: One-to-many (one user has many tasks)
- Foreign key: task.user_id → user.id
- Cascade delete: Deleting user deletes all their tasks
- Index on user_id for fast queries filtering by user

**Database Schema (PostgreSQL)**:
```sql
-- User table (managed by Better Auth)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Task table (custom application table)
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_is_complete ON tasks(is_complete);
```

**Validation Rules**:
- Title: Required, 1-100 characters, no whitespace-only strings
- Description: Optional, max 500 characters
- Email: Valid email format, unique, case-insensitive
- Password: Minimum 8 characters (enforced at signup)

### 1.2 API Contracts

**Output**: `contracts/auth-api.md` and `contracts/tasks-api.md`

**Authentication API** (`contracts/auth-api.md`):

1. **POST /api/auth/signup**
   - Request: `{ email, password, name? }`
   - Response 201: `{ success: true, message, data: { id, email, name } }`
   - Response 400: `{ success: false, error: "Invalid email format" }`
   - Response 409: `{ success: false, error: "Email already registered" }`

2. **POST /api/auth/login**
   - Request: `{ email, password }`
   - Response 200: `{ success: true, data: { token, user: { id, email, name } } }`
   - Response 400: `{ success: false, error: "Missing email or password" }`
   - Response 401: `{ success: false, error: "Invalid credentials" }`

**Task API** (`contracts/tasks-api.md`):

All endpoints require header: `Authorization: Bearer {jwt_token}`

1. **GET /api/{user_id}/tasks**
   - Response 200: `{ success: true, data: Task[], count: number }`
   - Response 401: Invalid/expired token
   - Response 403: user_id mismatch

2. **POST /api/{user_id}/tasks**
   - Request: `{ title, description? }`
   - Response 201: `{ success: true, message, data: Task }`
   - Response 400: Validation errors

3. **PUT /api/{user_id}/tasks/{task_id}**
   - Request: `{ title, description? }`
   - Response 200: `{ success: true, message, data: Task }`
   - Response 400: Validation errors
   - Response 404: Task not found or not owned by user

4. **DELETE /api/{user_id}/tasks/{task_id}**
   - Response 200: `{ success: true, message }`
   - Response 404: Task not found or not owned by user

5. **PATCH /api/{user_id}/tasks/{task_id}/complete**
   - Response 200: `{ success: true, message, data: Task }`
   - Response 404: Task not found or not owned by user

### 1.3 Quickstart Guide

**Output**: `quickstart.md` for developer onboarding

Content includes:
- Prerequisites (Node.js 20+, Python 3.13+, UV, Git)
- Neon database setup (account creation, database creation, connection string)
- Environment variable configuration (.env.local, .env files)
- Backend setup (UV installation, dependency installation, database initialization)
- Frontend setup (npm install, Better Auth configuration)
- Running the application (backend on port 8000, frontend on port 3000)
- Testing the application (manual test checklist)
- Common issues and troubleshooting

**Deliverables**:
- `specs/002-todo-web-app/data-model.md`
- `specs/002-todo-web-app/contracts/auth-api.md`
- `specs/002-todo-web-app/contracts/tasks-api.md`
- `specs/002-todo-web-app/quickstart.md`

### 1.4 Agent Context Update

Run the agent context update script to register new technologies:

```powershell
.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude
```

This adds project-specific technologies (Next.js 16, FastAPI, SQLModel, Better Auth, Neon PostgreSQL) to Claude's context file, preserving any manual additions and preventing duplicate entries.

## Phase 2: Iteration Planning

**Note**: The `/sp.plan` command stops here. Task breakdown is handled by `/sp.tasks` command.

The 10-iteration strategy defined in the constitution (Section 10.2) will be implemented via the `/sp.tasks` command, which generates actionable tasks with acceptance criteria for each iteration:

1. **Iteration 1: Project Setup** - Repository structure, constitution, specifications
2. **Iteration 2: Configuration** - Frontend/backend tooling, environment variables
3. **Iteration 3: Database Setup** - Neon database, User/Task models, connection testing
4. **Iteration 4: Backend Authentication** - Signup/login endpoints, JWT generation
5. **Iteration 5: Backend Task CRUD** - All 5 task endpoints with authentication
6. **Iteration 6: Frontend Authentication UI** - Landing, login, signup pages
7. **Iteration 7: Frontend Task List UI** - Tasks page, TaskList, TaskItem components
8. **Iteration 8: Frontend Task Creation** - Modal, TaskForm (create mode)
9. **Iteration 9: Frontend Task Edit/Delete** - TaskForm (edit), ConfirmDialog, toggle
10. **Iteration 10: Testing & Deployment** - All tests, Vercel deployment, demo video

**Next Step**: Run `/sp.tasks` to generate detailed, testable tasks for each iteration with specific acceptance criteria, test cases, and implementation prompts for Claude Code.

---

## Implementation Notes

### Critical Path Dependencies

1. **Database First**: Iterations 3-4 must complete before frontend auth (Iteration 6)
2. **Backend Before Frontend**: Backend auth (Iteration 4) enables frontend auth (Iteration 6)
3. **Backend CRUD Before Frontend CRUD**: Backend tasks (Iteration 5) enables frontend tasks (Iterations 7-9)
4. **Authentication Before Tasks**: Auth flow (Iterations 4,6) required before task features (Iterations 5,7-9)

### Risk Mitigation

1. **Better Auth Integration**: Document Better Auth setup thoroughly in quickstart.md, as it requires database access from frontend
2. **CORS Configuration**: Test CORS settings early (Iteration 5) to prevent frontend API call failures
3. **JWT Token Synchronization**: Ensure BETTER_AUTH_SECRET matches exactly between frontend and backend
4. **User ID Verification**: Implement user_id verification helper function in Iteration 4, reuse in all task endpoints
5. **Environment Variables**: Create .env.example templates early, validate all required variables before deployment

### Quality Assurance Checkpoints

- **After Iteration 4**: Test authentication flow with cURL/Postman, verify JWT tokens decode correctly
- **After Iteration 5**: Test all task endpoints with valid/invalid tokens, verify 403 on cross-user access
- **After Iteration 6**: Test full frontend auth flow, verify protected routes redirect correctly
- **After Iteration 9**: Complete all 32 test cases from constitution Section 12
- **Before Iteration 10**: Verify all 12 success criteria from specification are met

### Performance Considerations

- **Database Indexes**: Create indexes on user_id and is_complete (Iteration 3) before bulk testing
- **Query Optimization**: Always filter by user_id first in task queries (prevents full table scans)
- **Frontend Optimization**: Use React.memo for TaskItem component (prevents unnecessary re-renders)
- **API Response Size**: Return only necessary fields, avoid over-fetching data

### Security Checklist

- [ ] Passwords hashed with bcrypt (12+ rounds) before storage
- [ ] JWT secret 32+ characters, stored in environment variables
- [ ] All task endpoints verify JWT token validity
- [ ] All task endpoints verify user_id from token matches URL user_id
- [ ] All database queries filter by authenticated user's user_id
- [ ] No raw SQL queries (SQLModel ORM only)
- [ ] .env files in .gitignore (never committed)
- [ ] CORS configured to allow only frontend origin
- [ ] HTTPS enforced in production (Vercel handles automatically)

---

**Plan Status**: ✅ Complete - Ready for `/sp.tasks` command

**Constitution Compliance**: ✅ All gates passed, all mandatory requirements met

**Next Action**: Run `/sp.tasks` to generate actionable task breakdown for 10-iteration implementation
