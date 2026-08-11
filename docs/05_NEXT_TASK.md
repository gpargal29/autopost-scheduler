# 05 Next Task & Active Sprint Handover Guide

This document serves as the primary sprint planning and handover guide for the **AI-Powered Quote Auto Scheduler** repository. Any AI assistant or developer resuming work on this codebase should consult this guide to understand active priorities, feature implementation states, affected files, and completion criteria.

---

## 1. Current Repository Snapshot

| Feature Module | Implementation State | Technical Note |
| :--- | :---: | :--- |
| **Authentication** | ✅ Complete | JWT login/register, password visibility toggle (`Login.jsx`), bcrypt, `protect` middleware |
| **AI Quote Generator** | ✅ Complete | Unpersisted generation in React state with 4 explicit actions (Save to Library, Schedule, Publish, Discard) |
| **Quote Library (CRUD)** | ✅ Complete | Status-aware actions (Schedule, Reschedule, Retry, None for Posted) & server-side pagination (`Pagination.jsx`) |
| **Manual Scheduling** | ✅ Complete | Dual Date (`input date`) & Time (`input time`) pickers with `showPicker()` refs |
| **AI Single Scheduling** | ✅ Complete | `ScheduleModal.jsx` dynamically parses `suggestedPostingTime` via `dateHelpers.js` |
| **AI Bulk Scheduling** | ✅ Complete | `SmartScheduler.jsx` computes slots per quote's AI recommendation with 30-min collision resolution |
| **Background Scheduler** | ✅ Complete (Internal) | Node Cron daemon (`cronJobs.js`) running every minute (`* * * * *`) updating DB to `Posted` |
| **Posting History** | ✅ Complete | Server-side paginated audit log table (`PostingHistory.jsx`) displaying DB `Posted` + `Failed` records |
| **Dashboard & Analytics**| ✅ Complete | Consolidated Dashboard (`Dashboard.jsx`) with KPIs, Category breakdown, activity stream |
| **Settings & Profile** | ✅ Complete | SaaS Settings (`Settings.jsx`) with Account, AI Engine info, local toggles & health bar |
| **Social Accounts** | 🟡 Partial | `SocialAccounts.jsx` & DB store `isConnected` flag; no real OAuth 2.0 authorization |
| **Social Publishing** | 🔴 Simulated | Background cron updates DB status; live platform APIs (LinkedIn, Instagram, Facebook) simulated |

---

## 2. Active Application Development Priorities

The following application-level tasks represent the immediate development sequence for the project:

### Priority 3: Native Social Account OAuth 2.0 Authorization
- **Goal**: Implement OAuth 2.0 authentication flows for LinkedIn, Instagram (Meta Graph API), and Facebook. Generate authorization URLs, handle redirect callbacks, and store encrypted access/refresh tokens in MongoDB `SocialAccount` documents.
- **Files Affected**:
  - `backend/models/SocialAccount.js`
  - `backend/controllers/socialController.js`
  - `backend/routes/socialRoutes.js`
  - `frontend/src/pages/SocialAccounts.jsx`

### Priority 4: Live Social Media Platform Publishing APIs
- **Goal**: Integrate official third-party publishing REST APIs inside `backend/jobs/cronJobs.js` (LinkedIn UGC Post API, Meta Graph API for Instagram/Facebook) to publish live social posts when quotes reach `Scheduled` execution time.
- **Files Affected**:
  - `backend/jobs/cronJobs.js`
  - `backend/services/linkedinService.js` [NEW]
  - `backend/services/metaService.js` [NEW]

---

## 3. Definition of Done for Active Sprint

1. **AI Recommendation Consumption**: The scheduler modal and bulk scheduler dynamically parse and respect `suggestedPostingTime` from MongoDB.
2. **Build Verification**: `node -c server.js` inside `/backend` and `npm run build` inside `/frontend` compile with zero syntax or bundling errors.
3. **Documentation Sync**: All living markdown documentation files accurately describe the implementation without overstating feature completion.
