# 04 Changelog

All notable changes to the **AI-Powered Quote Auto Scheduler** repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to Semantic Versioning (`MAJOR.MINOR.PATCH`).

---

## [1.3.0] - 2026-08-10

- **Release Name**: Dynamic AI Scheduling, Unpersisted Quote Generator Workflow & Status-Aware Quote Library Actions
- **Release Type**: Minor Release
- **Release Status**: Stable

### Added
- **Unpersisted AI Quote Generator Workflow**: Refactored `QuoteGenerator.jsx` and `quoteController.js` so that AI generation returns unpersisted content in React state without auto-saving to MongoDB. Exposed 4 explicit user actions: **Save to Library**, **Schedule Post**, **Publish Now**, and **Generate Another**.
- **Quote Document Creation API**: Exposed `POST /api/quotes` controller (`createQuote`) to explicitly persist quotes with target statuses (`Pending`, `Scheduled`, `Posted`) attached to authenticated user sessions.
- **Shared Date Helper Utility**: Created `frontend/src/utils/dateHelpers.js` providing `extractTimeComponents()`, `parseSuggestedPostingTime()`, and `formatToDateTimeLocal()`.

### Changed / Refactored
- **Dynamic AI Single Scheduling**: Refactored `ScheduleModal.jsx` to dynamically extract and parse the quote's stored `suggestedPostingTime` (e.g. `"08:30 AM (Peak morning focus)"`) and apply it to tomorrow's date.
- **Dual Date & Time Picker UX**: Replaced single `<input type="datetime-local">` in `ScheduleModal.jsx` with responsive `<input type="date">` and `<input type="time">` pickers, adding native `showPicker()` refs and preserving AI recommendations when toggling manual mode.
- **Dynamic AI Bulk Scheduling**: Refactored `SmartScheduler.jsx` (`handleBulkAutoSchedule`) to calculate scheduled dates/times from each quote's individual AI recommendation string with 30-minute collision resolution up to 10:00 PM.
- **Status-Aware Quote Library Actions**: Refactored `QuoteLibrary.jsx` grid and table views:
  - `Pending` → displays **Schedule** button.
  - `Scheduled` → displays **Reschedule** button.
  - `Posted` → hides scheduling actions.
  - `Failed` → displays **Failed** status badge (`bg-rose-500/10`) and **Retry** action button opening `ScheduleModal`.
- **Server-Side Pagination**:
  - Created reusable `frontend/src/components/Pagination.jsx` component featuring range indicators (`Showing 1–15 of X`), current page tracking (`Page Y of Z`), and accessible `Previous` / `Next` controls.
  - Updated `backend/controllers/quoteController.js` (`getQuotes`) to support comma-separated status strings (e.g. `status=Posted,Failed`) via Mongoose `$in` array filtering.
  - Connected `QuoteLibrary.jsx` and `PostingHistory.jsx` to server-side pagination (`limit: 15`) with automatic page step-back handling on record deletion.
- **Dynamic Connected-Platform Selection**:
  - Created `frontend/src/services/socialService.js` helper module providing `getSocialAccounts()` and `getConnectedPlatforms()` to query `GET /api/social-accounts`.
  - Refactored `ScheduleModal.jsx` to dynamically initialize default selected target platforms based on the user's active connected social accounts (`LinkedIn`, `Instagram`, `Facebook`).
  - Added platform validation to `ScheduleModal.jsx`: disabled confirmation button and rendered alert banner (`"Connect at least one social account to schedule this post."`) if no platforms are selected or connected.
  - Refactored `SmartScheduler.jsx` (`handleBulkAutoSchedule`) to apply the user's active connected platforms to bulk-scheduled quotes dynamically instead of using hardcoded arrays.

---

## [1.2.0] - 2026-08-07

- **Release Name**: Dashboard Consolidation, SaaS Settings & UI Refinements
- **Release Type**: Minor Release
- **Release Status**: Stable

### Added
- **Global Logout Modal**: Extracted `frontend/src/components/LogoutModal.jsx` as a reusable component and wired it into `MainLayout.jsx` outlet context for unified logout behavior across Settings and sidebar.
- **Login Password Visibility Toggle**: Added interactive password show/hide button (`Eye` / `EyeOff` Lucide icons) to `frontend/src/pages/Login.jsx`.
- **Database Connection Logging**: Added explicit database name logging (`conn.connection.name`) to `backend/config/db.js`.

### Changed / Refactored
- **Dashboard & Analytics Consolidation**: Merged standalone `Analytics.jsx` components (KPI metrics and Category Distribution) directly into `frontend/src/pages/Dashboard.jsx`. Deleted `Analytics.jsx` file, removed `/analytics` route from `frontend/src/App.jsx`, and updated sidebar navigation.
- **Settings Page Redesign**: Refactored `frontend/src/pages/Settings.jsx` into a product-focused SaaS settings view featuring Account Profile, embedded read-only AI Engine metadata (`Groq` / `Llama 3`), local preferences toggles (Auto-Save, Notifications), and a streamlined System Health monitor bar.

