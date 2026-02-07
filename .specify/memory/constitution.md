<!--
SYNC IMPACT REPORT
==================
Version Change: [TEMPLATE] → 1.0.0
Rationale: Initial constitution establishment for Todo Full-Stack Web Application (Hackathon Phase II)

Modified Principles:
- All template placeholders replaced with concrete project-specific principles

Added Sections:
1. Project Identity - Defines the hackathon project scope and goals
2. Core Principles (2.1-2.2) - Development Philosophy and Quality Standards
3. Technology Stack (3.1-3.3) - Frontend, Backend, and Development Tools specifications
4. Project Architecture (4.1-4.2) - High-Level Architecture and Monorepo Structure
5. Features Overview (5.1-5.4) - User Authentication, Task Management, Multi-User Support, Persistent Storage
6. Data Models (6.1-6.3) - User Model, Task Model, and Relationships
7. API Specifications (7.1-7.2) - Authentication and Task Endpoints
8. Security Requirements (8.1-8.4) - Authentication, Data Isolation, Input Validation, SQL Injection Prevention
9. Frontend Specifications (9.1-9.3) - Page Structure, Component Architecture, Styling Guidelines
10. Development Workflow (10.1-10.3) - Spec-Driven Process, Iteration Strategy, Forbidden Practices
11. Environment Configuration (11.1-11.2) - Frontend and Backend Environment Variables
12. Testing Requirements (12.1-12.4) - Authentication, Multi-User Isolation, Task CRUD, and UI/UX Tests
13. Deployment (13.1-13.3) - Frontend (Vercel), Database (Neon), Backend deployment
14. Quality Gates - Phase II completion criteria
15. Deliverables (15.1-15.4) - Code, Documentation, Deployment, Demonstration
16. Success Criteria - Final project success definition

Removed Sections:
- Generic template placeholders for PRINCIPLE_1-6
- Generic SECTION_2 and SECTION_3 placeholders

Templates Requiring Updates:
✅ plan-template.md - Constitution Check section will reference new principles
✅ spec-template.md - Aligned with user story requirements and functional requirements structure
✅ tasks-template.md - Aligned with iteration strategy and user story organization

Follow-up TODOs:
- None - All placeholders filled with concrete values
- Constitution ready for use in development workflow
-->

# Todo Full-Stack Web Application Constitution

## 1. Project Identity

**Project Name:** Todo Full-Stack Web Application
**Hackathon:** Panaversity Hackathon II - The Evolution of Todo
**Phase:** Phase II - Full-Stack Web Application
**Purpose:** Build a modern, multi-user todo management web application with persistent storage, RESTful API, and user authentication.

**What We're Building:**
A complete web application where users can:
- Sign up and create an account
- Log in securely
- Manage their personal todo list (create, view, update, delete tasks)
- Mark tasks as complete/incomplete
- Access their data from any device (data saved in cloud database)
- Have complete privacy (users only see their own tasks)

---

## 2. Core Principles

### 2.1 Development Philosophy

**Spec-Driven Development (MANDATORY)**

All features MUST be specified in detail before any code is written. Specifications define requirements, user scenarios, acceptance criteria, and success metrics before implementation begins.

**Rationale:** Clear specifications prevent scope creep, ensure alignment with user needs, and provide testable acceptance criteria. This approach reduces rework and ensures all stakeholders understand what will be built.

**AI-Assisted Implementation (MANDATORY)**

100% of code MUST be generated using Claude Code. Manual coding is prohibited except for specifications and documentation.

**Rationale:** Ensures consistent code quality, adherence to patterns, and educational value for learning AI-assisted development workflows. This is a core requirement of the hackathon.

**Iterative Approach (MANDATORY)**

The application MUST be built in small, tested increments. Each iteration delivers a functional, testable piece of the system.

**Rationale:** Iterative development allows for early validation, reduces integration risks, and enables course correction based on feedback.

**Quality Over Speed (MANDATORY)**

Code MUST be clean, maintainable, secure, and production-ready. Shortcuts that compromise quality are prohibited.

**Rationale:** Professional-grade code demonstrates mastery of development practices and creates a portfolio-worthy project that can be showcased to employers.

**Documentation First (MANDATORY)**

All features, APIs, and architectural decisions MUST be documented as they are built. Documentation is not optional or deferred.

**Rationale:** Comprehensive documentation ensures the project can be understood, maintained, and extended by others. It's essential for hackathon evaluation and future portfolio use.

### 2.2 Quality Standards

**Clean Code (MANDATORY)**

All code MUST be:
- Readable with clear variable and function names
- Well-organized following established patterns
- Properly commented where logic is non-obvious
- Formatted consistently using linters

**Type Safety (MANDATORY)**

- Frontend: TypeScript MUST be used for all frontend code with strict mode enabled
- Backend: Python type hints MUST be used for all function signatures and class attributes

**Rationale:** Type safety catches errors at development time, improves IDE support, and serves as inline documentation.

**Security First (MANDATORY)**

Security MUST be built in from the start, not added later:
- Proper authentication with JWT tokens
- Complete data isolation between users
- Input validation on all user inputs
- Prevention of SQL injection via ORM usage only

**Rationale:** Security vulnerabilities in a multi-user application can lead to data breaches and privacy violations. Security must be foundational.

**User Experience (MANDATORY)**

The application MUST provide:
- Responsive design (works on mobile, tablet, desktop)
- Clear feedback for all user actions
- Intuitive interface requiring no documentation to use
- Loading states for async operations
- Helpful error messages

**Rationale:** A polished user experience demonstrates professional development skills and makes the project suitable for portfolio presentation.

