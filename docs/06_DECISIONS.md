# 06 Architectural Decision Records (ADR Log)

This document serves as the official Architectural Decision Record (ADR) log for the **AI-Powered Quote Auto Scheduler** repository. It captures significant architectural choices, context, problem statements, decisions, rationale, alternatives considered, and consequences.

---

## 1. ADR Index

| ADR ID | Decision Title | Status | Short Description |
| :--- | :--- | :---: | :--- |
| **ADR-001** | MERN Monorepo Directory Structure | Accepted | Separate project into `/backend` and `/frontend` directories. |
| **ADR-002** | JWT Authentication Strategy | Accepted | Implement 30-day JWT tokens sent via `Authorization: Bearer` headers. |
| **ADR-003** | Structured AI JSON Output Format | Accepted | Instruct AI models to return structured JSON containing quote and metadata. |
| **ADR-004** | Node Cron Background Task Execution | Accepted | Run background cron daemon every minute (`* * * * *`) for post execution. |
| **ADR-005** | React Context API for Global State | Accepted | Use React Context API (`AuthContext`) for user session management. |
| **ADR-006** | Tailwind CSS for Design System | Accepted | Utilize Tailwind CSS v3 with glassmorphism design tokens for UI. |
| **ADR-007** | Backend MVC Architecture Pattern | Accepted | Enforce strict separation between Models, Controllers, and Routes. |
| **ADR-008** | MongoDB Atlas for Persistence | Accepted | Use MongoDB Atlas with Mongoose schema validation and text indexing. |
| **ADR-009** | Dedicated AI Service Abstraction | Accepted | Isolate AI API calls inside `backend/services/`. |
| **ADR-010** | Living Documentation System | Accepted | Establish modular documentation in `/docs` alongside project code. |

---

## 2. Architectural Decision Records

### ADR-001: MERN Monorepo Directory Structure

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Technical Lead / Architect
- **Related Components**: `/backend`, `/frontend`, root repository

#### Context
The project requires a clear, maintainable repository layout containing an Express REST API backend and a Vite-powered React single-page application frontend.

#### Problem Statement
Mixing server-side Node.js files with client-side React code in a single root directory leads to package collision, unclear build pipelines, and maintenance confusion.

#### Decision
Organize the project into a dual-folder monorepo containing `/backend` and `/frontend` subdirectories.

#### Rationale
- Keeps package dependencies (`package.json`) isolated between Node server and Vite client.
- Simplifies independent development, testing, and deployment scripts.

#### Alternatives Considered
- **Single Flat Directory**: Rejected due to dependency collisions (`express` vs `vite`).
- **Separate Repositories**: Rejected to keep code and documentation in a single repository.

#### Consequences
- **Positive**: Clean separation of concerns; modular configuration.
- **Trade-offs**: Requires running development servers in two separate terminal shells.

---

### ADR-002: JWT Authentication Strategy

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Technical Lead / Architect
- **Related Components**: `User.js`, `authController.js`, `authMiddleware.js`, `AuthContext.jsx`, `api.js`
- **Related ADRs**: ADR-001, ADR-007

#### Context
The single-page application (SPA) needs a secure method to verify user identity across API endpoints without maintaining server-side session state.

#### Problem Statement
Session-based authentication (cookies/sessions) requires server-side session storage and complex CORS credentials setup, complicating mobile or multi-client expansions.

#### Decision
Implement stateless JSON Web Tokens (JWT) with 30-day expiration, generated on register/login, stored in `localStorage`, and transmitted via `Authorization: Bearer <token>` HTTP headers.

#### Rationale
- Enables stateless authorization handled cleanly by Express middleware (`authMiddleware.js`).
- Easily consumed by Axios request interceptors on the frontend (`services/api.js`).

#### Alternatives Considered
- **Express Sessions with Cookies**: Rejected due to stateful session overhead.
- **Short-Lived JWTs with Refresh Tokens**: Deferred to avoid over-engineering the demonstration assignment.

#### Consequences
- **Positive**: Simple, stateless backend verification; portable across clients.
- **Trade-offs**: Token cancellation requires expiration or token blacklisting logic.

---

### ADR-003: Structured AI JSON Output Format

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: AI Engineer / Architect
- **Related Components**: `openaiService.js`, `quoteController.js`, `Quote.js`, `QuoteGenerator.jsx`
- **Related ADRs**: ADR-008, ADR-009

#### Context
The AI Quote Generator must produce not only quote text, but a complete social media package including author, caption, explanation, hashtags, emojis, image generation prompt, suggested posting time, and engagement tips.

#### Problem Statement
Freeform text responses from AI models require unreliable regex parsing and frequently result in missing metadata fields.

#### Decision
Enforce strict JSON schema requirements in system prompts, requiring AI models to return raw JSON objects matching expected document keys.

