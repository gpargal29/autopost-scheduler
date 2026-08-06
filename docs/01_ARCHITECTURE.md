# 01 System Architecture

## Architecture Overview

The application follows a client-server architecture with a clear separation between the Express backend REST API and the React single-page application (SPA).

```
+-------------------------------------------------------+
|                    Client (React + Vite)              |
|  - Components & Modals (EditQuote, ScheduleModal)     |
|  - Page Views (Generator, Library, Scheduler, etc.)   |
|  - State Management (AuthContext)                     |
|  - API Service Client (Axios + JWT Interceptors)      |
+---------------------------+---------------------------+
                            |
                     HTTP / REST API
                            |
+---------------------------v---------------------------+
|                    Backend (Express.js)               |
|  - Routes & Middleware (protect, errorHandler)        |
|  - Controllers (auth, quote, social, analytics)       |
|  - Services (AI Service Integration)                  |
|  - Background Scheduler (Node Cron Job Runner)        |
+---------------------------+---------------------------+
                            |
                 Mongoose Connection
                            |
+---------------------------v---------------------------+
|                    Database (MongoDB Atlas)           |
|  - Users Collection                                   |
|  - Quotes Collection (Indexed by user, quote, cat)    |
|  - SocialAccounts Collection                          |
+-------------------------------------------------------+
```

---

## Data Flow Diagrams

### 1. Authentication Flow
```
User -> Register/Login Form -> POST /api/auth/register or /login
    -> Express Controller -> Bcrypt Hash / Verify -> Generate JWT Token
    -> Return Token & User Object -> React AuthContext stores Token in localStorage
    -> Axios Request Interceptor attaches 'Authorization: Bearer <token>' to subsequent requests
```

### 2. AI Quote Generation Flow
```
User -> Select Category & Options -> POST /api/quotes/generate
    -> Express Controller -> Call AI Service -> Generate Structured JSON
    -> Mongoose creates Quote document in MongoDB Atlas (status: 'Pending')
    -> Return saved Quote document to React QuoteGenerator UI
```

### 3. Background Post Execution Flow
```
Node Cron Job Runner (Every Minute: '* * * * *')
    -> Query MongoDB: Quote.find({ status: 'Scheduled', scheduledAt: { $lte: new Date() } })
    -> Loop matching Quotes -> Simulate social provider publishing
    -> Update Quote in MongoDB: status = 'Posted', postedAt = new Date()
```