**Professional Grade (MANDATORY)**

All deliverables MUST meet production-ready standards suitable for deployment to real users.

**Rationale:** This is not a prototype or proof-of-concept. The goal is to build a complete, deployable application that demonstrates professional capabilities.

---

## 3. Technology Stack

### 3.1 Frontend (What Users See)

**Framework: Next.js 16+ (MANDATORY)**

Next.js MUST be used with:
- App Router for routing (not Pages Router)
- Server-side rendering where appropriate
- TypeScript for all components and utilities

**Rationale:** Next.js provides production-ready features including routing, SSR, and optimized builds. App Router is the modern standard.

**Language: TypeScript (MANDATORY)**

All frontend code MUST use TypeScript with strict mode enabled.

**Rationale:** Type safety prevents runtime errors and improves development experience with autocomplete and inline documentation.

**Styling: Tailwind CSS (MANDATORY)**

Tailwind CSS MUST be used for all styling. No CSS-in-JS libraries or separate CSS files.

**Rationale:** Tailwind enables rapid development with consistent design, responsive utilities, and minimal CSS bundle size.

**Authentication: Better Auth (MANDATORY)**

Better Auth MUST handle user authentication including signup, login, and JWT token management.

**Rationale:** Better Auth provides secure, battle-tested authentication with minimal configuration required.

### 3.2 Backend (The Engine)

**Framework: FastAPI (Python) (MANDATORY)**

FastAPI MUST be used for all API endpoints with:
- Automatic OpenAPI documentation generation
- Pydantic models for request/response validation
- Type hints for all endpoints

**Rationale:** FastAPI is modern, fast, and provides automatic API documentation. It's Python-based for accessibility to learners.

**Database ORM: SQLModel (MANDATORY)**

SQLModel MUST be used for all database operations. Raw SQL queries are prohibited.

**Rationale:** SQLModel provides type-safe database operations and prevents SQL injection vulnerabilities through parameterized queries.

**Database: Neon Serverless PostgreSQL (MANDATORY)**

Neon MUST be used as the production database.

**Rationale:** Neon provides a free tier, automatic backups, and eliminates server management complexity. It's PostgreSQL-compatible and production-ready.

**Authentication: JWT (JSON Web Tokens) (MANDATORY)**

JWT tokens MUST be used for API authentication with:
- HS256 signing algorithm
- 7-day maximum expiration
- User ID and email in payload

**Rationale:** JWT provides stateless authentication suitable for distributed systems and mobile clients.

### 3.3 Development Tools

**Required Tools:**
- **Claude Code:** AI coding assistant for all code generation (MANDATORY)
- **Spec-Kit Plus:** Organized specification management (MANDATORY)
- **UV:** Modern Python package manager (MANDATORY for backend)
- **npm:** Node.js package manager (MANDATORY for frontend)
- **Git:** Version control (MANDATORY)
- **Docker:** Local development environment (OPTIONAL)

---

## 4. Project Architecture

### 4.1 High-Level Architecture

**Three-Tier Architecture (MANDATORY)**

The application MUST follow this architecture:

```
┌─────────────────────┐
│   Frontend (Next.js)│
│   - Pages & UI      │
│   - Client-side auth│
│   - API calls       │
└──────────┬──────────┘
           │ HTTPS + JWT
           ↓
┌─────────────────────┐
│  Backend (FastAPI)  │
│  - REST API         │
│  - Business logic   │
│  - JWT validation   │
└──────────┬──────────┘
           │ SQL queries
           ↓
┌─────────────────────┐
│  Database (Neon)    │
│  - PostgreSQL       │
│  - User data        │
│  - Task data        │
└─────────────────────┘
```

**Request Flow:**
1. User interacts with frontend (browser)
2. Frontend sends HTTP request to backend API
3. Backend validates JWT token
4. Backend verifies user has permission to access data
5. Backend queries database (Neon PostgreSQL)
6. Backend sends data back to frontend
7. Frontend displays data to user

### 4.2 Monorepo Structure

**Directory Structure (MANDATORY)**

The repository MUST follow this exact structure:

```
phase02/
├── .specify/              # Spec-Kit configuration
│   ├── memory/
│   │   └── constitution.md    # This file
│   ├── templates/             # Templates for specs, plans, tasks
│   └── scripts/               # Automation scripts
├── specs/                     # All specifications
│   ├── overview.md           # Project summary
│   ├── architecture.md       # Technical design
│   ├── features/             # Feature specifications
│   ├── api/                  # API documentation
│   ├── database/             # Database schema
│   └── ui/                   # UI specifications
├── frontend/                  # Next.js application
│   ├── app/                  # App Router pages
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities and API client
│   ├── public/               # Static assets
│   ├── .env.local            # Environment variables (gitignored)
│   └── package.json          # Dependencies
├── backend/                   # FastAPI application
│   ├── main.py               # Application entry point
│   ├── models.py             # Database models (SQLModel)
│   ├── routes/               # API endpoint modules
│   │   ├── auth.py           # Authentication endpoints
│   │   └── tasks.py          # Task CRUD endpoints
│   ├── database.py           # Database connection setup
│   ├── auth.py               # JWT utilities
│   ├── .env                  # Environment variables (gitignored)
│   └── pyproject.toml        # Dependencies (UV format)
├── history/                   # Prompt History Records
│   ├── prompts/              # User interaction logs
│   └── adr/                  # Architecture Decision Records
├── CLAUDE.md                  # Development guide and log
├── README.md                  # Project documentation
├── .gitignore                 # Git ignore rules
└── docker-compose.yml         # Local development setup (optional)
```

