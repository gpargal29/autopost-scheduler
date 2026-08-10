# 05 Next Task & Active Sprint Handover Guide

This document serves as the primary sprint planning and handover guide for the **AI-Powered Quote Auto Scheduler** repository. Any AI assistant or developer resuming work on this codebase should consult this guide to understand active priorities, feature implementation states, affected files, and completion criteria.

---

## 1. Current Repository Snapshot

| Feature Module | Implementation State | Technical Note |
| :--- | :---: | :--- |
| **Authentication** | ✅ Complete | JWT login/register, password visibility toggle (`Login.jsx`), bcrypt, `protect` middleware |
| **AI Quote Generator** | ✅ Complete | Generates 12 categories with structured metadata via Groq API (`llama-3.3-70b-versatile`) |
| **Quote Library (CRUD)** | ✅ Complete | Search, category/status filter, grid/table views, edit, delete, duplicate |
| **Manual Scheduling** | ✅ Complete | `ScheduleModal.jsx` captures custom datetime & platforms, saving to MongoDB |
| **Background Scheduler** | ✅ Complete (Internal) | Node Cron daemon (`cronJobs.js`) running every minute (`* * * * *`) updating DB to `Posted` |
| **Posting History** | ✅ Complete | Audit log table (`PostingHistory.jsx`) displaying published/failed DB records |
| **Dashboard & Analytics**| ✅ Complete | Consolidated Dashboard (`Dashboard.jsx`) with KPIs, Category breakdown, activity stream |
| **Settings & Profile** | ✅ Complete | SaaS Settings (`Settings.jsx`) with Account, AI Engine info, local toggles & health bar |
| **AI Single Scheduling** | 🟡 Partial | UI & DB updates work; uses hardcoded `09:30 AM` rule rather than quote's `suggestedPostingTime` |
| **AI Bulk Scheduling** | 🟡 Partial | Uses static daily slots `[9, 14, 19]` (`SmartScheduler.jsx`) rather than parsing quote recommendations |
| **Social Accounts** | 🟡 Partial | `SocialAccounts.jsx` & DB store `isConnected` flag; no real OAuth 2.0 authorization |
| **Social Publishing** | 🔴 Simulated | Background cron updates DB status; live platform APIs (LinkedIn, Instagram, Facebook) simulated |

---

## 2. Active Application Development Priorities

The following application-level tasks represent the immediate development sequence for the project:

### Priority 1: Dynamic AI Single Scheduling Slot Consumption
- **Goal**: Update `frontend/src/components/ScheduleModal.jsx` (`handleApplyAIRecommendation`) so that clicking "AI Recommended Time" dynamically parses and applies the quote's AI-generated `suggestedPostingTime` stored in MongoDB, rather than setting a hardcoded `09:30 AM` recommendation.
- **Files Affected**:
  - `frontend/src/components/ScheduleModal.jsx`
  - `frontend/src/utils/dateHelpers.js` (Optional helper if time string parsing is extracted)

### Priority 2: Dynamic AI Bulk Scheduling Slot Optimization
- **Goal**: Refactor `frontend/src/pages/SmartScheduler.jsx` (`handleBulkAutoSchedule`) so that bulk auto-scheduling computes daily slots using each quote's AI-generated `suggestedPostingTime` instead of relying on a static `const slots = [9, 14, 19];` array.
- **Files Affected**:
  - `frontend/src/pages/SmartScheduler.jsx`

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
