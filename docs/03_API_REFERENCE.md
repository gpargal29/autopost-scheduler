# 03 Backend API Reference

This document serves as the comprehensive REST API reference for the **AI-Powered Quote Auto Scheduler** backend service.

---

## 1. API Overview

- **Architecture**: RESTful JSON API over HTTP/HTTPS.
- **Base URL**: `http://localhost:5000/api`
- **Request / Response Format**: All request payloads and response bodies use standard `application/json`.
- **Global Response Schema**:
  - Success responses: `{ "success": true, ...data }`
  - Error responses: `{ "success": false, "message": "Error description" }`
- **API Organization**: Endpoints are grouped into modular route files (`health.js`, `authRoutes.js`, `quoteRoutes.js`, `socialRoutes.js`, `analyticsRoutes.js`) mounted in [server.js](file:///Users/babitakhanulia/Desktop/autopost/backend/server.js).

---

## 2. Authentication Overview

The API implements stateless JSON Web Token (JWT) authentication.

- **Token Issue**: Tokens are generated on successful user registration (`POST /api/auth/register`) or login (`POST /api/auth/login`).
- **Token Expiry**: Issued tokens expire in **30 days**.
- **Authorization Header**: Protected endpoints require the JWT passed in the HTTP Authorization header:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Middleware Protector**: The `protect` middleware (`backend/middleware/authMiddleware.js`) decodes the token using `process.env.JWT_SECRET`, retrieves the user record (`select('-password')`), and attaches it to `req.user`. Missing or invalid tokens return `401 Unauthorized`.

---

## 3. Common HTTP Status Codes

| Status Code | Description | Typical Trigger Context |
| :--- | :--- | :--- |
| **`200 OK`** | Request succeeded | Successful GET, PUT, or DELETE requests. |
| **`201 Created`** | Resource created | Successful registration or quote generation/duplication. |
| **`400 Bad Request`** | Missing or invalid parameters | Omitted required fields (email, password, category) or duplicate registration email. |
| **`401 Unauthorized`** | Authentication failure | Missing, expired, or invalid JWT token; invalid login credentials. |
| **`404 Not Found`** | Resource not found | Requesting a quote ID or social account ID that does not exist or belong to the user. |
| **`500 Internal Server Error`** | Server-side execution failure | Uncaught exception handled by `errorHandler.js`. |

---

## 4. Endpoint Index

| Method | Endpoint | Auth Required | Controller File | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/health` | No | `routes/health.js` | System health check and server uptime |
| `POST` | `/api/auth/register` | No | `controllers/authController.js` | Register new user account & issue JWT |
| `POST` | `/api/auth/login` | No | `controllers/authController.js` | Authenticate user credentials & issue JWT |
| `GET` | `/api/auth/me` | Yes | `controllers/authController.js` | Retrieve authenticated user profile |
| `POST` | `/api/quotes/generate` | Yes | `controllers/quoteController.js` | Trigger AI quote generation & save to DB |
| `GET` | `/api/quotes` | Yes | `controllers/quoteController.js` | Query quote library (search, filter, paginate) |
| `GET` | `/api/quotes/:id` | Yes | `controllers/quoteController.js` | Retrieve single quote details by ID |
| `PUT` | `/api/quotes/:id` | Yes | `controllers/quoteController.js` | Update quote content, schedule date, or status |
| `DELETE` | `/api/quotes/:id` | Yes | `controllers/quoteController.js` | Delete quote record |
| `POST` | `/api/quotes/:id/duplicate` | Yes | `controllers/quoteController.js` | Clone an existing quote as a new pending record |
| `GET` | `/api/social-accounts` | Yes | `controllers/socialController.js` | Fetch user social account connection states |
| `PUT` | `/api/social-accounts/:id/toggle` | Yes | `controllers/socialController.js` | Toggle connection state of a social account |
| `GET` | `/api/analytics/dashboard` | Yes | `controllers/analyticsController.js` | Fetch aggregate stats & category distribution |

---

## 5. Detailed Endpoint Specifications

### Quote Endpoints (`/api/quotes`)

#### `POST /api/quotes/generate`
- **Purpose**: Trigger AI quote generation, create structured social metadata, and persist the record to MongoDB Atlas.
- **Controller Method**: `quoteController.generateQuote`
- **Auth Required**: Yes
- **Models Used**: `Quote`
- **Services Used**: AI Service Integration (`backend/services/openaiService.js`)
- **Environment Configuration**: Consumes `GROQ_API_KEY`, `GROQ_MODEL`, `OPENAI_API_KEY`, `OPENAI_MODEL` environment variables.
- **Validation Rules**: `category` is required and must be one of the 12 supported category strings.
- **Request Body**:
  ```json
  {
    "category": "Motivation",
    "customTopic": "Overcoming obstacles",
    "tone": "Inspirational",
    "targetAudience": "Entrepreneurs"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "quote": {
      "_id": "65c2b345d678901234567890",
      "user": "65b1a234c567890123456789",
      "category": "Motivation",
      "quote": "Obstacles are raw material for greatness.",
      "author": "AI Visionary",
      "caption": "Turn every setback into your launchpad...",
      "explanation": "This quote emphasizes resilience in the face of adversity...",
      "hashtags": ["#Motivation", "#Overcome", "#GrowthMindset"],
      "emojiSuggestions": ["🚀", "💡", "✨", "🎯"],
      "imagePrompt": "A dramatic mountain summit at dawn with warm sunlight...",
      "suggestedPostingTime": "09:00 AM (Peak morning focus time)",
      "engagementSuggestions": ["Ask followers: What is your biggest win this week?"],
      "status": "Pending",
      "scheduledAt": null,
      "postedAt": null,
      "platforms": [],
      "createdAt": "2026-08-06T12:00:00.000Z",
      "updatedAt": "2026-08-06T12:00:00.000Z"
    }
  }
  ```

---

## 6. Current API Status & Limitations

- **Stable Endpoints**: All Authentication, Quote CRUD, Quote Generation, Scheduler, Social Accounts, and Analytics endpoints are active and verified.
- **AI Service Configuration**: Configured with automatic Groq API support (`https://api.groq.com/openai/v1`) using `process.env.GROQ_API_KEY` and configurable model `process.env.GROQ_MODEL` (with fallback to `OPENAI_API_KEY` and `OPENAI_MODEL`).
- **Known Limitations**: Social account posting currently simulates publishing logs inside the Node Cron worker rather than invoking external provider OAuth APIs.