**Rationale:** This structure separates concerns clearly (frontend/backend/specs/history) while keeping everything in one repository for simplicity. The monorepo approach simplifies version control and deployment coordination.

---

## 5. Features Overview

### 5.1 User Authentication

**Purpose:** Enable users to create accounts and securely access their data.

**Mandatory Features:**
- **Sign Up:** Users MUST be able to create an account with email and password
- **Log In:** Users MUST authenticate with credentials and receive a JWT token
- **Log Out:** Users MUST be able to clear their session and return to login page
- **Protected Routes:** Only authenticated users MUST be able to access task pages

**Security Requirements (MANDATORY):**
- Passwords MUST be hashed using bcrypt (never stored as plain text)
- JWT tokens MUST be used for authentication
- Tokens MUST expire after maximum 7 days
- Each user MUST be completely isolated from other users

### 5.2 Task Management (CRUD Operations)

**Purpose:** Provide complete todo list functionality.

**Create Task (MANDATORY):**
- Users MUST be able to add new tasks with title and description
- Title MUST be required (1-100 characters)
- Description MUST be optional (max 500 characters)
- Tasks MUST be automatically associated with the logged-in user

**View Tasks (MANDATORY):**
- Users MUST be able to see all their tasks in one list
- Each task MUST display title, description, completion status, and creation date
- Completed tasks MUST have clear visual indication
- Empty state MUST be shown when no tasks exist

**Update Task (MANDATORY):**
- Users MUST be able to edit task title and/or description
- Same validation rules as creation MUST apply
- Updated timestamp MUST be tracked

**Delete Task (MANDATORY):**
- Users MUST be able to remove tasks permanently
- Confirmation dialog MUST be shown to prevent accidents
- Deletion MUST be irreversible (no soft delete)

**Toggle Complete (MANDATORY):**
- Users MUST be able to mark tasks as done/not done
- Visual feedback MUST be provided (checkbox, strikethrough text)
- Users MUST be able to toggle status back and forth

### 5.3 Multi-User Support

**Purpose:** Allow multiple people to use the application simultaneously with complete data privacy.

**Requirements (MANDATORY):**
- Each user MUST have a unique account (identified by user_id)
- Tasks MUST be linked to users via user_id foreign key
- Backend MUST filter all data by authenticated user's user_id
- Users MUST never be able to see other users' tasks
- Complete data privacy MUST be enforced at the database and API level

**Example Scenario:**
- User A logs in → Sees only their 10 tasks
- User B logs in → Sees only their 5 tasks
- User A cannot access User B's tasks (403 Forbidden if attempted)
- User B cannot access User A's tasks (403 Forbidden if attempted)

### 5.4 Persistent Storage

**Purpose:** Ensure data is saved permanently and accessible from any device.

**Requirements (MANDATORY):**
- All tasks MUST be stored in Neon PostgreSQL database
- Data MUST persist across browser sessions
- Users MUST be able to access their data from any device
- Database MUST be hosted in cloud (Neon)
- Automatic backups MUST be enabled (provided by Neon)

**Benefits:**
- Tasks don't disappear when browser is closed
- Multi-device access (phone, laptop, tablet)
- No data loss due to local storage limitations
- Professional-grade data persistence

---

## 6. Data Models

### 6.1 User Model

**Schema (managed by Better Auth):**
```
User:
  - id: unique identifier (UUID, PRIMARY KEY)
  - email: user's email address (UNIQUE, NOT NULL)
  - name: user's display name (optional)
  - password_hash: encrypted password (NOT NULL)
  - created_at: account creation timestamp (NOT NULL)
```

**Constraints:**
- Email MUST be unique across all users
- Email MUST be valid email format
- Password MUST be hashed before storage (bcrypt)
- ID MUST be UUID v4 format

### 6.2 Task Model

**Schema (MANDATORY):**
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

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_is_complete ON tasks(is_complete);
```

**Field Specifications:**
- **id**: Auto-incrementing integer, primary key
- **user_id**: Foreign key to users.id, CASCADE delete, indexed for performance
- **title**: 1-100 characters, required, cannot be empty
- **description**: Optional text field, max 500 characters
- **is_complete**: Boolean flag, defaults to false
- **created_at**: Timestamp, auto-set on creation
- **updated_at**: Timestamp, auto-updated on modification

### 6.3 Relationships

**User ↔ Task Relationship (MANDATORY):**
- One User → Many Tasks (one-to-many)
- Foreign key constraint: task.user_id MUST reference valid user.id
- Cascade delete: If user deleted, all their tasks MUST be deleted automatically
- Index on user_id for fast queries when filtering by user

**Rationale:** This relationship ensures data isolation and prevents orphaned tasks. The cascade delete maintains data integrity.

---

## 7. API Specifications

### 7.1 Authentication Endpoints

#### POST /api/auth/signup (MANDATORY)

**Purpose:** Create new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "name": "John Doe"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- 400 Bad Request: Invalid email format, weak password, missing required fields
- 409 Conflict: Email already registered

#### POST /api/auth/login (MANDATORY)

**Purpose:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**JWT Token Payload:**
```json
{
  "user_id": "uuid-here",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Error Responses:**
- 400 Bad Request: Missing email or password
- 401 Unauthorized: Invalid credentials

### 7.2 Task Endpoints (All Require JWT Token)

**Authentication (MANDATORY for all task endpoints):**
- Header: `Authorization: Bearer {jwt_token}`
- Token MUST be validated on every request
- user_id from token MUST match user_id in URL path
- Return 401 if token invalid/expired
- Return 403 if user_id mismatch

#### GET /api/{user_id}/tasks (MANDATORY)

**Purpose:** Retrieve all tasks for authenticated user

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": "uuid-here",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "is_complete": false,
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-10T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### POST /api/{user_id}/tasks (MANDATORY)

**Purpose:** Create new task for authenticated user

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created",
  "data": { /* new task object */ }
}
```

**Error Responses:**
- 400 Bad Request: Title empty, title too long (>100 chars), description too long (>500 chars)

#### PUT /api/{user_id}/tasks/{task_id} (MANDATORY)

**Purpose:** Update existing task

**Request Body:**
```json
{
  "title": "Buy groceries and fruits",
  "description": "Milk, eggs, bread, apples"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated",
  "data": { /* updated task object */ }
}
```

**Error Responses:**
- 400 Bad Request: Validation errors
- 404 Not Found: Task does not exist or does not belong to user

#### DELETE /api/{user_id}/tasks/{task_id} (MANDATORY)

**Purpose:** Delete task permanently

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- 404 Not Found: Task does not exist or does not belong to user

#### PATCH /api/{user_id}/tasks/{task_id}/complete (MANDATORY)

**Purpose:** Toggle task completion status

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task marked as complete",
  "data": { /* updated task with is_complete toggled */ }
}
```

