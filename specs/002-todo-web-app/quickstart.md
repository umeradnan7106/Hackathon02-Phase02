# Quick Start Guide: Todo Full-Stack Web Application

**Feature**: 002-todo-web-app
**Phase**: 1 - Developer Onboarding
**Date**: 2026-01-11
**Status**: Complete

## Overview

This guide will help you set up and run the Todo Full-Stack Web Application on your local machine in under 15 minutes. Follow the steps in order for a smooth setup experience.

**What You'll Build**: A working full-stack application with Next.js frontend, FastAPI backend, and Neon PostgreSQL database.

**Prerequisites Time**: ~5 minutes
**Setup Time**: ~10 minutes
**Total Time**: ~15 minutes

---

## Prerequisites

### 1. Required Software

Install the following tools before proceeding:

| Tool | Version | Download Link | Purpose |
|------|---------|---------------|---------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org/) | Frontend development |
| **Python** | 3.13+ | [python.org](https://www.python.org/) | Backend development |
| **UV** | Latest | [astral.sh/uv](https://astral.sh/uv) | Python package manager |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |

**Verify Installation**:
```bash
node --version  # Should show v20.x.x or higher
python --version  # Should show 3.13.x or higher
git --version  # Should show git version 2.x.x
```

### 2. UV Installation (Python Package Manager)

UV is faster and more reliable than pip. Install it now:

**macOS/Linux**:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell)**:
```powershell
irm https://astral.sh/uv/install.ps1 | iex
```

**Verify**:
```bash
uv --version  # Should show uv version x.x.x
```

### 3. Code Editor

**Recommended**: [Visual Studio Code](https://code.visualstudio.com/) with extensions:
- Python
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense

---

## Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Account

1. Go to [neon.tech](https://neon.tech/)
2. Sign up (free tier available, no credit card required)
3. Verify your email

### Step 2: Create Database

1. Click "Create Project"
2. Project Name: `todo-app-hackathon` (or your choice)
3. Database Name: `todo` (default is fine)
4. Region: Choose closest to your location (e.g., US East, EU West)
5. Click "Create Project"

### Step 3: Get Connection String

1. On the project dashboard, find the "Connection Details" section
2. Copy the **Connection String** (looks like this):
   ```
   postgresql://username:password@ep-xxxxx.neon.tech/dbname?sslmode=require
   ```
3. **Save this string** - you'll need it in the next section

**Important**: Keep this connection string secret. Never commit it to Git.

---

## Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.local` file:

```bash
cd frontend
touch .env.local  # macOS/Linux
# OR
New-Item .env.local  # Windows PowerShell
```

Add this content (replace `YOUR_NEON_CONNECTION_STRING` and generate a secret key):

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth configuration
BETTER_AUTH_SECRET=your-32-char-secret-key-here-change-this
BETTER_AUTH_URL=http://localhost:3000

# Neon database connection string (Better Auth needs direct access)
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

**Generate Secret Key**:
```bash
# macOS/Linux/Git Bash
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the generated secret and replace `your-32-char-secret-key-here-change-this`.

### Backend Environment Variables

Create `backend/.env` file:

```bash
cd ../backend  # If coming from frontend directory
touch .env  # macOS/Linux
# OR
New-Item .env  # Windows PowerShell
```

Add this content (use the SAME secret key as frontend):

```env
# Neon PostgreSQL connection string
DATABASE_URL=YOUR_NEON_CONNECTION_STRING

# JWT secret key (MUST match frontend BETTER_AUTH_SECRET)
BETTER_AUTH_SECRET=your-same-32-char-secret-key-from-frontend

# CORS allowed origins (comma-separated)
CORS_ORIGINS=http://localhost:3000
```

**Critical**: The `BETTER_AUTH_SECRET` MUST be identical in both frontend and backend.

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend  # If not already in backend directory

# Install Python dependencies with UV
uv pip install fastapi uvicorn sqlmodel passlib[bcrypt] python-jose[cryptography] pydantic-settings python-multipart
```

**Expected output**: Dependencies installed successfully.

### Step 2: Create Database Tables

Run the backend once to create tables:

```bash
# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**What happens**:
- SQLModel creates `users` and `tasks` tables in Neon database
- Better Auth sets up user management tables
- Backend starts listening on `http://localhost:8000`

**Expected output**:
```
INFO:     Will watch for changes in these directories: ['/path/to/backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Keep this terminal running** - backend needs to stay active.

### Step 3: Test Backend

Open a new terminal and test the backend:

```bash
curl http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

**Expected response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

✅ **Backend is working!** Proceed to frontend setup.

---

## Frontend Setup

### Step 1: Install Dependencies

Open a **new terminal** (keep backend running in the first):

```bash
cd frontend  # From project root

# Install Node.js dependencies
npm install
```

**Expected output**: Dependencies installed successfully (may take 1-2 minutes).

### Step 2: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**Keep this terminal running** - frontend needs to stay active.

### Step 3: Open Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the Todo application landing page with "Sign Up" and "Log In" buttons.

✅ **Frontend is working!**

---

## Testing the Application

### Manual Test Checklist

Follow these steps to verify everything works:

#### 1. Create Account (Signup)

- Click "Sign Up" button
- Enter:
  - Email: `demo@example.com`
  - Password: `demo1234` (at least 8 characters)
  - Name: `Demo User` (optional)
- Click "Sign Up"
- ✅ Should redirect to /login with success message

#### 2. Log In

- Enter:
  - Email: `demo@example.com`
  - Password: `demo1234`
- Click "Log In"
- ✅ Should redirect to /tasks page showing empty task list

#### 3. Create Task

- Click "+ Add Task" button
- Enter:
  - Title: `Buy groceries`
  - Description: `Milk, eggs, bread` (optional)
- Click "Save"
- ✅ Modal closes, task appears in list

#### 4. Create More Tasks

- Create 2-3 more tasks with different titles
- ✅ All tasks appear in list, ordered by newest first

#### 5. Toggle Task Complete

- Click checkbox next to a task
- ✅ Text has strikethrough, checkbox is checked
- Click checkbox again
- ✅ Strikethrough removed, checkbox unchecked

#### 6. Edit Task

- Click "Edit" button on a task
- Change title or description
- Click "Save"
- ✅ Changes appear in task list

#### 7. Delete Task

- Click "Delete" button on a task
- Confirmation dialog appears
- Click "Delete" to confirm
- ✅ Task removed from list

#### 8. Test Multi-User Isolation

- Open **Incognito/Private window**
- Go to `http://localhost:3000`
- Sign up with different email: `user2@example.com`
- Log in as user2
- Create a task
- ✅ User2 sees ONLY their task (not demo@example.com's tasks)
- Switch back to original window (demo@example.com still logged in)
- ✅ Demo user sees ONLY their tasks (not user2's tasks)

#### 9. Test Logout

- Click "Logout" button
- ✅ Redirected to /login page
- Try to access `http://localhost:3000/tasks` directly
- ✅ Redirected to /login (protected route works)

### ✅ All Tests Passed?

If all tests pass, your application is working correctly! You can now start developing additional features or customizing the application.

---

## Common Issues & Troubleshooting

### Issue 1: Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
cd backend
uv pip install fastapi uvicorn sqlmodel passlib[bcrypt] python-jose[cryptography] pydantic-settings
```

---

### Issue 2: Database Connection Error

**Error**: `Could not connect to database`

**Solution**:
1. Verify `DATABASE_URL` in both `frontend/.env.local` and `backend/.env`
2. Ensure connection string includes `?sslmode=require` at the end
3. Test connection on Neon dashboard (project should show "Active")
4. Check firewall/network not blocking Neon (port 5432)

---

### Issue 3: JWT Token Mismatch

**Error**: `Invalid token` or `403 Forbidden` on task endpoints

**Solution**:
1. Verify `BETTER_AUTH_SECRET` is IDENTICAL in frontend and backend
2. Regenerate secret and update BOTH .env files:
   ```bash
   openssl rand -base64 32
   ```
3. Restart both frontend and backend servers

---

### Issue 4: Frontend API Calls Fail

**Error**: `Network Error` or `CORS error` in browser console

**Solution**:
1. Verify backend is running on port 8000 (`curl http://localhost:8000` should respond)
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is `http://localhost:8000`
3. Verify `CORS_ORIGINS` in `backend/.env` includes `http://localhost:3000`
4. Restart both servers

---

### Issue 5: "Module not found" in Next.js

**Error**: `Module not found: Can't resolve '@/components/...'`

**Solution**:
1. Verify `tsconfig.json` has path aliases configured:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```
2. Restart frontend dev server: `npm run dev`

---

### Issue 6: Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
- **Frontend (port 3000)**:
  ```bash
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9

  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

- **Backend (port 8000)**:
  ```bash
  # macOS/Linux
  lsof -ti:8000 | xargs kill -9

  # Windows
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  ```

Then restart the server.

---

### Issue 7: Better Auth Setup Issues

**Error**: `Better Auth initialization failed`

**Solution**:
1. Ensure `DATABASE_URL` is accessible from frontend (Better Auth needs direct database access)
2. Verify database schema created (check Neon dashboard, tables should exist)
3. Check Better Auth version: `npm list better-auth` (should be 1.0.0+)
4. Clear Next.js cache:
   ```bash
   rm -rf .next  # macOS/Linux
   Remove-Item .next -Recurse  # Windows PowerShell
   npm run dev
   ```

---

## Development Workflow

### Running Both Servers

You need **two terminal windows**:

**Terminal 1 (Backend)**:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

### Stopping Servers

- Press `CTRL+C` in each terminal to stop the servers

### Restarting After Changes

- **Backend**: Server auto-reloads on code changes (`--reload` flag)
- **Frontend**: Next.js auto-reloads on code changes
- **No restart needed** for most code changes
- **Restart required** if you change `.env` files

---

## Project Structure Overview

```
phase02/
├── frontend/                  # Next.js application
│   ├── app/                  # Pages (/, /login, /signup, /tasks)
│   ├── components/           # React components
│   ├── lib/                  # API client, utilities
│   ├── .env.local            # Environment variables (GITIGNORED)
│   └── package.json          # Dependencies
│
├── backend/                   # FastAPI application
│   ├── main.py               # App entry point
│   ├── models.py             # Database models
│   ├── routes/               # API endpoints
│   ├── .env                  # Environment variables (GITIGNORED)
│   └── pyproject.toml        # Dependencies
│
└── specs/                     # Specifications and documentation
    └── 002-todo-web-app/     # This feature's specs
```

---

## API Documentation

### Automatic API Docs

FastAPI provides automatic interactive API documentation:

1. Ensure backend is running
2. Open browser to:
   - **Swagger UI**: `http://localhost:8000/docs`
   - **ReDoc**: `http://localhost:8000/redoc`

3. You can test all API endpoints directly in the browser!

### Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Log in, receive JWT token |
| GET | `/api/{user_id}/tasks` | Get all tasks for user |
| POST | `/api/{user_id}/tasks` | Create new task |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle completion |

See `contracts/auth-api.md` and `contracts/tasks-api.md` for detailed API documentation.

---

## Next Steps

### After Successful Setup

1. **Read the Specification**: `specs/002-todo-web-app/spec.md` - Understand all requirements
2. **Read the Implementation Plan**: `specs/002-todo-web-app/plan.md` - Understand architecture
3. **Explore Data Model**: `specs/002-todo-web-app/data-model.md` - Database schema
4. **Review API Contracts**: `specs/002-todo-web-app/contracts/` - API specifications
5. **Start Development**: Follow the 10-iteration strategy in the constitution

### Development Resources

- **Constitution**: `.specify/memory/constitution.md` - Project principles and standards
- **Research**: `specs/002-todo-web-app/research.md` - Technology decisions
- **CLAUDE.md**: Development guide and log
- **README.md**: Project overview

---

## Getting Help

### Documentation

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- **SQLModel**: [sqlmodel.tiangolo.com](https://sqlmodel.tiangolo.com/)
- **Neon**: [neon.tech/docs](https://neon.tech/docs)
- **Better Auth**: [better-auth.com/docs](https://better-auth.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

### Common Commands Reference

```bash
# Frontend
npm install              # Install dependencies
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run lint             # Run linter

# Backend
uv pip install ...       # Install dependencies
uvicorn main:app --reload  # Start dev server (port 8000)
python -m pytest         # Run tests (if configured)

# Database
# View tables in Neon dashboard: neon.tech/app/projects
```

---

## Summary

✅ **Prerequisites Installed**: Node.js 20+, Python 3.13+, UV, Git
✅ **Database Created**: Neon PostgreSQL with connection string
✅ **Environment Configured**: Frontend and backend .env files
✅ **Backend Running**: `http://localhost:8000`
✅ **Frontend Running**: `http://localhost:3000`
✅ **Application Tested**: Signup, login, CRUD operations working

**Status**: Ready for development!

**Next Step**: Review the implementation plan at `specs/002-todo-web-app/plan.md` and begin Iteration 1 of development.

---

## Appendix: Environment Variable Reference

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `BETTER_AUTH_SECRET` | JWT secret key (32+ chars) | `your-generated-secret` |
| `BETTER_AUTH_URL` | Frontend URL | `http://localhost:3000` |
| `DATABASE_URL` | Neon connection string | `postgresql://...` |

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon connection string | `postgresql://...` |
| `BETTER_AUTH_SECRET` | JWT secret (MUST match frontend) | `your-generated-secret` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |

**Security Reminder**: NEVER commit `.env` or `.env.local` files to Git. These files are in `.gitignore`.

---

**Quick Start Guide Complete** ✅

You're all set to start building! If you encounter any issues not covered in the troubleshooting section, check the constitution, specification, and API contract documentation.

Happy coding! 🚀
