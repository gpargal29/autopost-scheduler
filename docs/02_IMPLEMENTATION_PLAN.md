# 02 Implementation Plan & Project Roadmap

This document serves as the authoritative implementation roadmap for the **AI-Powered Quote Auto Scheduler** repository. It details completed phases, current sprint objectives, upcoming milestones, dependencies, phase completion criteria, and future enhancements.

---

## 1. Roadmap Summary

| Phase / Feature Module | Status | Core Deliverables |
| :--- | :---: | :--- |
| **Phase 1: Scaffolding & Setup** | ✅ Complete | Express server, Vite + React setup, Tailwind CSS, Axios, folder structure |
| **Phase 2: JWT Authentication** | ✅ Complete | User model, password hashing, JWT routes, `protect` middleware, AuthContext |
| **Phase 3: AI Quote Generator** | 🟡 In Progress | 12 categories, structured JSON generation; *Groq API provider transition pending* |
| **Phase 4: Quote Library & Smart Scheduler** | ✅ Complete | CRUD endpoints, search/filter, edit modal, duplicate, manual & AI scheduling |
| **Phase 5: Background Execution Daemon** | ✅ Complete | Node Cron background task running every minute updating status to `Posted` |
| **Phase 6: Route Integration & Polishing** | 🟡 In Progress | Secondary pages built (`Analytics`, `SocialAccounts`, `History`, `Settings`); *App.jsx routing pending* |

---

## 2. Current Sprint

### Sprint Objective
Complete the AI service provider migration to **Groq API** and wire secondary page routes in `frontend/src/App.jsx`.

### Deliverables
1. **Groq API Migration**: Update backend service (`backend/services/openaiService.js` or introduce `groqService.js`) to consume Groq API via `groq-sdk` or an OpenAI-compatible endpoint using `process.env.GROQ_API_KEY`.
2. **Route Alignment**: Update `frontend/src/App.jsx` to map `/accounts`, `/history`, `/analytics`, and `/settings` to their built page components (`SocialAccounts`, `PostingHistory`, `Analytics`, `Settings`).
3. **End-to-End Verification**: Verify full system flow from user registration to AI quote generation, library filtering, scheduling, and background cron execution.

### Current Blockers
- None. Required page components and backend controllers are already implemented in the codebase.

### Success Criteria
- `node -c server.js` completes with 0 errors.
- `npm run build` compiles frontend modules with 0 errors.
- Quote generation successfully returns structured JSON using Groq API.
- All sidebar navigation routes render their dedicated page components.

---

## 3. Completed Milestones

### Phase 1: Project Initialization & Scaffolding
- [x] Configure backend directory structure (`config`, `controllers`, `routes`, `models`, `services`, `middleware`, `jobs`, `utils`).
- [x] Configure frontend directory structure with Vite, React Router, Tailwind CSS, and Axios.
- [x] Establish database connection module (`config/db.js`) and global Express error handling (`middleware/errorHandler.js`).

### Phase 2: JWT Authentication
- [x] Implement User Mongoose Schema (`models/User.js`) with bcrypt password hashing and `matchPassword` method.
- [x] Implement Auth Controller (`controllers/authController.js`) for `registerUser`, `loginUser`, and `getMe`.
- [x] Build JWT validation middleware (`middleware/authMiddleware.js`).
- [x] Implement frontend `AuthContext`, `ProtectedRoute`, `Login`, and `Register` views.

### Phase 3: AI Quote Generator
- [x] Implement Quote Mongoose Schema (`models/Quote.js`) holding quote, author, category, caption, explanation, hashtags, emojis, image prompt, suggested time, and engagement tips.
- [x] Build AI generation service returning structured JSON across 12 categories.
- [x] Implement `generateQuote` controller and API route.
- [x] Build interactive `QuoteGenerator` page UI with copy utilities.

### Phase 4: Quote Library & Smart Scheduler
- [x] Implement Quote CRUD endpoints, regex search, category/status filters, edit, delete, and duplicate handlers.
- [x] Build `QuoteLibrary` view with Grid and Table view toggles.
- [x] Build `EditQuoteModal` and `ScheduleModal` components (manual datetime picking + AI recommended slot calculation).
- [x] Build `SmartScheduler` view with visual timeline, pending queue, and AI bulk auto-scheduler algorithm.