---

## 8. Security Requirements

### 8.1 Authentication Security (MANDATORY)

**Password Hashing:**
- MUST use bcrypt via passlib library
- MUST use minimum 12 rounds of hashing
- NEVER store plain text passwords
- NEVER log passwords (even hashed)

**JWT Token Security:**
- MUST use HS256 signing algorithm
- Secret key MUST be 32+ characters, randomly generated
- Secret key MUST be stored in environment variable (never in code)
- Tokens MUST expire after maximum 7 days
- Tokens MUST include user_id and email in payload

**HTTPS (MANDATORY in production):**
- Production MUST enforce HTTPS/SSL
- HTTP requests MUST redirect to HTTPS
- Cookies MUST be marked secure in production

### 8.2 Data Isolation (MANDATORY)

**Every API endpoint MUST perform these checks:**

1. Verify JWT token is valid and not expired
2. Extract user_id from JWT payload
3. Verify user_id in URL path matches JWT user_id
4. Filter all database queries by authenticated user's user_id
5. Return 401 Unauthorized for invalid/expired tokens
6. Return 403 Forbidden for accessing other users' data

**Security Check Pattern (MANDATORY):**
```python
# In every task endpoint
async def verify_user_access(
    user_id_from_url: str,
    token: str
) -> str:
    # Decode JWT and extract user_id
    user_id_from_jwt = decode_jwt(token)["user_id"]

    # Verify match
    if user_id_from_url != user_id_from_jwt:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other users' data"
        )

    return user_id_from_jwt

# In database queries
tasks = session.exec(
    select(Task).where(Task.user_id == verified_user_id)
).all()
```

### 8.3 Input Validation (MANDATORY)

**Task Title:**
- MUST be present (not None, not empty string)
- MUST be minimum 1 character
- MUST be maximum 100 characters
- Type MUST be string
- MUST reject titles with only whitespace

**Task Description:**
- Optional (can be None or empty string)
- Maximum 500 characters if provided
- Type MUST be string

**Email:**
- MUST match valid email regex pattern
- MUST be unique in users table
- MUST be lowercase normalized

**Password:**
- MUST be minimum 8 characters
- SHOULD contain mix of uppercase, lowercase, numbers (recommended in UI, not enforced)

**All Inputs:**
- MUST be validated before database operations
- MUST return clear error messages for validation failures
- MUST sanitize inputs to prevent XSS (framework handles this)

### 8.4 SQL Injection Prevention (MANDATORY)

**Rules:**
- ALWAYS use SQLModel ORM for database operations
- NEVER use string concatenation to build SQL queries
- NEVER use f-strings to insert user input into SQL
- NEVER execute raw SQL with user input
- ONLY use parameterized queries (ORM does this automatically)

**Example of FORBIDDEN practice:**
```python
# ❌ NEVER DO THIS
query = f"SELECT * FROM tasks WHERE title = '{user_input}'"
session.exec(query)
```

**Correct approach:**
```python
# ✅ ALWAYS DO THIS
tasks = session.exec(
    select(Task).where(Task.title == user_input)
).all()
```

---

## 9. Frontend Specifications

### 9.1 Page Structure (MANDATORY)

**Landing Page (/):**
- Welcome message explaining the app
- "Sign Up" button (links to /signup)
- "Log In" button (links to /login)
- Brief description of features

**Login Page (/login):**
- Email input field (type="email")
- Password input field (type="password" with show/hide toggle)
- "Login" button
- Link to /signup ("Don't have an account? Sign up")
- Error message display area
- Loading state during authentication

**Signup Page (/signup):**
- Email input field (type="email")
- Password input field (type="password" with show/hide toggle)
- Name input field (optional)
- "Sign Up" button
- Link to /login ("Already have an account? Log in")
- Error message display area
- Loading state during registration

**Tasks Page (/tasks):**
- Protected route (redirect to /login if not authenticated)
- Header with user name and "Logout" button
- "Add Task" button (opens modal)
- List of tasks (or empty state if none)
- Task count summary ("You have X tasks, Y completed")

### 9.2 Component Architecture (MANDATORY)

