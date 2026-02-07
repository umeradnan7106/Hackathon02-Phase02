# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/002-todo-web-app/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: This specification does NOT request automated tests. Manual testing will be performed following quickstart.md and constitution Section 12.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. User stories are ordered by priority (P1 → P2 → P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/`, `frontend/` at repository root (phase02/)
- Backend paths: `backend/main.py`, `backend/models.py`, `backend/routes/`, `backend/.env`
- Frontend paths: `frontend/app/`, `frontend/components/`, `frontend/lib/`, `frontend/.env.local`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Tasks**:

- [ ] T001 Create monorepo directory structure (frontend/, backend/, .gitignore)
- [ ] T002 [P] Initialize frontend with Next.js 16, TypeScript, Tailwind CSS in frontend/
- [ ] T003 [P] Initialize backend with UV and FastAPI dependencies in backend/
- [ ] T004 [P] Create .gitignore for both frontend (.env.local, .next/, node_modules/) and backend (.env, __pycache__/, .venv/)
- [ ] T005 [P] Create frontend/.env.example template with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET, DATABASE_URL
- [ ] T006 [P] Create backend/.env.example template with DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
- [ ] T007 Configure TypeScript strict mode in frontend/tsconfig.json with path aliases (@/*)
- [ ] T008 Configure Tailwind CSS in frontend/tailwind.config.ts with color scheme and responsive breakpoints
- [ ] T009 Create README.md with project overview, tech stack, and quickstart reference

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Tasks**:

- [ ] T010 Create Neon PostgreSQL database and obtain connection string
- [ ] T011 Configure frontend/.env.local with DATABASE_URL, BETTER_AUTH_SECRET (32+ chars), NEXT_PUBLIC_API_URL=http://localhost:8000
- [ ] T012 Configure backend/.env with DATABASE_URL (same as frontend), BETTER_AUTH_SECRET (same as frontend), CORS_ORIGINS=http://localhost:3000
- [ ] T013 [P] Create backend/config.py with Pydantic Settings for DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
- [ ] T014 [P] Create backend/database.py with SQLModel engine, create_db_and_tables(), and get_session() dependency
- [ ] T015 [P] Create backend/models.py with User model (Better Auth managed) and Task model with user_id FK
- [ ] T016 [P] Create backend/auth.py with create_access_token(), verify_token(), hash_password(), verify_password(), get_current_user() dependency
- [ ] T017 [P] Create backend/main.py with FastAPI app, CORS middleware, and startup event to create DB tables
- [ ] T018 [P] Create frontend/lib/types.ts with User, Task, ApiResponse, TaskCreateRequest, TaskUpdateRequest interfaces
- [ ] T019 [P] Create frontend/lib/api.ts with axios client, JWT interceptor, and error handling (401 redirect to /login)
- [ ] T020 [P] Configure Better Auth in frontend/lib/auth.ts with database config and JWT settings (7-day expiration, HS256)
- [ ] T021 Test backend startup (uvicorn main:app --reload) and verify database tables created in Neon
- [ ] T022 Test frontend startup (npm run dev) and verify Next.js 16 app loads on http://localhost:3000

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Account Creation and First Login (Priority: P1) 🎯 MVP Part 1

**Goal**: Enable users to create accounts and authenticate so they can access the application

**Independent Test**: A new user can visit the application, create an account with email/password, log in, and be redirected to an empty tasks page

**User Story Dependencies**: MUST complete before User Stories 2-4. User Story 5 (Data Isolation) implements in parallel.

### Backend Authentication Implementation

- [ ] T023 [P] [US1] Create backend/routes/__init__.py to mark routes as a Python package
- [ ] T024 [P] [US1] Create backend/routes/auth.py with APIRouter for /api/auth prefix
- [ ] T025 [US1] Implement POST /api/auth/signup endpoint in backend/routes/auth.py (email validation, uniqueness check, bcrypt hashing 12+ rounds, User creation, return 201 Created with user data excluding password_hash)
- [ ] T026 [US1] Implement POST /api/auth/login endpoint in backend/routes/auth.py (email lookup, password verification with bcrypt, JWT token generation with 7-day expiration, return 200 OK with token and user data)
- [ ] T027 [US1] Register auth router in backend/main.py with prefix /api/auth and tag "auth"
- [ ] T028 [US1] Test POST /api/auth/signup with cURL (valid signup, duplicate email→409, invalid email→400, short password→400)
- [ ] T029 [US1] Test POST /api/auth/login with cURL (valid login→200 with token, invalid credentials→401, missing fields→400)

### Frontend Authentication UI Implementation

- [ ] T030 [P] [US1] Create frontend/app/page.tsx with landing page (welcome message, Sign Up button linking to /signup, Log In button linking to /login)
- [ ] T031 [P] [US1] Create frontend/app/login/page.tsx with login page layout
- [ ] T032 [P] [US1] Create frontend/app/signup/page.tsx with signup page layout
- [ ] T033 [P] [US1] Create frontend/components/LoginForm.tsx with email/password inputs, form state, client-side validation, API call to POST /api/auth/login, token storage in localStorage, redirect to /tasks on success, error display
- [ ] T034 [P] [US1] Create frontend/components/SignupForm.tsx with email/password/name inputs, form state, client-side validation, API call to POST /api/auth/signup, redirect to /login on success with success message, error display
- [ ] T035 [US1] Implement middleware.ts for protected routes (/tasks requires token, redirect to /login if missing; /login and /signup redirect to /tasks if authenticated)
- [ ] T036 [US1] Add logout functionality (create logout() function in frontend/lib/api.ts to clear localStorage token and redirect to /login)
- [ ] T037 [US1] Create frontend/app/tasks/page.tsx as protected route with "Logout" button and placeholder for task list (empty for now)
- [ ] T038 [US1] Style LoginForm and SignupForm with Tailwind CSS (mobile-first responsive, loading states, error message styling, focus states)

**Checkpoint**: User Story 1 complete - Users can signup, login, logout, and protected routes work. Verify independently before proceeding.

---

## Phase 4: User Story 5 - Multi-User Data Isolation (Priority: P1) 🎯 MVP Part 2

**Goal**: Ensure complete data privacy between users through JWT verification and user_id filtering

**Independent Test**: Create two users (User A, User B). User A creates 3 tasks, logs out. User B creates 2 tasks. User A logs back in and sees only their 3 tasks. User B sees only their 2 tasks. Attempting to access another user's task via API returns 403 Forbidden.

**User Story Dependencies**: Requires User Story 1 (authentication) complete. MUST complete before User Stories 2-4.

### Backend Security Implementation

- [ ] T039 [P] [US5] Create verify_user_access() dependency function in backend/auth.py (extract token from Authorization header, decode JWT, extract user_id from token, verify user_id in URL matches token user_id, raise 401 for invalid token, raise 403 for user_id mismatch)
- [ ] T040 [P] [US5] Add indexes to Task model in backend/models.py (idx_tasks_user_id on user_id, idx_tasks_is_complete on is_complete)
- [ ] T041 [US5] Document CASCADE delete behavior in backend/models.py Task model (foreign key user_id references users.id with ON DELETE CASCADE to ensure no orphaned tasks)
- [ ] T042 [US5] Test user_id verification (create test function that attempts cross-user access, verify 403 Forbidden returned)

**Checkpoint**: User Story 5 complete - Data isolation security mechanisms in place. Backend ready for task endpoints.

---

## Phase 5: User Story 2 - Create and View Tasks (Priority: P2)

**Goal**: Enable users to create new tasks and view their task list

**Independent Test**: After logging in, a user can click "Add Task", enter a title (and optionally a description), save it, and immediately see the new task appear in their task list

**User Story Dependencies**: Requires User Stories 1 and 5 (authentication + data isolation) complete.

### Backend Task CRUD Implementation (GET and POST)

- [ ] T043 [P] [US2] Create backend/routes/tasks.py with APIRouter for /api prefix
- [ ] T044 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py (verify_user_access dependency, filter by user_id, order by created_at DESC, return 200 OK with tasks array and count, handle 401/403)
- [ ] T045 [US2] Implement POST /api/{user_id}/tasks endpoint in backend/routes/tasks.py (verify_user_access, validate title 1-100 chars not whitespace-only, validate description ≤500 chars if provided, create Task with user_id from token, return 201 Created, handle 400 validation errors)
- [ ] T046 [US2] Register tasks router in backend/main.py with prefix /api and tag "tasks"
- [ ] T047 [US2] Test GET /api/{user_id}/tasks with cURL (valid token→200 with empty array initially, invalid token→401, user_id mismatch→403)
- [ ] T048 [US2] Test POST /api/{user_id}/tasks with cURL (valid request→201, empty title→400, title too long→400, description too long→400, no token→401)

### Frontend Task List and Creation UI Implementation

- [ ] T049 [P] [US2] Create getTasks() and createTask() functions in frontend/lib/api.ts (GET and POST requests with Authorization header)
- [ ] T050 [P] [US2] Create frontend/components/TaskList.tsx (fetch tasks on mount, display loading spinner, show empty state "No tasks yet" if count=0, map tasks to TaskItem components, display task statistics "You have X tasks, Y completed", refetch after create)
- [ ] T051 [P] [US2] Create frontend/components/TaskItem.tsx (display task title, description, creation date, completion checkbox placeholder, Edit button placeholder, Delete button placeholder, strikethrough styling if is_complete=true)
- [ ] T052 [P] [US2] Create frontend/components/Modal.tsx (backdrop overlay, centered content, close on backdrop click, close on ESC key, close button, accepts children)
- [ ] T053 [P] [US2] Create frontend/components/TaskForm.tsx in create mode (title input with character counter X/100, description textarea with character counter X/500, client-side validation, disable Save if title empty or >100 chars, call createTask() on submit, clear form on success, display error messages)
- [ ] T054 [US2] Update frontend/app/tasks/page.tsx to render TaskList component and "Add Task" button that opens Modal with TaskForm
- [ ] T055 [US2] Style TaskList, TaskItem, Modal, and TaskForm with Tailwind CSS (responsive layout, loading states, empty state styling, form styling, character counters, error messages, hover/focus states)

**Checkpoint**: User Story 2 complete - Users can create and view tasks. Verify independently.

---

## Phase 6: User Story 4 - Mark Tasks Complete/Incomplete (Priority: P3)

**Goal**: Enable users to toggle task completion status to track progress

**Independent Test**: A user can click the checkbox next to any task to toggle its completion status. The UI updates immediately (checkbox checked, text strikethrough for complete; unchecked, normal text for incomplete), and the change persists across page refreshes.

**User Story Dependencies**: Requires User Story 2 (create and view tasks) complete.

### Backend Task Toggle Completion Implementation

- [ ] T056 [US4] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint in backend/routes/tasks.py (verify_user_access, query task by id and user_id, toggle is_complete boolean, update updated_at timestamp, return 200 OK with updated task, return 404 if task not found or not owned by user, handle 401/403)
- [ ] T057 [US4] Test PATCH /api/{user_id}/tasks/{task_id}/complete with cURL (toggle false→true→200, toggle true→false→200, task not found→404, cross-user access→404, no token→401)

### Frontend Task Toggle Completion UI Implementation

- [ ] T058 [P] [US4] Create toggleTaskComplete() function in frontend/lib/api.ts (PATCH request with Authorization header)
- [ ] T059 [US4] Update TaskItem.tsx to implement checkbox toggle (call toggleTaskComplete() on click, optimistic UI update, revert on error, display error message if API fails, persist strikethrough styling for completed tasks)
- [ ] T060 [US4] Update TaskList.tsx to calculate and display task statistics ("You have X tasks, Y completed" where Y = count of is_complete=true)

**Checkpoint**: User Story 4 complete - Users can toggle task completion status. Verify independently.

---

## Phase 7: User Story 3 - Edit and Delete Tasks (Priority: P3)

**Goal**: Enable users to modify existing tasks or permanently remove them

**Independent Test**: A user can click "Edit" on any existing task, modify the title or description, save the changes, and see the updated information immediately. They can also delete a task after confirming, and it disappears from the list.

**User Story Dependencies**: Requires User Story 2 (create and view tasks) complete.

### Backend Task Update and Delete Implementation

- [ ] T061 [P] [US3] Implement PUT /api/{user_id}/tasks/{task_id} endpoint in backend/routes/tasks.py (verify_user_access, validate title and description same as POST, query task by id and user_id, update title and description, update updated_at timestamp, return 200 OK with updated task, return 404 if not found/not owned, handle 400 validation and 401/403 auth errors)
- [ ] T062 [P] [US3] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/routes/tasks.py (verify_user_access, query task by id and user_id, delete task, return 200 OK with success message, return 404 if not found/not owned, handle 401/403)
- [ ] T063 [US3] Test PUT /api/{user_id}/tasks/{task_id} with cURL (valid update→200, invalid title→400, task not found→404, cross-user→404, no token→401)
- [ ] T064 [US3] Test DELETE /api/{user_id}/tasks/{task_id} with cURL (valid delete→200, task not found→404, cross-user→404, no token→401)

### Frontend Task Edit and Delete UI Implementation

- [ ] T065 [P] [US3] Create updateTask() and deleteTask() functions in frontend/lib/api.ts (PUT and DELETE requests with Authorization header)
- [ ] T066 [P] [US3] Create frontend/components/ConfirmDialog.tsx (warning message with task title, "Confirm" button in danger/red styling, "Cancel" button in neutral/gray styling, close on cancel or confirm)
- [ ] T067 [US3] Update TaskForm.tsx to support edit mode (accept optional initialTask prop, pre-fill form with task title and description if editing, call updateTask() instead of createTask() if editing, same validation as create mode)
- [ ] T068 [US3] Update TaskItem.tsx to add "Edit" button (opens Modal with TaskForm in edit mode, passes current task data) and "Delete" button (opens ConfirmDialog, calls deleteTask() on confirm, removes task from list on success)
- [ ] T069 [US3] Update TaskList.tsx to handle task updates and deletions (refetch tasks after update/delete operations to ensure UI reflects latest data)
- [ ] T070 [US3] Style ConfirmDialog with Tailwind CSS (warning icon, clear messaging, danger button styling, responsive design)

**Checkpoint**: User Story 3 complete - Users can edit and delete tasks. Verify independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories and deployment preparation

**Tasks**:

- [ ] T071 [P] Create comprehensive .gitignore at repository root (frontend/.env.local, frontend/.next/, frontend/node_modules/, backend/.env, backend/__pycache__/, backend/.venv/, .DS_Store, *.log)
- [ ] T072 [P] Update README.md with complete setup instructions (prerequisites, Neon setup, environment configuration, backend/frontend startup, testing checklist)
- [ ] T073 [P] Add loading spinners to all async operations (LoginForm, SignupForm, TaskForm, TaskList, TaskItem checkbox toggle, delete button)
- [ ] T074 [P] Add success messages after create, update, delete, and toggle operations (use toast notifications or inline messages)
- [ ] T075 [P] Verify all error messages are user-friendly with no technical jargon (test all error scenarios: 400, 401, 403, 404, 500)
- [ ] T076 [P] Test responsive design on mobile (320px width - verify all elements visible and usable), tablet (768px - verify optimal layout), and desktop (1920px - verify optimal layout)
- [ ] T077 [P] Verify all interactive elements have visible hover effects (buttons, links, task items)
- [ ] T078 [P] Verify all inputs have visible focus states with focus rings
- [ ] T079 [P] Test with multiple browsers (Chrome, Firefox, Safari, Edge) to verify cross-browser compatibility
- [ ] T080 Run all 32 manual test cases from constitution Section 12 (9 authentication tests, 4 multi-user isolation tests, 12 task CRUD tests, 7 UI/UX tests) following quickstart.md checklist
- [ ] T081 Deploy frontend to Vercel (connect GitHub repo, configure build settings, add environment variables NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_URL)
- [ ] T082 Test deployed application on Vercel (verify all functionality works in production, test multi-user isolation with two browser sessions)
- [ ] T083 Create demo video showing complete user journey (signup → login → create tasks → toggle complete → edit task → delete task → logout → multi-user isolation)
- [ ] T084 Final code review and cleanup (remove console.logs, verify type safety, check for unused imports, ensure consistent formatting)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies - can start immediately
- **Phase 2: Foundational**: Depends on Phase 1 (Setup) completion - BLOCKS all user stories
- **Phase 3: User Story 1 (P1)**: Depends on Phase 2 (Foundational) completion
- **Phase 4: User Story 5 (P1)**: Depends on Phase 3 (User Story 1) completion - BLOCKS User Stories 2-4
- **Phase 5: User Story 2 (P2)**: Depends on Phase 4 (User Story 5) completion
- **Phase 6: User Story 4 (P3)**: Depends on Phase 5 (User Story 2) completion
- **Phase 7: User Story 3 (P3)**: Depends on Phase 5 (User Story 2) completion - can run in parallel with Phase 6
- **Phase 8: Polish**: Depends on all desired user stories being complete

### User Story Dependencies

**Critical Path** (MUST complete in this order for MVP):
1. **Phase 2: Foundational** → Blocks everything
2. **Phase 3: User Story 1 (Authentication)** → Blocks all task features
3. **Phase 4: User Story 5 (Data Isolation)** → Blocks task CRUD operations
4. **Phase 5: User Story 2 (Create and View Tasks)** → Enables basic task management
5. **Phase 6 & 7: User Stories 3 & 4** → Can proceed in parallel after Phase 5

**User Story Independence After Critical Path**:
- User Story 3 (Edit/Delete) and User Story 4 (Toggle Complete) can be implemented in parallel after User Story 2 is complete
- Both stories integrate with TaskItem.tsx but modify different aspects (US3: Edit/Delete buttons, US4: Completion checkbox)

### Within Each User Story

**Backend before Frontend** (within each story):
- Backend endpoints MUST be complete and tested with cURL before frontend implementation
- Frontend can proceed once backend returns expected responses

**Parallel Opportunities within Story**:
- Backend route creation and model updates can run in parallel (different files)
- Frontend components can be built in parallel (different files: Modal.tsx, TaskForm.tsx, TaskList.tsx, TaskItem.tsx, ConfirmDialog.tsx)

### Parallel Opportunities

**Phase 1 (Setup)** - 4 tasks can run in parallel:
- T002, T003, T004, T005, T006 (frontend init, backend init, gitignore, env examples)

**Phase 2 (Foundational)** - 10 tasks can run in parallel:
- T013, T014, T015, T016, T017, T018, T019, T020 (all file creation tasks in different files)

**Phase 3 (User Story 1 Backend)** - 2 tasks can run in parallel:
- T023, T024 (routes init and auth router creation)

**Phase 3 (User Story 1 Frontend)** - 4 tasks can run in parallel:
- T030, T031, T032 (landing, login, signup pages)
- T033, T034 (LoginForm, SignupForm components)

**Phase 4 (User Story 5)** - 2 tasks can run in parallel:
- T039, T040 (verify_user_access function, add indexes)

**Phase 5 (User Story 2 Backend)** - 1 task can run in parallel:
- T043 (routes/tasks.py creation)

**Phase 5 (User Story 2 Frontend)** - 4 tasks can run in parallel:
- T049, T050, T051, T052, T053 (api functions, TaskList, TaskItem, Modal, TaskForm)

**Phase 6 (User Story 4 Frontend)** - 1 task can run in parallel:
- T058 (toggleTaskComplete function)

**Phase 7 (User Story 3 Backend)** - 2 tasks can run in parallel:
- T061, T062 (PUT and DELETE endpoints)

**Phase 7 (User Story 3 Frontend)** - 2 tasks can run in parallel:
- T065, T066 (updateTask, deleteTask functions, ConfirmDialog component)

**Phase 8 (Polish)** - 14 tasks can run in parallel:
- T071-T079 (all documentation, styling, and testing tasks)

---

## Parallel Example: User Story 2 (Create and View Tasks)

```bash
# Backend tasks in parallel (different files):
Task T043: "Create backend/routes/tasks.py with APIRouter"

# After backend tasks complete, frontend tasks in parallel (different files):
Task T049: "Create getTasks() and createTask() in frontend/lib/api.ts"
Task T050: "Create frontend/components/TaskList.tsx"
Task T051: "Create frontend/components/TaskItem.tsx"
Task T052: "Create frontend/components/Modal.tsx"
Task T053: "Create frontend/components/TaskForm.tsx"
```

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**Recommended MVP Scope**: User Stories 1, 5, and 2 only (Authentication + Data Isolation + Basic Task Management)

1. Complete Phase 1: Setup (9 tasks)
2. Complete Phase 2: Foundational (13 tasks) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 - Authentication (16 tasks)
4. Complete Phase 4: User Story 5 - Data Isolation (4 tasks)
5. Complete Phase 5: User Story 2 - Create and View Tasks (13 tasks)
6. **STOP and VALIDATE**: Test MVP independently (total: 55 tasks)
7. Deploy MVP to Vercel for demo

**MVP delivers**:
- User signup and login
- Protected routes and logout
- Multi-user data isolation (security)
- Create new tasks
- View task list with empty state
- Task statistics

### Incremental Delivery (Full Feature Set)

1. Complete Setup + Foundational (Phases 1-2) → Foundation ready (22 tasks)
2. Add User Story 1 + User Story 5 (Phases 3-4) → Authentication + Security ready (20 tasks)
3. Add User Story 2 (Phase 5) → MVP ready (13 tasks) → Deploy/Demo
4. Add User Story 4 (Phase 6) → Task completion toggle (5 tasks) → Deploy/Demo
5. Add User Story 3 (Phase 7) → Full CRUD (10 tasks) → Deploy/Demo
6. Add Polish (Phase 8) → Production ready (14 tasks) → Final Deploy/Demo

**Total Tasks**: 84 tasks across 8 phases

**Estimated Time** (per constitution 10-iteration strategy):
- Setup: ~3 hours (Phases 1-2)
- Backend: ~7 hours (Phases 3-5, backend portions of Phases 6-7)
- Frontend: ~8 hours (Phases 3-5, frontend portions of Phases 6-7)
- Deployment: ~2 hours (Phase 8)
- **Total**: 18-20 hours

### Parallel Team Strategy

With 3 developers working in parallel after Foundational phase:

**After Foundational (Phase 2) complete**:
- Developer A: Phase 3 (User Story 1 - Authentication) - 16 tasks
- Developer B: Phase 4 + Phase 5 backend (User Story 5 + User Story 2 backend) - 7 tasks
- Developer C: Phase 5 frontend (User Story 2 frontend) - 7 tasks

**After User Stories 1, 5, 2 complete**:
- Developer A: Phase 6 (User Story 4 - Toggle Complete) - 5 tasks
- Developer B: Phase 7 (User Story 3 - Edit/Delete) - 10 tasks
- Developer C: Phase 8 (Polish) - start on documentation and styling - 14 tasks

**Result**: Can complete all 84 tasks in ~12-15 hours with 3 parallel developers (vs 18-20 hours solo)

---

## Notes

- **[P] tasks** = Different files, no dependencies, can run in parallel
- **[Story] label** = Maps task to specific user story for traceability and independent testing
- **Each user story** should be independently completable and testable
- **Manual testing only** - No automated tests requested in specification
- **Commit frequency**: Commit after each task or logical group (e.g., after completing backend endpoints, after completing a component)
- **Checkpoint validation**: Stop at each user story checkpoint to test independently before proceeding
- **Backend first**: Within each user story, complete backend endpoints and test with cURL before starting frontend work
- **Claude Code**: 100% of code MUST be generated via Claude Code (per constitution) - use implementation prompts from quickstart.md

**Avoid**:
- Vague task descriptions (each task specifies exact file path and acceptance criteria)
- Same file conflicts (tasks marked [P] never modify the same file)
- Cross-story dependencies that break independence (each story builds on previous but is independently testable)
- Skipping foundational phase (Phase 2 MUST complete before any user story work)

---

## Task Completion Summary

**Total Tasks**: 84

**Task Distribution by Phase**:
- Phase 1 (Setup): 9 tasks
- Phase 2 (Foundational): 13 tasks (BLOCKING - must complete first)
- Phase 3 (User Story 1 - Authentication): 16 tasks
- Phase 4 (User Story 5 - Data Isolation): 4 tasks
- Phase 5 (User Story 2 - Create/View Tasks): 13 tasks
- Phase 6 (User Story 4 - Toggle Complete): 5 tasks
- Phase 7 (User Story 3 - Edit/Delete Tasks): 10 tasks
- Phase 8 (Polish & Deployment): 14 tasks

**Task Distribution by User Story**:
- User Story 1 (P1): 16 tasks (Authentication)
- User Story 5 (P1): 4 tasks (Data Isolation - security foundation)
- User Story 2 (P2): 13 tasks (Create and View Tasks)
- User Story 4 (P3): 5 tasks (Toggle Completion)
- User Story 3 (P3): 10 tasks (Edit and Delete)
- Setup/Foundational/Polish: 36 tasks

**Parallel Opportunities Identified**: 42 tasks marked [P] can run in parallel with other tasks

**Independent Test Criteria per Story**:
- User Story 1: New user can signup, login, see empty tasks page, logout
- User Story 5: Two users see only their own tasks, cross-user API access returns 403
- User Story 2: User can create task and see it in list immediately
- User Story 4: User can toggle task completion, see strikethrough, persists on refresh
- User Story 3: User can edit task and see updates, can delete task after confirmation

**Suggested MVP Scope**: Phases 1-5 (User Stories 1, 5, 2) = 55 tasks = Core authentication + basic task management

**Format Validation**: ✅ All 84 tasks follow checklist format with checkbox, sequential ID (T001-T084), [P] marker where applicable, [Story] label for user story tasks, and exact file paths in descriptions
