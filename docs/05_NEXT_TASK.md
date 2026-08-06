# 05 Next Task & Sprint Handover Guide

This document serves as the primary sprint planning and handover guide for the **AI-Powered Quote Auto Scheduler** repository. Any future AI assistant or software engineer resuming work on this codebase should start here to understand active sprint priorities, files affected, dependencies, and completion criteria.

---

## 1. Sprint Overview

- **Sprint Name**: Sprint 1 — Groq API Migration & Route Alignment
- **Sprint Goal**: Transition the backend AI generator service to the Groq API and wire all secondary page components in `frontend/src/App.jsx`.
- **Current Status**: Active / In Progress
- **Priority**: High (Final functional integration milestone)
- **Estimated Scope**: Focused, surgical updates across 2–4 backend and frontend files.

---

## 2. Current Repository Snapshot

| Component / Module | Status | Snapshot Note |
| :--- | :---: | :--- |
| **Authentication** | ✅ Stable | User registration, login, JWT validation, `protect` middleware, AuthContext |
| **AI Quote Generator** | 🟡 In Progress | Functional UI & schemas; *service migration from OpenAI to Groq API pending* |
| **Quote Library** | ✅ Stable | CRUD, regex search, category/status filters, edit modal, duplicate |
| **Smart Scheduler** | ✅ Stable | Manual date picker, AI recommended slots, platform select, bulk auto-scheduler |
| **Background Scheduler**| ✅ Stable | Node Cron daemon running every minute updating `Scheduled` to `Posted` |
| **Analytics** | 🟡 In Progress | Page component written; *routing connection in App.jsx pending* |
| **Social Accounts** | 🟡 In Progress | Page component written; *routing connection in App.jsx pending* |
| **Posting History** | 🟡 In Progress | Audit table component written; *routing connection in App.jsx pending* |
| **Settings** | 🟡 In Progress | Page component written; *routing connection in App.jsx pending* |
| **Documentation** | ✅ Stable | Full suite (`AGENTS.md` and `docs/00` through `07`) established |

---

## 3. Active Task Objective

Transition the AI Quote Generator service to use the **Groq API** and complete frontend route alignment in `frontend/src/App.jsx`.

---

## 4. Action Plan

1. **Groq API Service Integration**:
   - Update `backend/services/openaiService.js` (or introduce `groqService.js`) to call Groq API endpoints using `groq-sdk` or an OpenAI-compatible base URL (`https://api.groq.com/openai/v1`) with `process.env.GROQ_API_KEY`.
   - Utilize high-performance open models such as `llama-3.3-70b-versatile` or `mixtral-8x7b-32768`.

2. **Frontend Route Wiring**:
   - Update lines 29–32 of `frontend/src/App.jsx` to map `/accounts`, `/history`, `/analytics`, and `/settings` to their built page components (`SocialAccounts`, `PostingHistory`, `Analytics`, `Settings`).

3. **End-to-End Verification**:
   - Verify backend compilation, frontend production build, and runtime generation behavior.

---

## 5. Files Expected to Change

- `backend/services/openaiService.js` (or `backend/services/groqService.js` if introduced)
- `backend/controllers/quoteController.js` (only if service invocation signature changes)
- `frontend/src/App.jsx` (mapping routes `/accounts`, `/history`, `/analytics`, `/settings`)
- `backend/package.json` (if adding `groq-sdk` dependency)
- `backend/.env.example` and `backend/.env` (adding `GROQ_API_KEY`)

---

## 6. Files Not Expected to Change

The following stable codebase areas should remain untouched during this sprint:

- **Authentication**: `backend/controllers/authController.js`, `backend/middleware/authMiddleware.js`, `frontend/src/context/AuthContext.jsx`.
- **Database Models**: `backend/models/User.js`, `backend/models/Quote.js`, `backend/models/SocialAccount.js`.
- **Quote Library UI & Modals**: `frontend/src/components/EditQuoteModal.jsx`, `frontend/src/components/ScheduleModal.jsx`, `frontend/src/pages/QuoteLibrary.jsx`.
- **Background Cron Daemon**: `backend/jobs/cronJobs.js`.
- **Documentation Structure**: Core markdown file organization inside `/docs`.

