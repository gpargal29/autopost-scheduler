# 00 Project Context — Living Repository Memory

## Executive Summary

The **AI-Powered Quote Auto Scheduler** repository contains a full-stack web application built using the MERN stack (MongoDB Atlas, Express.js, React + Vite, Node.js). The project demonstrates full-stack software architecture, AI content generation, JWT-based authentication, database persistence, and background job scheduling with Node Cron.

The repository currently implements a functional application where authenticated users can generate structured quotes and social media metadata across 12 categories using AI, manage quotes in a repository library with search and filtering, schedule content using manual or AI-recommended time slots, and rely on an automated background daemon to process scheduled posts.

---

## Business & Technical Goals

- **Automated Social Content Creation**: Reduce content creation friction by leveraging AI services to generate complete social media packages (Quote, Author, Caption, Explanation, Hashtags, Emoji Suggestions, Image Prompt, Engagement Tips).
- **Smart Scheduling**: Provide flexible post scheduling options, including manual datetime picking and AI-recommended peak engagement slot calculation.
- **Background Execution**: Ensure reliable post execution via Node Cron without requiring active client-side sessions.
- **Clean Full-Stack Architecture**: Maintain clear separation of concerns across database models, controllers, API routes, services, views, and React Context state providers.

---

## Core Domain Models & Features

1. **Authentication System**: Secure JWT-based registration and login with bcrypt password hashing and protected API routes.
2. **AI Quote Generator**: Interactive content generation engine supporting 12 curated categories (*Motivation, Success, Leadership, Business, Productivity, Fitness, Self Improvement, Positivity, Entrepreneurship, Mindfulness, Happiness, Wisdom*).
3. **Quote Library**: Content repository supporting regex search, category/status filtering, grid/table view toggles, edit modals, deletion, and duplication.
4. **Smart Scheduler**: Scheduling workflow featuring manual time selection, AI-recommended time calculation, platform multi-selection (*LinkedIn, Instagram, Facebook*), and bulk auto-scheduling.
5. **Background Publisher**: Node Cron background service running every minute to process due posts.
6. **Social Accounts Management**: Platform connection state tracking.
7. **Posting Audit History**: Detailed execution log for published and failed posts.
8. **Dashboard & Analytics**: System health, aggregate statistics, and category distribution metrics.

---

## 1. Current Project Status

- **Repository Maturity**: Functional demonstration codebase with core workflows implemented.
- **Development Stage**: Advanced initial implementation phase (Core engines complete; secondary page routing and AI provider migration pending).
- **Major Completed Milestones**:
  - Full-stack JWT authentication flow (backend controllers, middleware, frontend context, protected routes).
  - AI quote generation engine producing structured social media metadata.
  - Quote Library CRUD, search query filtering, edit modal, and duplication.
  - Smart Scheduler featuring manual time picking, AI slot recommendation, and bulk auto-scheduling.
  - Node Cron background publishing task running every minute.
- **Remaining Implementation Work**:
  - Transitioning the AI generator service from OpenAI API to Groq API (`groq-sdk` or OpenAI-compatible Groq API endpoint).
  - Updating `frontend/src/App.jsx` route mappings to connect secondary page components (`SocialAccounts`, `PostingHistory`, `Analytics`, `Settings`).

---

## 2. Current Feature Status

| Feature | Status | Implementation Details |
| :--- | :---: | :--- |
| **Authentication** | ✅ Complete | Full registration, login, JWT validation, `protect` middleware, and AuthContext provider. |
| **Dashboard** | 🟡 Partially Complete | Overview page active; full analytics widgets exist in `Analytics.jsx`. |
| **AI Quote Generator** | ✅ Complete | Generates 12 categories with structured metadata; *Groq API provider transition pending*. |
| **Quote Library** | ✅ Complete | Full CRUD, regex search, category/status filters, grid/table toggles, edit, delete, duplicate. |
| **Smart Scheduler** | ✅ Complete | Manual scheduling, AI recommended slots, platform multi-select, AI bulk auto-scheduler. |
| **Background Scheduler** | ✅ Complete | Node Cron job running every minute (`* * * * *`) updating `Scheduled` quotes to `Posted`. |
| **Analytics** | 🟡 Partially Complete | Aggregate controller & `Analytics.jsx` page written; route unlinked in `App.jsx`. |
| **Social Accounts** | 🟡 Partially Complete | Model, controller, & `SocialAccounts.jsx` page written; route unlinked in `App.jsx`. |
| **Posting History** | 🟡 Partially Complete | Audit table `PostingHistory.jsx` written; route unlinked in `App.jsx`. |
| **Settings** | 🟡 Partially Complete | System integration monitor `Settings.jsx` written; route unlinked in `App.jsx`. |