### Clarified / Documented
- **Simulated Social Media Publishing**: Documented that social platform connection cards in `SocialAccounts.jsx` track an `isConnected` flag in MongoDB, and the background cron daemon updates MongoDB status to `Posted` without executing live external OAuth 2.0 or platform publishing APIs (LinkedIn, Instagram, Facebook).
- **Rule-Based Scheduling**: Documented that scheduling modals currently use hardcoded/rule-based slots (`09:30 AM` / `[9, 14, 19]`) rather than parsing the quote's AI-generated `suggestedPostingTime`.

---

## [1.1.0] - 2026-08-06

- **Release Name**: Groq API & Complete Route Integration
- **Release Type**: Minor Release
- **Release Status**: Stable

### Added
- **Groq API Support**: Configured `backend/services/openaiService.js` to support Groq API OpenAI-compatible endpoint (`https://api.groq.com/openai/v1`) using `process.env.GROQ_API_KEY`.
- **Configurable Model Environment Variables**: Added `GROQ_MODEL` (default: `llama-3.3-70b-versatile`) and `OPENAI_MODEL` (default: `gpt-3.5-turbo`) to `backend/.env` and `backend/.env.example`.
- **Frontend Route Alignment**: Wired `SocialAccounts`, `PostingHistory`, `Analytics`, and `Settings` page components in `frontend/src/App.jsx` across `/accounts`, `/history`, `/analytics`, `/settings`.
- **Settings UI Update**: Updated `frontend/src/pages/Settings.jsx` to reflect Groq / OpenAI AI Integration status.

### Security & Configuration
- Documented `GROQ_API_KEY`, `GROQ_MODEL`, and `OPENAI_MODEL` in `.env.example` and `.env`.

### Key Milestones Accomplished
- Groq API Integration Completed
- Configurable AI Model Variables Established
- Frontend Route Mapping Completed (100% Page Wiring)
- All Living Documentation Synchronized

---

## [1.0.0] - 2026-08-05

- **Release Name**: Initial Working Full-Stack Prototype
- **Release Type**: Major Release
- **Release Status**: Stable

### Added
- **MERN Architecture & Scaffolding**: Established modular Express backend structure (`config`, `controllers`, `routes`, `models`, `services`, `middleware`, `jobs`, `utils`) and React 18 + Vite 5 frontend directory layout.
- **JWT Authentication**: User Mongoose schema (`models/User.js`) with bcrypt password hashing (`pre('save')`), JWT issuance (`30d` expiration), `protect` validation middleware (`authMiddleware.js`), AuthContext state provider, ProtectedRoute component, and glassmorphism Login/Register pages.
- **AI Quote Generator**: Quote Mongoose schema (`models/Quote.js`) storing quote, author, category, caption, explanation, hashtags, emojis, image prompt, suggested time, and engagement tips. AI generation service returning structured JSON across 12 categories, quote controller, and interactive `QuoteGenerator` page preview.
- **Quote Library**: CRUD controller endpoints, regex search across quote/author/caption, category and status filtering, Grid and Table view toggles, `EditQuoteModal`, deletion, and quote duplication (`POST /api/quotes/:id/duplicate`).
- **Smart Scheduler**: `ScheduleModal` supporting manual datetime selection and AI-recommended slot calculation, target platform multi-selection (*LinkedIn, Instagram, Facebook*), and `SmartScheduler` view with AI bulk auto-scheduler algorithm.
- **Background Scheduler Daemon**: Node Cron job runner (`jobs/cronJobs.js`) executing every minute (`* * * * *`) to query due `Scheduled` quotes and update status to `Posted`.
- **Social Accounts & Audit**: `SocialAccount` model, controller, `SocialAccounts` view, and `PostingHistory` execution table.
- **Analytics & Settings**: Aggregate statistics controller (`analyticsController.js`), `Analytics` dashboard visualizations, and `Settings` integration monitoring view.

### Documentation
- Created `AGENTS.md` operating manual and onboarding guide.
- Created `docs/00_PROJECT_CONTEXT.md` living repository memory file.
- Created `docs/01_ARCHITECTURE.md` system architecture & data flow specification.
- Created `docs/02_IMPLEMENTATION_PLAN.md` roadmap and milestone tracker.
- Created `docs/03_API_REFERENCE.md` backend REST API documentation.
- Created `docs/04_CHANGELOG.md` version history.
- Created `docs/05_NEXT_TASK.md` active sprint focus guide.
- Created `docs/06_DECISIONS.md` Architectural Decision Records (ADRs).
- Created `docs/07_SETUP.md` environment setup and installation manual.

### Release Summary
This release establishes the first fully functional demonstration version of the application, including full-stack JWT authentication, AI quote generation, quote library management, smart scheduling workflows, a background Node Cron worker, and a living documentation system.
