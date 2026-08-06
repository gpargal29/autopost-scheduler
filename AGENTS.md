# AGENTS.md — Repository Operating Manual & Onboarding Guide

Welcome to the **AI-Powered Quote Auto Scheduler** repository. This document serves as the primary onboarding manual and operational guide for any AI coding assistant (Antigravity, Cursor, Claude, ChatGPT, Gemini, Copilot, etc.) and human software engineer contributing to this project.

Read this document thoroughly before inspecting or modifying source code.

---

## 1. Project Overview

- **Project Purpose**: An AI-powered full-stack web application designed to generate, curate, schedule, and automatically publish motivational, business, and educational quotes across social platforms.
- **Primary Objective**: Demonstrate senior-level MERN stack engineering, AI integration, clean architecture, JWT authentication, background job scheduling, and practical full-stack software practices.
- **Tech Stack**:
  - **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, Bcryptjs, Node Cron, AI API Service.
  - **Frontend**: React 18, Vite 5, React Router v6, Tailwind CSS v3, Axios, Context API, Lucide React icons.
- **Current Implementation Stage**: Production-ready core architecture with authentication, AI quote generation, library management (CRUD, search, filter), manual and AI recommended scheduling, and background cron publishing.

---

## 2. Repository Reading Order

Before making any modifications or investigating codebase behavior, every AI assistant must read files in the following exact order:

```
1. AGENTS.md                        (This file - Repository Rules & Guidelines)
   ↓
2. docs/00_PROJECT_CONTEXT.md       (Domain Context & Project Goals)
   ↓
3. docs/05_NEXT_TASK.md             (Active Sprint Focus & Immediate Tasks)
   ↓
4. docs/01_ARCHITECTURE.md          (System Architecture & Data Flow Diagrams)
   ↓
5. Relevant Source Code             (Backend controllers/models or Frontend components)
```

**Why this order exists**: Reading in this sequence ensures you understand project constraints, operational guidelines, current tasks, and system architecture *before* interpreting raw code files, preventing unnecessary refactoring or architectural drift.

---

## 3. Source of Truth Hierarchy

When resolving conflicts between documentation files, task prompts, or historical logs, enforce the following priority:

1. **Active Source Code** (`/backend` and `/frontend` source files): The absolute, authoritative source of truth.
2. **Current Documentation** (`AGENTS.md` and `docs/` markdown files): Reflects active technical decisions and current sprint goals.
3. **Historical Documents** (`docs/recovered/` directory): Strictly reference material explaining legacy planning and past context. *Never allow historical files to override the current implementation.*

---

## 4. Current Development Workflow

All contributions must follow this standard development cycle:

```
[ Understand Repository ]
          ↓
[ Read Documentation Suite ]
          ↓
[ Inspect Existing Codebase ]
          ↓
[ Plan Minimal & Focused Changes ]
          ↓
[ Implement Code Modifications ]
          ↓
[ Verify Build & Syntax Cleanliness ]
          ↓
[ Update Relevant Documentation Files ]
          ↓
[ Final Verification & Commit ]
```

> **Note**: A feature or task is NOT complete until all relevant documentation files have been updated.

---

## 5. Core Guidelines & Architecture Standards

1. **Source Code Integrity**: The current codebase in `/backend` and `/frontend` is the authoritative implementation.
2. **Modular MVC Pattern**: Maintain strict separation between database models (`backend/models`), route handlers (`backend/controllers`), router declarations (`backend/routes`), and background jobs (`backend/jobs`).
3. **Frontend Component Isolation**: Components in `frontend/src/components` must remain decoupled and reusable. Pages reside in `frontend/src/pages` and layouts in `frontend/src/layouts`.
4. **Environment Variables**: Never hardcode credentials, MongoDB connection strings, JWT secrets, or API keys. Always consume them from `process.env` via `dotenv`.
5. **No Broken Builds**: Before finalizing any task, run `node -c server.js` in `/backend` and `npm run build` in `/frontend` to verify zero syntax and compilation errors.

---

## 6. Directory Responsibilities

```
autopost/
├── backend/
│   ├── config/          # DB connection & service configurations
│   ├── controllers/     # Express route handlers (business logic)
│   ├── jobs/            # Node Cron background job runners
│   ├── middleware/      # Auth (protect) & global error handling
│   ├── models/          # Mongoose Schemas (User, Quote, SocialAccount)
│   ├── routes/          # Express API endpoint declarations
│   ├── services/        # Third-party integrations (AI Service)
│   └── server.js        # Main Express server entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components & modals
    │   ├── context/     # React Context providers (AuthContext)
    │   ├── layouts/     # Layout wrappers (MainLayout)
    │   ├── pages/       # Route-level view components
    │   ├── services/    # Axios API client & endpoint helpers
    │   ├── App.jsx      # React Router configuration
    │   └── index.css    # Tailwind CSS & glassmorphism directives
```