---

## 3. Current Repository Structure

- **Backend (`/backend`)**: Express v4 application managing Mongoose models (`User`, `Quote`, `SocialAccount`), authentication logic, REST controllers, background cron jobs (`jobs/cronJobs.js`), and AI service wrappers (`services/openaiService.js`).
- **Frontend (`/frontend`)**: React 18 single-page application built with Vite 5, Tailwind CSS, React Router v6, Axios HTTP client (`services/api.js`), and React Context (`AuthContext.jsx`).
- **Documentation (`/docs`)**: Structured technical documentation detailing project context, system architecture, API specifications, changelog, and current sprint focus.
- **Historical Documents (`/docs/recovered`)**: Contains original prompt, implementation plans, and walkthroughs retained strictly for historical context.

---

## 4. Current Repository Health

- **Backend Build Status**: Clean. `node -c server.js` compiles without syntax or execution errors.
- **Frontend Build Status**: Clean. `npm run build` compiles 1550+ modules cleanly with zero errors.
- **Architecture Stability**: High. Follows clean MVC backend pattern and component-driven React architecture.
- **Documentation Status**: Fully documented and synchronized with codebase implementation.
- **Code Organization**: Modular separation of concerns across backend routes, controllers, services, models, and frontend pages, components, and services.
- **Technical Debt**: Low. Limited to minor route mapping alignment in `App.jsx` and AI provider replacement.

---

## 5. Known Limitations

- **Mock Social Publishing**: The background cron scheduler updates database statuses from `Scheduled` to `Posted` but logs social network API posting calls rather than calling third-party social APIs directly.
- **Unlinked Secondary Routes**: `frontend/src/App.jsx` currently maps routes `/accounts`, `/history`, `/analytics`, and `/settings` to `<Dashboard />` instead of their built page components.
- **AI Service Provider Migration**: The AI service currently uses the `openai` client package and requires updating to Groq API.
- **Automated Testing**: Unit and integration test suites are not currently configured in the repository.

---

## 6. Active Development Focus

1. **Groq API Migration**: Update `backend/services/openaiService.js` (or replace with `groqService.js`) to use Groq API with `process.env.GROQ_API_KEY`.
2. **Route Alignment**: Update `frontend/src/App.jsx` to map secondary page paths (`accounts`, `history`, `analytics`, `settings`) to their dedicated page components.
3. **End-to-End System Verification**: Execute integration verification across authentication, Groq quote generation, library filtering, scheduling, and background job execution.

---

## 7. Repository Goals

- **Maintainability**: Ensure code is structured predictably so developers and AI agents can extend features without breaking existing workflows.
- **Readability & Modularity**: Keep functions, controllers, components, and services small, focused, and well-named.
- **Practical MERN Architecture**: Demonstrate real-world software engineering practices using standard MERN patterns.
- **Living Documentation**: Maintain accurate markdown documentation alongside code updates.

---

## 8. Documentation Navigation

Future AI assistants and developers should navigate documentation in this order:

```
AGENTS.md                         (Repository rules, operating manual, and checklist)
  ↓
docs/00_PROJECT_CONTEXT.md        (Living project context, feature matrix, current status)
  ↓
docs/01_ARCHITECTURE.md           (System data flow, backend/frontend diagrams)
  ↓
docs/05_NEXT_TASK.md              (Current sprint priorities and action steps)
```

**Why this order exists**: This sequence establishes repository operating rules first, followed by functional context, architectural layout, and active tasks before inspecting or modifying source code.

---

## 9. Definition of Current State

- **Fully Functional**:
  - JWT User Registration, Login, and Protected Routes.
  - AI Quote & Metadata Generation across 12 categories.
  - Quote Library CRUD, Regex Search, Category/Status Filtering, Edit Modal, and Duplication.
  - Smart Scheduler (Manual datetime picking, AI recommended slots, platform selection, AI bulk auto-scheduler).
  - Background Node Cron publishing daemon.
- **Partially Implemented**:
  - Social Accounts, Posting History, Analytics, and Settings pages are fully built in `src/pages/` but require route mapping in `App.jsx`.
- **Remaining Task to Reach 100% Completion**:
  - Complete Groq API integration for quote generation and wire secondary routes in `App.jsx`.