---

## 7. Dependencies

- **`GROQ_API_KEY`**: Active API key from Groq Console added to `backend/.env`.
- **MongoDB Atlas**: Active connection string in `backend/.env`.
- **`JWT_SECRET`**: Secret key configured in `backend/.env`.
- **npm Packages**: `groq-sdk` (or existing `openai` client using Groq baseURL).

---

## 8. Current Blockers

**No known blockers.** All required page components, controllers, and database schemas are already implemented and operational in the repository.

---

## 9. Definition of Done

This sprint is considered complete when:

1. [ ] **Groq API Integration**: Groq API successfully generates structured quotes and social metadata across all 12 categories.
2. [ ] **Route Alignment**: All sidebar links (`/accounts`, `/history`, `/analytics`, `/settings`) correctly render their dedicated page components.
3. [ ] **Backend Compilation**: `node -c server.js` runs cleanly with 0 syntax or execution errors.
4. [ ] **Frontend Build**: `npm run build` compiles all React/Vite modules with 0 errors.
5. [ ] **Manual Verification**: End-to-end user workflow succeeds (Registration -> Login -> AI Generation -> Library -> Scheduling -> Cron Execution -> Analytics View).
6. [ ] **Documentation Sync**: `docs/04_CHANGELOG.md`, `docs/02_IMPLEMENTATION_PLAN.md`, and `docs/00_PROJECT_CONTEXT.md` are updated.

---

## 10. Verification Checklist

### Backend Verification
```bash
cd backend
node -c server.js
```
*Expected result: Clean execution with zero syntax or import errors.*

### Frontend Verification
```bash
cd frontend
npm run build
```
*Expected result: Vite build completes cleanly (1550+ modules transformed).*

### Manual Runtime Verification Protocol
1. **Auth**: Register a new account and verify redirect to Dashboard.
2. **AI Quote Generator**: Select category, generate quote via Groq API, and verify complete metadata card output.
3. **Library**: Confirm quote appears in Quote Library; test search query, category filter, edit, and duplicate.
4. **Smart Scheduler**: Schedule a quote using AI recommended slot or manual date picker.
5. **Background Cron**: Confirm console log output when cron daemon processes due posts every minute (`* * * * *`).
6. **Secondary Views**: Navigate to Social Accounts, Posting History, Analytics, and Settings pages to confirm proper layout rendering.

---

## 11. Documentation Update Checklist

Upon completing this sprint, update the following documents:

- [ ] `docs/00_PROJECT_CONTEXT.md`: Update feature status matrix and current status summary.
- [ ] `docs/02_IMPLEMENTATION_PLAN.md`: Mark Sprint 1 milestones as complete and update Roadmap Summary.
- [ ] `docs/03_API_REFERENCE.md`: Update AI service notes if request signatures changed.
- [ ] `docs/04_CHANGELOG.md`: Move Sprint 1 tasks from `[Unreleased]` into a versioned release block (`[1.1.0]`).
- [ ] `docs/05_NEXT_TASK.md`: Update this file to define the next sprint focus.

---

## 12. Next Sprint Preview

Following completion of Sprint 1, the logical next steps are:

### Final Assignment Polish (Primary Project Scope)
- Final end-to-end sanity testing across all views.
- Repository documentation audit to ensure 100% synchronization.
- Preparation of deployment guidelines.

### Future Production Enhancements (Outside Assignment Scope)
- Native OAuth 2.0 integration with LinkedIn, Instagram, and Facebook APIs.
- Automated testing setup (Jest/Supertest for backend, React Testing Library for frontend).
- Docker containerization (`Dockerfile`, `docker-compose.yml`).