**LoginForm Component:**
- Handles form state (email, password)
- Validates inputs locally (email format, password not empty)
- Calls POST /api/auth/login on submit
- Shows loading spinner during API call
- Displays API errors in error message area
- Stores JWT token in localStorage on success
- Redirects to /tasks on successful login

**SignupForm Component:**
- Similar structure to LoginForm
- Additional name field
- Calls POST /api/auth/signup
- Redirects to /login on success (not /tasks)
- Shows success message before redirect

**TaskList Component:**
- Fetches tasks via GET /api/{user_id}/tasks on mount
- Shows loading spinner while fetching
- Displays empty state if tasks array is empty
- Maps tasks to TaskItem components
- Shows task statistics (total count, completed count)
- Refetches tasks after create/update/delete operations

**TaskItem Component:**
- Displays single task with title, description, creation date
- Checkbox for completion toggle (calls PATCH endpoint)
- Edit button (opens modal with TaskForm)
- Delete button (shows ConfirmDialog)
- Visual indication when complete (strikethrough text)
- Hover effects for interactive elements

**TaskForm Component (MANDATORY, reusable):**
- Used for both create and edit modes
- Title input with live character counter (X/100)
- Description textarea with live character counter (X/500)
- Client-side validation before submit
- "Save" and "Cancel" buttons
- Calls POST for create, PUT for edit
- Clears form and closes modal on success

**Modal Component:**
- Backdrop overlay (semi-transparent, dark)
- Centered content area
- Close on backdrop click
- Close on ESC key press
- Contains TaskForm for create/edit operations

**ConfirmDialog Component:**
- Used for delete confirmation
- Warning message ("Are you sure you want to delete this task? This cannot be undone.")
- "Confirm" button (danger style, red)
- "Cancel" button (neutral style, gray)
- Calls DELETE endpoint on confirm

### 9.3 Styling Guidelines (MANDATORY)

**Framework:**
- Use Tailwind CSS utility classes exclusively
- No custom CSS files
- No inline styles (except for dynamic values)

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Test on 320px (mobile), 768px (tablet), 1920px (desktop)

**Color Scheme (MANDATORY):**
- Primary: Blue (for main actions, links)
- Secondary: Gray (for neutral elements)
- Success: Green (for success messages, completed tasks)
- Error: Red (for error messages, delete button)
- Background: White/Light Gray
- Text: Dark Gray/Black

**Spacing:**
- Consistent padding: p-4, p-6, p-8
- Consistent margins: mb-4, mb-6, mb-8
- Use Tailwind's spacing scale

**Typography:**
- Font family: system font stack (Tailwind default)
- Headings: text-2xl, text-xl, text-lg
- Body: text-base
- Small: text-sm
- Line height: leading-relaxed for body text

**Interactive States (MANDATORY):**
- Hover: Change background/border color on all clickable elements
- Focus: Visible focus ring on all inputs and buttons
- Disabled: Reduced opacity, no pointer events
- Loading: Spinner animation, disabled state
- Active: Visual feedback on button press

---

## 10. Development Workflow

### 10.1 Spec-Driven Process (MANDATORY)

**Step 1: Write Specification**
- Define feature requirements in detail
- Create user stories with acceptance criteria
- Document API contracts
- Specify data models
- Must be approved before Step 2

**Step 2: Create Implementation Plan**
- Break feature into small tasks
- Define technical approach
- Identify dependencies
- Estimate complexity
- Must be approved before Step 3

**Step 3: Generate Code with Claude Code**
- Provide specifications and plan to Claude Code
- Review generated code for compliance
- Ensure code matches specifications exactly
- Verify type safety and security

**Step 4: Test Implementation**
- Verify all acceptance criteria are met
- Test authentication and authorization
- Test multi-user isolation
- Test edge cases and error handling
- Verify responsive design

**Step 5: Refine if Needed**
- Update specifications based on findings
- Regenerate code with Claude Code
- Retest until all criteria met

**Step 6: Document Process**
- Record implementation details in CLAUDE.md
- Create Prompt History Records (PHRs)
- Document any architectural decisions (ADRs)
- Update README.md

### 10.2 Iteration Strategy (MANDATORY)

**Build in this exact order:**

**Iteration 1: Project Setup**
- Create repository structure
- Write constitution (this file)
- Create initial specifications
- Set up Git repository

**Iteration 2: Configuration**
- Configure frontend (Next.js, TypeScript, Tailwind)
- Configure backend (FastAPI, SQLModel, UV)
- Set up environment variables
- Create .gitignore

**Iteration 3: Database Setup**
- Create Neon database
- Define User model (Better Auth)
- Define Task model (SQLModel)
- Test database connection

**Iteration 4: Backend Authentication**
- Implement POST /api/auth/signup
- Implement POST /api/auth/login
- Implement JWT token generation
- Test with cURL/Postman

**Iteration 5: Backend Task CRUD**
- Implement GET /api/{user_id}/tasks
- Implement POST /api/{user_id}/tasks
- Implement PUT /api/{user_id}/tasks/{task_id}
- Implement DELETE /api/{user_id}/tasks/{task_id}
- Implement PATCH /api/{user_id}/tasks/{task_id}/complete
- Test all endpoints with authentication

**Iteration 6: Frontend Authentication UI**
- Create landing page (/)
- Create login page (/login) with LoginForm
- Create signup page (/signup) with SignupForm
- Implement JWT storage and routing
- Test full authentication flow

**Iteration 7: Frontend Task List UI**
- Create tasks page (/tasks) with TaskList
- Implement TaskItem component
- Implement empty state
- Test task display and loading states

**Iteration 8: Frontend Task Creation**
- Implement Modal component
- Implement TaskForm component (create mode)
- Implement "Add Task" button
- Test task creation flow