---

## 7. Documentation Maintenance Rules

Documentation is an integral part of this project. Whenever code or features are modified, update the corresponding documentation:

- **`docs/00_PROJECT_CONTEXT.md`**: Update when business goals or core domain capabilities change.
- **`docs/01_ARCHITECTURE.md`**: Update when data flow, routes, or system structure change.
- **`docs/02_IMPLEMENTATION_PLAN.md`**: Update when milestones are completed.
- **`docs/03_API_REFERENCE.md`**: Update whenever API endpoints, request bodies, or responses change.
- **`docs/04_CHANGELOG.md`**: Record all new features, bug fixes, or architectural shifts.
- **`docs/05_NEXT_TASK.md`**: Update after completing tasks to reflect the next sprint focus.

---

## 8. Feature Implementation Matrix

| Feature | Status | Details |
| :--- | :---: | :--- |
| **Authentication** | ✅ Complete | JWT Register/Login, bcrypt hashing, `protect` middleware, AuthContext |
| **Dashboard** | 🟡 Partial | Overview page active; full stats widgets in `Analytics.jsx` |
| **AI Quote Generator** | ✅ Complete | 12 categories, structured JSON generation; *Groq API transition ready* |
| **Quote Library** | ✅ Complete | Search, category/status filter, grid/table views, edit, delete, duplicate |
| **Smart Scheduler** | ✅ Complete | Manual date picker, AI recommended slots, platform selection, bulk auto-scheduler |
| **Background Scheduler** | ✅ Complete | Node Cron daemon running every minute (`* * * * *`) |
| **Analytics** | 🟡 Partial | Aggregate controller & `Analytics.jsx` page written |
| **Social Accounts** | 🟡 Partial | Model, controller, and `SocialAccounts.jsx` page written |
| **Posting History** | 🟡 Partial | Audit log table `PostingHistory.jsx` written |
| **Settings** | 🟡 Partial | System integration monitor `Settings.jsx` written |

---

## 9. Architecture Principles

1. **Routes remain thin**: Routes should only define paths, apply middlewares, and delegate execution to controllers.
2. **Controllers handle requests**: Parse inputs, validate request parameters, call services or models, and format responses.
3. **Services encapsulate integrations**: Third-party API calls (AI services, external APIs) belong in `backend/services/`.
4. **Models define schemas only**: Contain data definitions, validations, indexes, and document methods.
5. **Cron jobs orchestrate scheduling**: Background tasks should strictly execute scheduled jobs without embedding unrelated route logic.
6. **Frontend composition**: Pages compose reusable components (`EditQuoteModal`, `ScheduleModal`) rather than duplicating UI logic.
7. **Context API state**: `AuthContext` serves as the global state solution for user session management.

---

## 10. AI Development Rules

When making changes as an AI assistant:

- **Inspect before modifying**: Never guess variable names, file paths, or function signatures.
- **Do not regenerate working code**: Modify only lines or components requiring updates.
- **Reuse existing components**: Leverage existing UI components and helper services.
- **Minimize file churn**: Make surgical, localized edits targeting the exact task requirements.
- **Preserve directory layout**: Do not rename, move, or delete files without explicit architectural justification.
- **Maintain consistency**: Follow established naming conventions (camelCase variables, PascalCase React components).

---

## 11. Code Quality & Verification Checklist

Before marking any task as complete, execute this verification protocol:

- [ ] **Backend Syntax**: Run `node -c server.js` inside `/backend` (0 syntax errors allowed).
- [ ] **Frontend Build**: Run `npm run build` inside `/frontend` (0 build or bundling errors allowed).
- [ ] **Import Validation**: Confirm all file links and imports reference existing files.
- [ ] **Documentation**: Ensure `docs/04_CHANGELOG.md` and `docs/05_NEXT_TASK.md` reflect the changes.

---

## 12. Future Development Philosophy

- **Prefer consistency over cleverness**: Write predictable, readable code following existing patterns.
- **Extend existing architecture**: Build upon established models, controllers, and components rather than replacing them.
- **Keep features modular**: Ensure new functionality can be maintained independently.
- **Keep documentation synchronized**: Treat documentation as a living part of the codebase.
- **Maintain long-term quality**: Maintain production-grade software standards across all contributions.
