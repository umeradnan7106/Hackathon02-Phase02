# Todo Full-Stack Web Application

**Panaversity Hackathon II - Phase II**

A production-ready, multi-user todo management web application with secure authentication, persistent cloud storage, and complete data privacy.

## 🎯 Project Overview

This application enables users to:
- ✅ Create secure accounts with email/password authentication
- ✅ Manage personal task lists (create, view, edit, delete, toggle completion)
- ✅ Access tasks from any device with cloud persistence
- ✅ Maintain complete privacy (users only see their own tasks)
- ✅ Experience responsive design (mobile, tablet, desktop)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5.0+ (strict mode)
- **Styling**: Tailwind CSS 4
- **Authentication**: Better Auth 1.0+ with JWT
- **API Client**: Axios

### Backend
- **Framework**: FastAPI 0.109+
- **Language**: Python 3.13+
- **ORM**: SQLModel 0.14+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT (HS256, 7-day expiration)
- **Password Hashing**: bcrypt (12+ rounds)

### Development Tools
- **Package Managers**: npm (frontend), UV (backend)
- **Version Control**: Git
- **Deployment**: Vercel (frontend), Neon (database)
- **Code Generation**: Claude Code (100%)

## 📋 Features

### Phase II Deliverables

1. **User Authentication** (P1)
   - Signup with email/password
   - Login with JWT token (7-day expiration)
   - Logout and session management
   - Protected routes

2. **Multi-User Data Isolation** (P1)
   - Complete data privacy between users
   - user_id-based filtering on all queries
   - 403 Forbidden on cross-user access attempts

3. **Task Management** (P2-P3)
   - Create tasks with title (required, 1-100 chars) and description (optional, max 500 chars)
   - View task list ordered by creation date (newest first)
   - Edit task title and description
   - Delete tasks with confirmation
   - Toggle task completion status (complete ↔ incomplete)
   - Task statistics ("You have X tasks, Y completed")
   - Empty state display

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.13+
- UV (Python package manager)
- Git
- Neon PostgreSQL account

**Install UV**:
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex
```

### Setup

**Detailed setup instructions**: See `specs/002-todo-web-app/quickstart.md`

**Quick setup**:

1. **Clone repository**:
   ```bash
   git clone <repo-url>
   cd phase02
   ```

2. **Create Neon database**:
   - Go to https://neon.tech/
   - Create project and get connection string

3. **Configure environment variables**:
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local
   # Edit frontend/.env.local with your values

   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your values
   ```

   **Critical**: `BETTER_AUTH_SECRET` must be identical in both files!

4. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   uv sync
   cd ..

   # Frontend
   cd frontend
   npm install
   cd ..
   ```

5. **Start development servers**:

   **Terminal 1 (Backend)**:
   ```bash
   cd backend
   source .venv/Scripts/activate  # Windows: .venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   **Terminal 2 (Frontend)**:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open application**:
   - Frontend: http://localhost:3000
   - Backend API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
phase02/
├── frontend/                # Next.js application
│   ├── app/                # App Router pages
│   │   ├── page.tsx        # Landing page (/)
│   │   ├── login/          # Login page (/login)
│   │   ├── signup/         # Signup page (/signup)
│   │   └── tasks/          # Tasks page (/tasks, protected)
│   ├── components/         # React components
│   ├── lib/                # API client, types, utilities
│   ├── .env.local          # Environment variables (gitignored)
│   ├── .env.example        # Environment template (committed)
│   └── package.json        # Dependencies
│
├── backend/                # FastAPI application
│   ├── main.py             # App entry point
│   ├── config.py           # Configuration (Pydantic Settings)
│   ├── database.py         # Database connection
│   ├── models.py           # SQLModel database models
│   ├── auth.py             # JWT utilities
│   ├── routes/             # API endpoints
│   │   ├── auth.py         # Authentication endpoints
│   │   └── tasks.py        # Task CRUD endpoints
│   ├── .env                # Environment variables (gitignored)
│   ├── .env.example        # Environment template (committed)
│   └── pyproject.toml      # Dependencies (UV format)
│
├── specs/                  # Feature specifications
│   └── 002-todo-web-app/
│       ├── spec.md         # Feature specification
│       ├── plan.md         # Implementation plan
│       ├── tasks.md        # Task breakdown (84 tasks)
│       ├── data-model.md   # Entity definitions
│       ├── research.md     # Technology decisions
│       ├── quickstart.md   # Developer onboarding
│       └── contracts/      # API specifications
│
├── history/                # Development logs
│   └── prompts/            # Prompt History Records
│
├── .specify/               # Spec-Kit configuration
│   └── memory/
│       └── constitution.md # Project principles
│
└── README.md               # This file
```

## 🔒 Security

- **Password Storage**: bcrypt hashing with 12+ rounds
- **Authentication**: JWT tokens (HS256, 7-day expiration)
- **Data Isolation**: user_id filtering on all database queries
- **SQL Injection Prevention**: SQLModel ORM only (raw SQL prohibited)
- **Environment Variables**: All secrets in .env files (never committed)
- **HTTPS**: Enforced in production (Vercel)

## 🧪 Testing

Manual testing following `specs/002-todo-web-app/quickstart.md`:

**Test Scenarios**:
- ✅ Authentication (signup, login, logout, protected routes)
- ✅ Multi-user isolation (User A tasks invisible to User B)
- ✅ Task CRUD (create, read, update, delete, toggle complete)
- ✅ UI/UX (responsive design, loading states, error messages)

## 📚 Documentation

- **Specification**: `specs/002-todo-web-app/spec.md` (5 user stories, 36 functional requirements)
- **Implementation Plan**: `specs/002-todo-web-app/plan.md` (technical context, architecture)
- **Task Breakdown**: `specs/002-web-app/tasks.md` (84 tasks across 8 phases)
- **Developer Guide**: `specs/002-todo-web-app/quickstart.md` (setup, testing, troubleshooting)
- **API Documentation**: `specs/002-todo-web-app/contracts/` (auth-api.md, tasks-api.md)
- **Constitution**: `.specify/memory/constitution.md` (project principles, standards)

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `DATABASE_URL`
5. Deploy

### Backend (Optional)

- Local development: `uvicorn main:app --reload`
- Production options: Render, Railway, Fly.io

## 🎓 Development Philosophy

This project follows **Spec-Driven Development (SDD)** principles:

- ✅ **Specification First**: All features specified before implementation
- ✅ **AI-Assisted**: 100% code generation via Claude Code
- ✅ **Iterative**: Small, tested increments
- ✅ **Quality Over Speed**: Production-ready standards
- ✅ **Documentation First**: Comprehensive docs at every stage
- ✅ **Type Safety**: TypeScript strict mode, Python type hints
- ✅ **Security First**: Built-in from start, not added later

## 📝 License

This project is part of Panaversity Hackathon II educational initiative.

## 🤝 Contributing

This is a hackathon project. See `.specify/memory/constitution.md` for development principles and standards.

---

**Status**: Phase 1 (Setup) Complete ✅ | Ready for Phase 2 (Foundational)

**Next Steps**: See `specs/002-todo-web-app/tasks.md` Phase 2 (13 tasks)
