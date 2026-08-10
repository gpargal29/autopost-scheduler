# 04 Changelog

All notable changes to the **AI-Powered Quote Auto Scheduler** repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to Semantic Versioning (`MAJOR.MINOR.PATCH`).

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