**Iteration 9: Frontend Task Edit/Delete**
- Implement TaskForm component (edit mode)
- Implement ConfirmDialog component
- Implement edit and delete buttons
- Implement completion toggle
- Test all task operations

**Iteration 10: Testing & Deployment**
- Run all authentication tests (Section 12.1)
- Run all multi-user isolation tests (Section 12.2)
- Run all CRUD tests (Section 12.3)
- Run all UI/UX tests (Section 12.4)
- Deploy frontend to Vercel
- Create demo video
- Finalize documentation

### 10.3 Forbidden Practices (MANDATORY)

**The following practices are STRICTLY PROHIBITED:**

❌ **Manual Code Writing**
All code except specifications and documentation MUST be generated by Claude Code.

❌ **Skipping Specifications**
No code may be written without an approved specification.

❌ **Copy-Pasting from Tutorials**
All code must be generated by Claude Code based on this project's specifications.

❌ **Hardcoding Secrets in Code**
All secrets (API keys, JWT secret, database URL) MUST be in environment variables.

❌ **Implementing Without Specs**
Features cannot be added without first updating specifications.

❌ **Deploying Without Testing**
All tests in Section 12 MUST pass before deployment.

❌ **Committing .env Files**
Environment files MUST be in .gitignore and never committed.

❌ **Using Plain Text Passwords**
Passwords MUST always be hashed with bcrypt before storage.

❌ **Skipping Authentication Checks**
Every task endpoint MUST verify JWT token and user_id.

❌ **Raw SQL Queries**
All database operations MUST use SQLModel ORM.

**Rationale:** These practices ensure security, quality, and alignment with hackathon requirements.

---

## 11. Environment Configuration

### 11.1 Frontend Environment Variables (MANDATORY)

**File: `frontend/.env.local`** (MUST be gitignored)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth configuration
BETTER_AUTH_SECRET=your-32-char-secret-key-here-change-this
BETTER_AUTH_URL=http://localhost:3000

# Database (Better Auth needs direct access)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
```

**File: `frontend/.env.example`** (MUST be committed)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth configuration (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Neon database connection string
DATABASE_URL=
```

### 11.2 Backend Environment Variables (MANDATORY)

**File: `backend/.env`** (MUST be gitignored)

```env
# Neon PostgreSQL connection string
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# JWT secret key (must match frontend BETTER_AUTH_SECRET)
BETTER_AUTH_SECRET=your-32-char-secret-key-here-change-this

# CORS allowed origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,https://yourapp.vercel.app
```

**File: `backend/.env.example`** (MUST be committed)

```env
# Neon PostgreSQL connection string
DATABASE_URL=

# JWT secret key (must match frontend, generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=

# CORS allowed origins (comma-separated)
CORS_ORIGINS=http://localhost:3000
```

**Critical Requirements:**
- Same `BETTER_AUTH_SECRET` in both frontend and backend (MANDATORY)
- Never commit `.env` files to Git (MANDATORY)
- Always commit `.env.example` files as templates (MANDATORY)
- Generate strong random secrets (32+ characters) (MANDATORY)
- Use `openssl rand -base64 32` to generate secrets

---

## 12. Testing Requirements

### 12.1 Authentication Tests (MANDATORY)

All tests MUST pass before deployment:

- [ ] **Test 1:** Sign up with new email → Account created, success message shown
- [ ] **Test 2:** Sign up with existing email → Error shown: "Email already registered"
- [ ] **Test 3:** Sign up with invalid email → Error shown: "Invalid email format"
- [ ] **Test 4:** Log in with valid credentials → JWT received, redirected to /tasks
- [ ] **Test 5:** Log in with invalid credentials → Error shown: "Invalid email or password"
- [ ] **Test 6:** Access /tasks without login → Redirected to /login
- [ ] **Test 7:** Access /tasks with valid token → Page loads, tasks displayed
- [ ] **Test 8:** Log out → Token cleared, redirected to /login
- [ ] **Test 9:** Access /tasks with expired token → Redirected to /login, error shown

### 12.2 Multi-User Isolation Tests (MANDATORY)

**Critical Security Test Scenario:**

1. User A signs up with email userA@example.com
2. User A logs in and creates 3 tasks (Task A1, A2, A3)
3. User A logs out
4. User B signs up with email userB@example.com
5. User B logs in and creates 2 tasks (Task B1, B2)
6. **VERIFY:** User B sees only their 2 tasks (B1, B2) - NOT User A's tasks
7. User B logs out
8. User A logs back in
9. **VERIFY:** User A sees only their 3 tasks (A1, A2, A3) - NOT User B's tasks
10. **VERIFY in database:** All tasks have correct user_id foreign key
11. **VERIFY:** Attempting to access another user's task via API returns 403 Forbidden

**This test MUST pass to ensure data privacy and security.**

### 12.3 Task CRUD Tests (MANDATORY)

- [ ] **Test 1:** Create task with title only → Success, task appears in list
- [ ] **Test 2:** Create task with title and description → Success, both fields saved
- [ ] **Test 3:** Create task with empty title → Error shown: "Title is required"
- [ ] **Test 4:** Create task with 101 character title → Error shown: "Title too long (max 100)"
- [ ] **Test 5:** Create task with 501 character description → Error shown: "Description too long (max 500)"
- [ ] **Test 6:** Edit task title → Updated in list, updated_at timestamp changed
- [ ] **Test 7:** Edit task description → Updated in list
- [ ] **Test 8:** Delete task → Confirmation shown, task removed after confirm
- [ ] **Test 9:** Delete task and cancel → Task remains in list
- [ ] **Test 10:** Toggle task to complete → Checkbox checked, text has strikethrough
- [ ] **Test 11:** Toggle task to incomplete → Checkbox unchecked, text normal
- [ ] **Test 12:** Refresh page after operations → All changes persisted