#### Rationale
- Guarantees complete metadata payloads that map directly to Mongoose `Quote` schema fields.
- Allows immediate JSON parsing (`JSON.parse`) in the service layer.

#### Alternatives Considered
- **Freeform Text Prompting**: Rejected due to parsing brittleness.
- **Multiple Sequential API Calls**: Rejected due to excessive latency and cost.

#### Consequences
- **Positive**: Deterministic response parsing; seamless UI rendering.
- **Trade-offs**: Requires markdown code block stripping (`\`\`\`json`) if the model wraps output.

---

### ADR-004: Node Cron Background Task Execution

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Technical Lead / Architect
- **Related Components**: `cronJobs.js`, `server.js`, `Quote.js`
- **Related ADRs**: ADR-001, ADR-007

#### Context
Scheduled quotes must automatically transition from `Scheduled` to `Posted` when their `scheduledAt` timestamp arrives without requiring active frontend browser sessions.

#### Problem Statement
Relying on client-side polling or manual status checks fails if no user is actively viewing the web application.

#### Decision
Implement a background Node Cron worker daemon (`jobs/cronJobs.js`) running every minute (`* * * * *`) inside the Express process to query due posts and update their database status.

#### Rationale
- Simple, self-contained background task executor that runs automatically with the backend server.
- Avoids requiring external queue infrastructure (Redis/BullMQ) for a demonstration codebase.

#### Alternatives Considered
- **Client-Side Polling**: Rejected because execution stops when the browser closes.
- **Redis / BullMQ Queue**: Deferred to avoid introducing external infrastructure requirements.

#### Consequences
- **Positive**: Reliable automated post publishing within 60 seconds of scheduled time.
- **Trade-offs**: Cron runs within the main Express event loop (mitigated by lightweight database queries).

---

### ADR-005: React Context API for Global Application State

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Frontend Lead
- **Related Components**: `AuthContext.jsx`, `App.jsx`, `ProtectedRoute.jsx`
- **Related ADRs**: ADR-002

#### Context
User session state, JWT tokens, and authentication handlers (`login`, `register`, `logout`) must be accessible across multiple pages and layouts.

#### Problem Statement
Prop-drilling user credentials through deep component hierarchies creates fragile, tightly coupled components.

#### Decision
Use React's native Context API (`AuthContext.jsx`) to manage global authentication state and expose a custom hook (`useAuth`).

#### Rationale
- Native to React 18 with zero external package dependencies.
- Perfect fit for user session state management without Redux boilerplates.

#### Alternatives Considered
- **Redux Toolkit**: Rejected as unnecessary overhead for user auth state.
- **Zustand**: Considered, but native Context API met all requirements without extra packages.

#### Consequences
- **Positive**: Zero extra bundle size; simple hook-based state consumption (`useAuth()`).
- **Trade-offs**: Best suited for low-frequency global updates like authentication state.

---

### ADR-006: Tailwind CSS for Design System & Styling

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Frontend Lead
- **Related Components**: `tailwind.config.js`, `index.css`, all frontend pages & components

#### Context
The user interface requires a modern, responsive, dark-mode design system with visual elements like glassmorphism.

#### Problem Statement
Writing custom CSS stylesheets from scratch slows down component development and leads to inconsistent margins, paddings, and color palettes.

#### Decision
Adopt Tailwind CSS v3 with custom color extension tokens (`brand`, `dark`) and reusable glassmorphism utility classes (`.glass-panel`, `.glass-card`).

#### Rationale
- Utility-first approach enables rapid component styling directly inside JSX.
- Built-in responsive modifiers (`md:`, `lg:`) ensure mobile and desktop adaptability.

#### Alternatives Considered
- **Plain CSS Modules**: Rejected due to repetitive boilerplate.
- **Styled Components**: Rejected to keep build configuration simple under Vite.

#### Consequences
- **Positive**: Rapid development; unified dark-theme palette; small production CSS bundle.
- **Trade-offs**: Requires familiarity with Tailwind utility class names.

---

### ADR-007: Backend MVC Architecture Pattern

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Software Architect
- **Related Components**: `backend/models`, `backend/controllers`, `backend/routes`, `backend/services`
- **Related ADRs**: ADR-001

#### Context
The backend API needs a clean structure for handling database operations, business logic, route endpoints, and external services.

#### Problem Statement
Placing database queries, request validation, and AI service calls directly inside route handlers leads to bloated, unmaintainable files.

#### Decision
Adopt Model-View-Controller (MVC) separation on the backend:
- **Models**: Mongoose schemas and indexes only.
- **Controllers**: Request handling, parameter validation, and HTTP responses.
- **Routes**: Route path definitions and middleware attachment.
- **Services**: Isolated third-party integrations (AI Service).

#### Rationale
- Standard industry architecture for Express applications.
- Makes individual controllers easily testable and readable.

