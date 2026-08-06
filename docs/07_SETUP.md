# 07 Setup & Installation Guide

This document is the primary onboarding and setup guide for the **AI-Powered Quote Auto Scheduler** repository. Follow these instructions to configure environment variables, install dependencies, launch services, verify functionality, and troubleshoot common issues.

---

## 1. Quick Start Guide

To get the full application running locally in under 5 minutes:

```bash
# 1. Clone or open repository root
cd /Users/babitakhanulia/Desktop/autopost

# 2. Configure Backend Environment
cd backend
cp .env.example .env
# Edit .env to add your MONGODB_URI, JWT_SECRET, and AI API keys

# 3. Install & Start Backend (Terminal Shell 1)
npm install
npm run dev

# 4. Install & Start Frontend (Terminal Shell 2)
cd ../frontend
npm install
npm run dev

# 5. Open Application in Browser
# Navigate to http://localhost:5173
```

---

## 2. Repository Structure

```
autopost/
├── backend/       # Express REST API, Node Cron jobs, Mongoose models, controllers
├── frontend/      # React 18 SPA, Vite 5, Tailwind CSS, Axios, Context API
├── docs/          # Numbered living documentation suite (00 through 07)
├── AGENTS.md      # Primary onboarding manual & operating rules for AI & developers
└── README.md      # High-level project summary
```

---

## 3. Prerequisites

Ensure your system meets the following prerequisites before starting:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB Atlas Account**: Active cluster connection string
- **AI Service API Key**: OpenAI API Key or Groq API Key

---

## 4. Environment Variable Reference

Create `.env` inside `backend/` based on `backend/.env.example`:

| Environment Variable | Required / Optional | Default Value | Consumer Component | Purpose / Format |
| :--- | :---: | :--- | :--- | :--- |
| **`PORT`** | Optional | `5000` | `server.js` | Express server port listener (e.g. `5000`). |
| **`MONGODB_URI`** | **Required** | None | `config/db.js` | MongoDB Atlas cluster connection string (`mongodb+srv://...`). |
| **`JWT_SECRET`** | **Required** | None | `authController.js`, `authMiddleware.js` | Secret key used to sign & verify JWT tokens (`string`). |
| **`OPENAI_API_KEY`** | **Required*** | None | `services/openaiService.js` | API key for OpenAI GPT structured quote generation (`sk-proj-...`). |
| **`GROQ_API_KEY`** | **Required*** | None | AI Service Provider | API key for Groq LLM inference service (`gsk_...`). |
| **`CLIENT_URL`** | Optional | `http://localhost:5173` | `server.js` | Allowed Origin for CORS middleware configuration. |

*\* Note: Either `OPENAI_API_KEY` or `GROQ_API_KEY` is required depending on active AI provider configuration.*

```env
# Sample backend/.env file
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/autopost?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_32_chars_long
OPENAI_API_KEY=sk-proj-your-openai-api-key
GROQ_API_KEY=gsk_your_groq_api_key
CLIENT_URL=http://localhost:5173
```

---

## 5. Recommended Startup Sequence

1. **Configure `.env`**: Create `/backend/.env` and insert valid MongoDB Atlas URI and JWT Secret credentials.
2. **Launch Backend**: Run `npm run dev` in `/backend`.
3. **Verify Backend Connection**: Ensure console displays:
   - `Server running in development mode on port 5000`
   - `MongoDB Connected: cluster...`
   - `[Node-Cron] Initializing background auto-scheduler service...`
4. **Launch Frontend**: Run `npm run dev` in `/frontend`.
5. **Open Web Browser**: Navigate to `http://localhost:5173`.
6. **Register/Login**: Register a new user account or log in to establish an active session token.
7. **Generate First Quote**: Navigate to `/generator`, select a category, and click "Generate Quote".

---

## 6. Detailed Installation Steps

### 1. Backend Service Setup
```bash
cd backend
npm install
npm run dev
```
The Express backend API will start on `http://localhost:5000`.

### 2. Frontend Application Setup
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`.

---

## 7. Expected Verification Results

### Backend Verification
- **Command**: `node -c server.js` (Run in `/backend`)
- **Expected Outcome**: Clean execution returning to terminal prompt with zero syntax errors.
- **Health Check**: `curl http://localhost:5000/api/health`
- **Expected Output**:
  ```json
  {
    "success": true,
    "message": "AI Quote Auto Scheduler API is active and healthy",
    "timestamp": "...",
    "version": "1.0.0"
  }
  ```

