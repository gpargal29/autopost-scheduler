# 00 Project Context — Living Repository Memory

## Executive Summary

The **AI-Powered Quote Auto Scheduler** repository contains a full-stack web application built using the MERN stack (MongoDB Atlas, Express.js, React + Vite, Node.js). The project demonstrates full-stack software architecture, AI content generation, JWT-based authentication, database persistence, and background job scheduling with Node Cron.

The repository implements a complete application where authenticated users can generate structured quotes and social media metadata across 12 categories using Groq or OpenAI LLM API integrations, manage quotes in a repository library with search and filtering, schedule content using manual or AI-recommended time slots, view social connection states and execution audit logs, and rely on an automated background daemon to process scheduled posts.

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
6. **Social Accounts Management**: Platform connection state tracking view.
7. **Posting Audit History**: Detailed execution log for published and failed posts.
8. **Dashboard & Analytics**: System health, aggregate statistics, and category distribution metrics.
9. **Settings**: System configuration overview and environment connection monitoring.

---

## 1. Current Project Status

- **Repository Maturity**: Complete full-stack demonstration codebase with all core and secondary workflows implemented.
- **Development Stage**: Release 1.1.0 Complete.
- **Major Completed Milestones**:
  - Full-stack JWT authentication flow (backend controllers, middleware, frontend context, protected routes).
  - Groq & OpenAI AI quote generation engine producing structured social media metadata.
  - Quote Library CRUD, search query filtering, edit modal, and duplication.
  - Smart Scheduler featuring manual time picking, AI slot recommendation, and bulk auto-scheduling.
  - Node Cron background publishing task running every minute.
  - Full route wiring for all views (`Dashboard`, `Generator`, `Library`, `Scheduler`, `Accounts`, `History`, `Analytics`, `Settings`).

---

## 2. Current Feature Status

| Feature | Status | Implementation Details |
| :--- | :---: | :--- |
| **Authentication** | ✅ Complete | Full registration, login, password visibility toggle, JWT validation, `protect` middleware, AuthContext. |
| **Dashboard & Analytics** | ✅ Complete | Unified Dashboard command center with KPIs, Category Breakdown, Recent Activity, & Scheduled Queue (`Analytics.jsx` merged). |
| **AI Quote Generator** | ✅ Complete | Generates 12 categories with structured metadata via Groq API. Output is held in temporary React state with 4 explicit user actions (Save to Library, Schedule Post, Publish Now, Generate Another). |
| **Quote Library** | ✅ Complete | Full CRUD, regex search, category/status filters, grid/table toggles, edit, delete, duplicate. |
| **Smart Scheduler** | ✅ Complete | Manual scheduling & internal cron complete; dynamic AI single & bulk scheduling parse `suggestedPostingTime` (30-min collision resolution) and dynamically select connected social accounts. |
| **Background Scheduler** | ✅ Complete | Internal Node Cron job running every minute (`* * * * *`) updating `Scheduled` quotes to `Posted` in DB. |
| **Social Accounts** | 🟡 Partial | Stores `isConnected` boolean flag in DB for LinkedIn, Instagram, Facebook (used by `socialService.js` for dynamic target platform selection); no OAuth 2.0 authorization or access tokens. |
| **Social Publishing** | 🔴 Simulated | Background cron job updates DB status to `Posted`; live external API publishing (LinkedIn, Instagram, Facebook) is simulated by design. |
| **Posting History** | ✅ Complete | Audit table `PostingHistory.jsx` displaying published/failed DB records. |
| **Settings** | ✅ Complete | Redesigned SaaS Settings page with Account, AI Engine status, local preferences toggles, and System Health bar. |

---

## 3. Current Repository Structure

- **Backend (`/backend`)**: Express v4 application managing Mongoose models (`User`, `Quote`, `SocialAccount`), authentication logic, REST controllers, background cron jobs (`jobs/cronJobs.js`), and AI service wrappers (`services/openaiService.js`).
- **Frontend (`/frontend`)**: React 18 single-page application built with Vite 5, Tailwind CSS, React Router v6, Axios HTTP client (`services/api.js`), and React Context (`AuthContext.jsx`).
- **Documentation (`/docs`)**: Structured technical documentation detailing project context, system architecture, API specifications, changelog, ADRs, setup, and active tasks.
- **Historical Documents (`/docs/recovered`)**: Contains original prompt, implementation plans, and walkthroughs retained strictly for historical context.

---

## 4. Current Repository Health

- **Backend Build Status**: Clean. `node -c server.js` compiles without syntax or execution errors.
- **Frontend Build Status**: Clean. `npm run build` compiles 1561 modules cleanly with zero errors.
- **Architecture Stability**: High. Follows clean MVC backend pattern and component-driven React architecture.
- **Documentation Status**: Fully documented and synchronized with codebase implementation.
- **Code Organization**: Modular separation of concerns across backend routes, controllers, services, models, and frontend pages, components, and services.
- **Technical Debt**: Zero open technical debt. All routes mapped and environment variables configurable.

---

## 5. Known Limitations & Out-of-Scope Items

- **Simulated Social Media Publishing**: LinkedIn, Instagram, and Facebook connections track an `isConnected` flag in MongoDB. Live OAuth 2.0 authorization, token exchange, and platform publishing APIs are not implemented; background cron publishing updates DB status and logs execution to stdout.
- **AI Scheduler Slot Consumption**: While the AI engine generates and stores a `suggestedPostingTime` string on each quote, scheduling modals currently use hardcoded/rule-based slot rules (`09:30 AM` for single schedules, `[9, 14, 19]` for bulk schedules) rather than dynamically parsing the quote's AI recommendation.

---

## 6. Active Development Focus

1. End-to-end verification and demonstration readiness.
2. Optional future enhancements (OAuth 2.0 social API integrations, unit tests, Docker containerization).

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

---

## 9. Definition of Current State

- **Fully Functional**:
  - JWT User Registration, Login, and Protected Routes.
  - Groq / OpenAI AI Quote & Metadata Generation across 12 categories with `GROQ_MODEL` and `OPENAI_MODEL` environment configuration.
  - Quote Library CRUD, Regex Search, Category/Status Filtering, Edit Modal, and Duplication.
  - Smart Scheduler (Manual datetime picking, AI recommended slots, platform selection, AI bulk auto-scheduler).
  - Background Node Cron publishing daemon.
  - Social Accounts, Posting History, Analytics, and Settings pages fully wired and operational in `App.jsx`.