### 12.4 UI/UX Tests (MANDATORY)

**Responsive Design Tests:**
- [ ] Works on mobile screen (320px width) - all elements visible and usable
- [ ] Works on tablet screen (768px width) - optimal layout
- [ ] Works on desktop screen (1920px width) - optimal layout

**Interactive States Tests:**
- [ ] All buttons have visible hover effects
- [ ] All inputs have visible focus states (focus ring)
- [ ] Loading spinners show during all API calls
- [ ] Disabled states prevent interaction during async operations

**User Feedback Tests:**
- [ ] Error messages are clear and helpful (not technical jargon)
- [ ] Success messages show after create/update/delete operations
- [ ] Form validation errors appear inline near the relevant field
- [ ] Character counters update in real-time on title/description inputs

---

## 13. Deployment

### 13.1 Frontend Deployment - Vercel (MANDATORY)

**Steps:**

1. **Push code to GitHub**
   - Create repository on GitHub
   - Push all code (ensure .env.local is gitignored)
   - Verify .env.example is committed

2. **Connect to Vercel**
   - Sign up/login at vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Select root directory or frontend folder

3. **Configure Build Settings**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Root Directory: `frontend` (if monorepo)

4. **Add Environment Variables in Vercel Dashboard**
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL or http://localhost:8000 for testing
   - `BETTER_AUTH_SECRET`: Same secret as backend (32+ chars)
   - `BETTER_AUTH_URL`: Your Vercel deployment URL (e.g., https://yourapp.vercel.app)
   - `DATABASE_URL`: Neon connection string

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit deployment URL

**Post-Deployment Verification:**
- [ ] Frontend loads without errors
- [ ] Signup flow works end-to-end
- [ ] Login flow works end-to-end
- [ ] Task CRUD operations work
- [ ] Authentication persists across page refreshes

### 13.2 Database Setup - Neon (MANDATORY)

**Steps:**

1. **Create Neon Account**
   - Visit neon.tech
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "Create Project"
   - Project name: "todo-app" (or your choice)
   - Region: Choose closest to users
   - PostgreSQL version: 16 (latest)

3. **Get Connection String**
   - Copy connection string from dashboard
   - Format: `postgresql://user:password@ep-xxx-xxx.neon.tech/dbname?sslmode=require`
   - Save in both frontend and backend .env files

4. **Verify Database**
   - Tables will be auto-created by SQLModel on first backend run
   - Verify in Neon dashboard → Tables section
   - Should see: `users`, `tasks` tables

5. **Configure Backups** (automatic with Neon free tier)
   - Backups enabled by default
   - Point-in-time restore available

**Database Security:**
- [ ] Connection uses SSL (sslmode=require)
- [ ] Password is strong and unique
- [ ] Connection string stored in environment variables only
- [ ] Database accessible only from backend (not exposed to frontend except via Better Auth)

### 13.3 Backend Deployment (OPTIONAL for Phase II)

**For development/testing:** Backend can run locally (http://localhost:8000)

**For production deployment (optional), choose one:**

**Option 1: Render.com (Recommended)**
- Free tier available
- Easy Python deployment
- Steps:
  1. Create account at render.com
  2. New Web Service → Connect GitHub repo
  3. Runtime: Python
  4. Build Command: `pip install -r requirements.txt` or `uv sync`
  5. Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
  6. Add environment variables (DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS)

**Option 2: Railway.app**
- Free tier available
- Similar setup to Render

**Option 3: Fly.io**
- Free tier available
- Requires Dockerfile

**Post-Deployment:**
- Update frontend NEXT_PUBLIC_API_URL to deployed backend URL
- Update backend CORS_ORIGINS to include Vercel URL
- Redeploy frontend with updated environment variable

---

## 14. Quality Gates

**Phase II is considered COMPLETE when all criteria are met:**

### ✅ Authentication Quality Gate

- [ ] User can sign up with email and password
- [ ] User can log in with valid credentials
- [ ] JWT tokens are generated and validated correctly
- [ ] Protected routes enforce authentication (redirect to /login)
- [ ] Logout clears token and redirects to /login
- [ ] All authentication tests (Section 12.1) pass

### ✅ Task Management Quality Gate

- [ ] User can create tasks with title and description
- [ ] User can view all their tasks in a list
- [ ] User can update task title and/or description
- [ ] User can delete tasks with confirmation
- [ ] User can toggle task completion status
- [ ] All CRUD tests (Section 12.3) pass

### ✅ Multi-User Quality Gate

- [ ] Multiple users can use the app simultaneously
- [ ] Each user sees only their own tasks
- [ ] Data is completely isolated between users
- [ ] Attempting to access another user's data returns 403 Forbidden
- [ ] Multi-user isolation test (Section 12.2) passes

### ✅ Technical Quality Gate

- [ ] Frontend deployed and accessible on Vercel
- [ ] Database hosted on Neon with proper schema
- [ ] All code generated via Claude Code (no manual coding)
- [ ] No secrets hardcoded in source code
- [ ] All environment variables properly configured
- [ ] .env files are gitignored
- [ ] .env.example files are committed

### ✅ Documentation Quality Gate

- [ ] Constitution (this file) is complete
- [ ] Feature specifications created in /specs folder
- [ ] Implementation plan documented
- [ ] README.md contains setup instructions
- [ ] CLAUDE.md documents the development process
- [ ] Prompt History Records (PHRs) created for key decisions

### ✅ User Experience Quality Gate

- [ ] Application works on mobile (320px width)
- [ ] Application works on tablet (768px width)
- [ ] Application works on desktop (1920px width)
- [ ] All UI/UX tests (Section 12.4) pass
- [ ] Loading states show during async operations
- [ ] Error messages are clear and helpful

### ✅ Demonstration Quality Gate

- [ ] Demo video created (<90 seconds)
- [ ] Video shows complete signup flow
- [ ] Video shows complete login flow
- [ ] Video demonstrates all CRUD operations
- [ ] Video demonstrates multi-user isolation
- [ ] Public GitHub repository created and accessible

---

## 15. Deliverables

### 15.1 Code Deliverables (MANDATORY)

- [ ] Monorepo structure with frontend and backend folders
- [ ] All code 100% generated via Claude Code
- [ ] Clean, well-organized, type-safe code
- [ ] No hardcoded secrets (all in environment variables)
- [ ] All dependencies documented in package.json / pyproject.toml
- [ ] .gitignore properly configured

### 15.2 Documentation Deliverables (MANDATORY)

- [ ] `constitution.md` (this file) - Complete project constitution
- [ ] `/specs` folder - Organized feature specifications
  - [ ] `overview.md` - Project summary
  - [ ] `architecture.md` - Technical architecture
  - [ ] `features/` - Individual feature specs
  - [ ] `api/` - API endpoint documentation
  - [ ] `database/` - Database schema documentation
  - [ ] `ui/` - UI component specifications
- [ ] `README.md` - Setup instructions for running the project
- [ ] `CLAUDE.md` - Development process log
- [ ] `history/prompts/` - Prompt History Records (PHRs)
- [ ] `history/adr/` - Architecture Decision Records (if applicable)

### 15.3 Deployment Deliverables (MANDATORY)

- [ ] Frontend live and accessible on Vercel
- [ ] Database hosted on Neon with proper configuration
- [ ] Backend running (local or deployed)
- [ ] All environment variables configured correctly
- [ ] HTTPS enabled for production frontend
- [ ] CORS configured to allow frontend domain

### 15.4 Demonstration Deliverables (MANDATORY)

- [ ] Demo video (<90 seconds)
  - [ ] Shows landing page
  - [ ] Demonstrates signup flow
  - [ ] Demonstrates login flow
  - [ ] Shows all CRUD operations (create, read, update, delete, toggle)
  - [ ] Demonstrates multi-user isolation (two separate browser windows)
  - [ ] Shows responsive design (resize browser window)
- [ ] Public GitHub repository
  - [ ] Code accessible
  - [ ] README with clear setup instructions
  - [ ] No sensitive data committed (no .env files)
- [ ] Live deployment URL (Vercel)

---

## 16. Success Criteria

**This project is considered SUCCESSFUL when:**

1. ✅ A user can visit the deployed website (Vercel URL)
2. ✅ User can create an account with email and password
3. ✅ User can log in and receive a JWT token
4. ✅ User can add new tasks with title and description
5. ✅ User can view all their tasks in a list
6. ✅ User can edit task details (title and/or description)
7. ✅ User can delete tasks after confirmation
8. ✅ User can toggle tasks between complete and incomplete
9. ✅ User can log out and log back in to see tasks still there (persistence)
10. ✅ A second user can independently do all of the above
11. ✅ Neither user can see the other's tasks (data isolation verified)
12. ✅ Everything works on mobile, tablet, and desktop screen sizes
13. ✅ Code is clean, secure, type-safe, and well-documented
14. ✅ Application is deployed and accessible online (Vercel + Neon)
15. ✅ Demo video shows all features working (<90 seconds)
16. ✅ Public GitHub repository contains all code and documentation

**Ultimate Success:** The project demonstrates professional-grade full-stack web development skills using modern technologies, AI-assisted development practices, and spec-driven methodology suitable for portfolio presentation to potential employers.

---

## Governance

**Constitutional Authority (MANDATORY):**

This constitution supersedes all other development practices and guidelines. When conflicts arise between this constitution and other documentation, this constitution takes precedence.

**Amendment Process:**

Amendments to this constitution MUST follow this process:
1. Proposed change documented with rationale
2. Impact analysis on existing specifications, code, and deliverables
3. Migration plan created if breaking changes required
4. Approval obtained before implementation
5. Version number incremented according to semantic versioning
6. All dependent artifacts updated for consistency

**Semantic Versioning:**
- **MAJOR (X.0.0):** Backward-incompatible changes, principle removals, governance restructuring
- **MINOR (1.X.0):** New principles added, sections expanded, non-breaking additions
- **PATCH (1.0.X):** Clarifications, typo fixes, wording improvements, non-semantic changes

**Compliance Enforcement (MANDATORY):**

All development work MUST verify compliance with this constitution:
- All pull requests MUST reference relevant constitutional principles
- Code reviews MUST verify adherence to security, quality, and technical standards
- Any complexity violations MUST be justified and documented
- Non-compliance is grounds for work rejection

**Development Guidance:**

For runtime development guidance and AI assistant instructions, see `CLAUDE.md` in the repository root. This file contains operational procedures, tool usage, and workflow details that implement the principles established in this constitution.

**Version Information:**

**Version**: 1.0.0
**Ratified**: 2026-01-10
**Last Amended**: 2026-01-10
**Status**: Active - Implementation Ready
