# 02 Implementation Plan & Project Roadmap

This document serves as the authoritative implementation roadmap for the **AI-Powered Quote Auto Scheduler** repository. It details completed phases, current sprint objectives, upcoming milestones, dependencies, phase completion criteria, and future enhancements.

---

## 1. Roadmap Summary

| Phase / Feature Module | Status | Core Deliverables |
| :--- | :---: | :--- |
| **Phase 1: Scaffolding & Setup** | ✅ Complete | Express server, Vite + React setup, Tailwind CSS, Axios, folder structure |
| **Phase 2: JWT Authentication** | ✅ Complete | User model, password hashing, JWT routes, `protect` middleware, AuthContext, password toggle |
| **Phase 3: AI Quote Generator** | ✅ Complete | 12 categories, structured JSON generation via Groq API (`llama-3.3-70b-versatile`) |
| **Phase 4: Quote Library & Smart Scheduler** | 🟡 Partial | CRUD endpoints, search/filter, edit modal, duplicate, manual scheduling complete; AI single & bulk scheduling use hardcoded slot rules |
| **Phase 5: Background Execution Daemon** | ✅ Complete | Node Cron background task running every minute updating status to `Posted` in DB |
| **Phase 6: Dashboard & Settings Polish** | ✅ Complete | Analytics merged into `Dashboard.jsx`, Settings redesigned into SaaS config view, global `LogoutModal.jsx` extracted |
| **Phase 7: Dynamic AI Scheduling** | ⏳ Pending | Parsing quote's AI-generated `suggestedPostingTime` for single & bulk scheduling |
| **Phase 8: Native Social OAuth & Publishing**| ⏳ Pending | Real OAuth 2.0 flows, access token storage, and live API publishing (LinkedIn, Meta APIs) |

---

## 2. Completed Milestones

### Phase 1: Project Initialization & Scaffolding
- [x] Configure backend directory structure (`config`, `controllers`, `routes`, `models`, `services`, `middleware`, `jobs`, `utils`).
- [x] Configure frontend directory structure with Vite, React Router, Tailwind CSS, and Axios.
- [x] Establish database connection module (`config/db.js`) with explicit database name logging and global Express error handling (`middleware/errorHandler.js`).

### Phase 2: JWT Authentication
- [x] Implement User Mongoose Schema (`models/User.js`) with bcrypt password hashing and `matchPassword` method.
- [x] Implement Auth Controller (`controllers/authController.js`) for `registerUser`, `loginUser`, and `getMe`.
- [x] Build JWT validation middleware (`middleware/authMiddleware.js`).
- [x] Implement frontend `AuthContext`, `ProtectedRoute`, `Login` (with password visibility toggle), and `Register` views.

### Phase 3: AI Quote Generator
- [x] Implement Quote Mongoose Schema (`models/Quote.js`) holding quote, author, category, caption, explanation, hashtags, emojis, image prompt, suggested time, and engagement tips.
- [x] Build AI generation service returning structured JSON across 12 categories.
- [x] Support Groq API endpoint (`https://api.groq.com/openai/v1`) with configurable `GROQ_MODEL` and `OPENAI_MODEL` environment variables.
- [x] Implement `generateQuote` controller and API route.
- [x] Build interactive `QuoteGenerator` page UI with copy utilities.

### Phase 4: Quote Library & Manual Scheduling
- [x] Implement Quote CRUD endpoints, regex search, category/status filters, edit, delete, and duplicate handlers.
- [x] Build `QuoteLibrary` view with Grid and Table view toggles.
- [x] Build `EditQuoteModal` and `ScheduleModal` components (manual datetime picking & platform multi-select).
- [x] Build `SmartScheduler` view with visual timeline and pending queue.

### Phase 5: Background Scheduler Daemon
- [x] Implement Node Cron background daemon (`jobs/cronJobs.js`) running every minute (`* * * * *`) to transition due `Scheduled` quotes to `Posted` in MongoDB.
- [x] Build `SocialAccount` model, controller, and `SocialAccounts` view (tracks `isConnected` DB flag).
- [x] Build `PostingHistory` audit log view.

### Phase 6: Dashboard Consolidation, Settings & UI Polish
- [x] **Dashboard & Analytics Consolidation**: Consolidated standalone `Analytics.jsx` page components (KPIs and Category Breakdown) directly into `Dashboard.jsx`. Removed obsolete `/analytics` route and file.
- [x] **Settings Redesign**: Redesigned `Settings.jsx` into a clean SaaS configuration page featuring Account Profile, embedded AI engine info (`Groq`), local preferences toggles, and compact System Health monitor bar.
- [x] **Global Logout Confirmation**: Extracted `LogoutModal.jsx` into a global reusable component and wired it across Settings and main layout sidebar.
- [x] **Login UX**: Added password visibility toggle (`Eye`/`EyeOff` icons) on `Login.jsx`.

---

## 3. Active Roadmap Priorities

The following features represent the active application development sequence:

1. **Priority 1: Dynamic AI Single Scheduling Slot Consumption**:
   - Update `ScheduleModal.jsx` to parse and apply the quote's stored `suggestedPostingTime` string rather than falling back to hardcoded `09:30 AM`.
2. **Priority 2: Dynamic AI Bulk Scheduling Slot Optimization**:
   - Update `SmartScheduler.jsx` (`handleBulkAutoSchedule`) to calculate schedule slots based on quote-specific AI recommendations rather than a static `const slots = [9, 14, 19]` array.
3. **Priority 3: Native Social Account OAuth 2.0 Authorization**:
   - Implement real OAuth authorization URL generation, redirect callbacks, and secure access token / refresh token storage in Mongoose `SocialAccount` documents for LinkedIn, Instagram, and Facebook.
4. **Priority 4: Live Social Platform Publishing APIs**:
   - Replace simulated cron publishing logs in `cronJobs.js` with live HTTP API client integrations (LinkedIn UGC Post API, Meta Graph API for Instagram/Facebook).

---

## 4. Dependencies & Environment Variables

1. **Environment Variables**:
   - `MONGODB_URI`: Valid MongoDB Atlas connection string.
   - `JWT_SECRET`: Secret key for JWT signing (`30d` expiration).
   - `GROQ_API_KEY`: API key for Groq LLM inference service.
   - `GROQ_MODEL`: Selected Groq model (e.g. `llama-3.3-70b-versatile`).
   - `OPENAI_API_KEY`: API key for OpenAI fallback service.
   - `OPENAI_MODEL`: Selected OpenAI model (e.g. `gpt-3.5-turbo`).