### Frontend Verification
- **Command**: `npm run build` (Run in `/frontend`)
- **Expected Outcome**: Vite compiles all modules (1550+ modules) into `/dist` with zero bundling errors.

---

## 8. Troubleshooting Guide

| Issue / Error Message | Likely Cause | Resolution |
| :--- | :--- | :--- |
| **`MongoDB Connection Error`** | Invalid `MONGODB_URI` or IP address not whitelisted in Atlas. | Check `/backend/.env` string formatting and add current IP to Atlas Network Access rules. |
| **`JWT Token Missing / Invalid`** | Omitted `JWT_SECRET` in `.env` or missing header in client. | Confirm `JWT_SECRET` is set in `.env` and verify request sends `Authorization: Bearer <token>`. |
| **`EADDRINUSE: port 5000 in use`** | Another node process is running on port 5000. | Kill process on port 5000 (`lsof -i :5000` -> `kill -9 <PID>`) or change `PORT` in `.env`. |
| **`OpenAI / Groq API Error`** | Missing or invalid AI API key in `.env`. | Ensure `OPENAI_API_KEY` or `GROQ_API_KEY` is correctly set without extra spaces or quotes. |
| **`CORS Policy Error in Browser`** | Frontend running on different port than `CLIENT_URL`. | Ensure `CLIENT_URL` in `/backend/.env` matches `http://localhost:5173`. |
| **`Module Not Found / vite not recognized`** | Missing `node_modules` packages. | Run `npm install` inside `/frontend` or `/backend` directory. |

---

## 9. Daily Development Workflow

For ongoing development work, follow this standard pattern:

1. **Start Services**: Open two terminal windows and start `/backend` (`npm run dev`) and `/frontend` (`npm run dev`).
2. **Implement Task**: Make surgical, focused edits targeting task objectives.
3. **Verify Builds**: Run `node -c server.js` in `/backend` and `npm run build` in `/frontend`.
4. **Manual Sanity Check**: Verify changes in the browser (`http://localhost:5173`).
5. **Update Documentation**: Update `docs/04_CHANGELOG.md`, `docs/05_NEXT_TASK.md`, and `docs/00_PROJECT_CONTEXT.md`.

---

## 10. Project Verification Checklist

- [ ] **Backend Server**: Running on port `5000` with active MongoDB Atlas connection.
- [ ] **Frontend Client**: Running on port `5173` rendering glassmorphic UI.
- [ ] **Health Endpoint**: `GET /api/health` returns `{ success: true }`.
- [ ] **User Registration**: Creating an account registers the user and stores a JWT in `localStorage`.
- [ ] **User Login**: Logging in returns a 30-day token and redirects to the Dashboard.
- [ ] **AI Quote Generation**: Generating a quote returns structured quote text, author, caption, explanation, hashtags, emojis, and image prompt.
- [ ] **Quote Library**: Library view displays quotes with search query, category filter, and edit/duplicate controls.
- [ ] **Smart Scheduler**: Scheduling a quote updates `scheduledAt` timestamp and sets status to `Scheduled`.
- [ ] **Node Cron Daemon**: Console logs background execution checks every minute (`* * * * *`).

---

## 11. Documentation Reading Order

Navigate project documentation in this order:

1. **`AGENTS.md`**: Primary repository operating manual, guidelines, and verification rules.
2. **`docs/00_PROJECT_CONTEXT.md`**: Living repository memory, feature completion status, and current state.
3. **`docs/05_NEXT_TASK.md`**: Current sprint goals, expected file changes, and completion criteria.
4. **`docs/01_ARCHITECTURE.md`**: System architecture, component models, and data flow diagrams.
5. **Relevant Source Code**: Backend controllers/models or frontend views/components.

---

## 12. Maintenance Guide

Update this setup guide whenever:
- New environment variables are added to `.env.example`.
- Core package dependencies or minimum Node.js versions change.
- Server ports or proxy routing configurations are updated in `vite.config.js`.
- Deployment pipelines or containerization configurations are introduced.