#### Alternatives Considered
- **Monolithic Route Handlers**: Rejected due to poor maintainability.

#### Consequences
- **Positive**: High modularity; strict separation of concerns.
- **Trade-offs**: Requires navigating multiple files per API feature.

---

### ADR-008: MongoDB Atlas for Persistent Storage

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Software Architect
- **Related Components**: `config/db.js`, `User.js`, `Quote.js`, `SocialAccount.js`
- **Related ADRs**: ADR-007

#### Context
The application requires persistent storage for user accounts, generated quotes, metadata, and social account states.

#### Problem Statement
Local file storage (JSON files) lacks query capabilities, text search, indexes, and concurrency protection.

#### Decision
Use MongoDB Atlas cloud database managed via the Mongoose ODM framework.

#### Rationale
- Flexible document model ideal for storing nested quote metadata (hashtags, emojis, engagement tips arrays).
- Built-in text index support (`quoteSchema.index({ quote: 'text', caption: 'text', category: 'text' })`) for fast library searching.

#### Alternatives Considered
- **PostgreSQL / MySQL**: Rejected because JSON arrays and flexible quote schemas fit NoSQL document structures better.
- **Local SQLite**: Rejected to avoid local file persistence limitations in containerized or cloud setups.

#### Consequences
- **Positive**: Powerful query engine; rich Mongoose schema validation and text search.
- **Trade-offs**: Requires active cloud database connection string (`MONGODB_URI`).

---

### ADR-009: AI Service Integration Abstraction

- **Status**: Accepted
- **Date**: 2026-08-05
- **Decision Makers**: Software Architect / AI Engineer
- **Related Components**: `backend/services/openaiService.js`, `quoteController.js`
- **Related ADRs**: ADR-003, ADR-007

#### Context
The quote controller needs to generate AI content without coupling HTTP handling logic directly to a specific AI SDK client.

#### Problem Statement
Embedding direct AI SDK API calls inside controller functions makes it difficult to switch AI service providers (e.g. transitioning from OpenAI to Groq API).

#### Decision
Isolate all AI prompt construction, SDK instantiation, API completion calls, and JSON response cleaning inside a dedicated service module in `backend/services/`.

#### Rationale
- Decouples API route logic from AI provider SDK implementations.
- Enables switching underlying LLM providers (e.g. OpenAI to Groq) by modifying only the service layer.

#### Alternatives Considered
- **Direct Controller Invocation**: Rejected due to tight coupling.

#### Consequences
- **Positive**: Clean abstraction boundary; simple provider replacement.
- **Trade-offs**: Small additional indirection layer.

---

### ADR-010: Living Documentation Architecture under `/docs`

- **Status**: Accepted
- **Date**: 2026-08-06
- **Decision Makers**: Technical Lead / Architect
- **Related Components**: `AGENTS.md`, `docs/*.md`
- **Related ADRs**: ADR-001

#### Context
Long-term codebase maintainability requires accurate documentation that evolves alongside code changes.

#### Problem Statement
Undocumented codebases or outdated single README files result in lost project context and architectural drift during team or AI assistant handovers.

#### Decision
Establish a structured living documentation suite in `/docs` comprising numbered, single-responsibility markdown files (`00` through `07`) alongside `AGENTS.md`.

#### Rationale
- Clear reading order (`AGENTS.md` -> `PROJECT_CONTEXT` -> `ARCHITECTURE` -> `NEXT_TASK`) for rapid developer and AI onboarding.
- Easy to maintain incremental updates alongside code modifications.

#### Alternatives Considered
- **Single Large README.md**: Rejected due to poor readability and difficulty navigating large files.
- **External Wiki**: Rejected to keep documentation version-controlled directly in the code repository.

#### Consequences
- **Positive**: Complete repository memory; seamless AI assistant onboarding; version-controlled documentation.
- **Trade-offs**: Requires disciplined documentation updates after every major code change.

---

## 3. ADR Maintenance Guide

Architectural Decision Records should be created or updated whenever a significant technical decision is made that impacts the repository layout, tech stack, data models, or security model.

### When to Create a New ADR
- Transitioning underlying service providers (e.g. OpenAI to Groq API).
- Adding new database models or major schema reorganizations.
- Modifying authentication strategies or token expiration models.
- Introducing new state management or frontend frameworks.
- Adding automated testing frameworks (Jest/Supertest/Vitest).
- Implementing containerization (Docker) or deployment CI/CD pipelines.

### How to Maintain ADRs
- Assign the next sequential ADR ID (`ADR-011`, etc.).
- Fill out all standard fields (Status, Date, Decision Makers, Related Components, Context, Problem Statement, Decision, Rationale, Alternatives Considered, Consequences).
- Update the **ADR Index** table at the top of this document.