### Phase 5: Background Scheduler & Social Integrations
- [x] Implement Node Cron background daemon (`jobs/cronJobs.js`) running every minute to transition due scheduled quotes to `Posted`.
- [x] Build Social Accounts model, controller, and `SocialAccounts` view.
- [x] Build `PostingHistory` audit log view.
- [x] Build `Analytics` dashboard stats and category breakdown metrics.
- [x] Build `Settings` system integration status page.

---

## 4. Active & Upcoming Sprint Milestones

### Sprint 1: Groq API Integration & Route Alignment
- [ ] **Groq API Migration**: Transition AI generator service from OpenAI API to Groq API using `groq-sdk` or OpenAI-compatible Groq API endpoint.
- [ ] **Frontend Route Alignment**: Wire secondary page components (`SocialAccounts`, `PostingHistory`, `Analytics`, `Settings`) into `frontend/src/App.jsx`.
- [ ] **Verification**: Execute end-to-end testing across registration, Groq generation, library operations, scheduling, and background cron execution.

---

## 5. Dependencies

1. **Environment Variables**:
   - `MONGODB_URI`: Valid MongoDB Atlas connection string.
   - `JWT_SECRET`: Secret key for JWT signing.
   - `GROQ_API_KEY`: API key for Groq LLM inference service.
2. **Groq SDK / API Availability**: Access to Groq API endpoints and supported models (e.g. `llama-3.3-70b-versatile` or `mixtral-8x7b-32768`).
3. **Route Integration**: Connecting existing page components (`SocialAccounts`, `PostingHistory`, `Analytics`, `Settings`) in `frontend/src/App.jsx`.
4. **End-to-End System Verification**: Validating API connectivity, schema validation, build output, and background cron processing.

---

## 6. Phase Completion Criteria

A roadmap phase is considered complete only when all the following criteria are met:

1. **Backend Implementation**: All required Mongoose models, controllers, routes, and services are fully implemented and error-handled.
2. **Frontend Integration**: All UI components, page views, and API service calls are connected to backend endpoints.
3. **Zero Build & Syntax Errors**: Backend syntax passes `node -c server.js` and frontend compiles cleanly with `npm run build`.
4. **Documentation Synchronization**: `docs/04_CHANGELOG.md`, `docs/05_NEXT_TASK.md`, and `docs/00_PROJECT_CONTEXT.md` are updated to reflect the changes.
5. **Manual Verification**: End-to-end workflow verification confirms expected runtime behavior.

---

## 7. Future Enhancements (Beyond Assignment Scope)

The following items are outside the initial technical assignment scope but represent logical extensions for future production readiness:

- **Native Social Media OAuth & Posting**: Direct OAuth 2.0 integration with LinkedIn API, Instagram Graph API, and Facebook Graph API to publish actual live social posts.
- **Image Generation & Uploads**: Integration with visual AI services (DALL-E 3, Midjourney API, Cloudinary) to automatically generate image assets alongside quote prompts.
- **Automated Testing Suite**: Unit testing with Jest/Supertest for backend endpoints and component testing with React Testing Library / Vitest.
- **Containerization & CI/CD**: Docker containerization (`Dockerfile`, `docker-compose.yml`) and GitHub Actions deployment pipelines.
- **User Profile Management**: Password reset workflows, profile image uploads, and account deletion options.

---

## 8. Roadmap Maintenance Guide

To ensure this roadmap remains accurate over time, follow these rules:

1. **When a Milestone is Completed**:
   - Mark the relevant checklist item with `[x]`.
   - Update the **Roadmap Summary** status indicators.
   - Move completed sprint goals into **Completed Milestones**.
2. **Synchronize Related Documents**:
   - Update `docs/05_NEXT_TASK.md` to reflect the new active sprint.
   - Add a changelog entry to `docs/04_CHANGELOG.md`.
   - Update `docs/00_PROJECT_CONTEXT.md` feature status matrix.
