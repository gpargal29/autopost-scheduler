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

## 5. Endpoint Request Lifecycle

```
[ Client Request ]
       ↓
[ CORS & Body Parsers ]
       ↓
[ Auth Middleware (protect) ]  ──(Missing/Invalid Token)──>  [ 401 Unauthorized Response ]
       ↓ (Valid Token)
[ Express Controller ]
       ↓
[ Service Layer (AI Service / Mongoose Model) ]
       ↓
[ MongoDB Atlas ]
       ↓
[ Express Controller Formatting ]
       ↓
[ 200/201 JSON Response ]
```

---

## 6. Detailed Endpoint Specifications

### System Endpoints

#### `GET /api/health`
- **Purpose**: Server health check and diagnostic information.
- **Auth Required**: No
- **Models Used**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "AI Quote Auto Scheduler API is active and healthy",
    "timestamp": "2026-08-06T12:00:00.000Z",
    "version": "1.0.0"
  }
  ```

---

### Authentication Endpoints (`/api/auth`)

#### `POST /api/auth/register`
- **Purpose**: Register a new user account and generate an initial JWT token.
- **Controller Method**: `authController.registerUser`
- **Auth Required**: No
- **Models Used**: `User`
- **Validation Rules**:
  - `name`: Required, max 50 characters.
  - `email`: Required, valid email format, unique in database.
  - `password`: Required, minimum 6 characters.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secretpassword"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65b1a234c567890123456789",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{ "success": false, "message": "Please provide name, email, and password" }`
  - `400 Bad Request`: `{ "success": false, "message": "User already exists with this email address" }`

#### `POST /api/auth/login`
- **Purpose**: Authenticate user credentials and return a new JWT token.
- **Controller Method**: `authController.loginUser`
- **Auth Required**: No
- **Models Used**: `User`
- **Validation Rules**: `email` and `password` are required.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "secretpassword"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65b1a234c567890123456789",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{ "success": false, "message": "Please provide email and password" }`
  - `401 Unauthorized`: `{ "success": false, "message": "Invalid email or password credentials" }`

#### `GET /api/auth/me`
- **Purpose**: Fetch profile data for the currently authenticated user session.
- **Controller Method**: `authController.getMe`
- **Auth Required**: Yes (`Bearer <token>`)
- **Models Used**: `User`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "65b1a234c567890123456789",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

---

### Quote Endpoints (`/api/quotes`)

#### `POST /api/quotes/generate`
- **Purpose**: Trigger AI quote generation, create structured social metadata, and persist the record to MongoDB Atlas.
- **Controller Method**: `quoteController.generateQuote`
- **Auth Required**: Yes
- **Models Used**: `Quote`
- **Services Used**: AI Service Integration (`backend/services/openaiService.js`)
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

#### `GET /api/quotes`
- **Purpose**: Retrieve paginated user quotes with optional search and filtering.
- **Controller Method**: `quoteController.getQuotes`
- **Auth Required**: Yes
- **Models Used**: `Quote`
- **Query Parameters**:
  - `page` (number, default: `1`): Page number.
  - `limit` (number, default: `10`): Items per page.
  - `category` (string, optional): Filter by category.
  - `status` (string, optional): Filter by status (`Pending`, `Scheduled`, `Posted`, `Failed`).
  - `search` (string, optional): Case-insensitive regex search across `quote`, `caption`, and `author`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "total": 1,
    "page": 1,
    "pages": 1,
    "quotes": [...]
  }
  ```

#### `GET /api/quotes/:id`
- **Purpose**: Retrieve single quote details by ID.
- **Controller Method**: `quoteController.getQuoteById`
- **Auth Required**: Yes
- **Models Used**: `Quote`
- **Success Response (`200 OK`)**: `{ "success": true, "quote": { ... } }`

#### `PUT /api/quotes/:id`
- **Purpose**: Update quote text, category, caption, schedule date, target platforms, or status.
- **Controller Method**: `quoteController.updateQuote`
- **Auth Required**: Yes
- **Models Used**: `Quote`
- **Request Body Example (Scheduling a Post)**:
  ```json
  {
    "status": "Scheduled",
    "scheduledAt": "2026-08-07T09:00:00.000Z",
    "platforms": ["LinkedIn", "Instagram"]
  }
  ```
- **Success Response (`200 OK`)**: `{ "success": true, "quote": { ... } }`

#### `POST /api/quotes/:id/duplicate`
- **Purpose**: Clone an existing quote as a new quote record with `Pending` status.
- **Controller Method**: `quoteController.duplicateQuote`
- **Auth Required**: Yes
- **Models Used**: `Quote`
- **Success Response (`201 Created`)**: `{ "success": true, "quote": { ... } }`

#### `DELETE /api/quotes/:id`
- **Purpose**: Remove a quote record from the database.
- **Controller Method**: `quoteController.deleteQuote`
- **Auth Required**: Yes
- **Models Used**: `Quote`
- **Success Response (`200 OK`)**: `{ "success": true, "message": "Quote removed successfully" }`

---

### Social Accounts & Analytics Endpoints

#### `GET /api/social-accounts`
- **Purpose**: Retrieve user social account connection states (seeds LinkedIn, Instagram, Facebook defaults if empty).
- **Controller Method**: `socialController.getSocialAccounts`
- **Auth Required**: Yes
- **Models Used**: `SocialAccount`
- **Success Response (`200 OK`)**: `{ "success": true, "accounts": [...] }`

#### `PUT /api/social-accounts/:id/toggle`
- **Purpose**: Toggle connection state (`isConnected: true/false`) of a social account.
- **Controller Method**: `socialController.toggleSocialAccount`
- **Auth Required**: Yes
- **Models Used**: `SocialAccount`

#### `GET /api/analytics/dashboard`
- **Purpose**: Retrieve dashboard statistics, status counts, category breakdown, and recent activity streams.
- **Controller Method**: `analyticsController.getDashboardAnalytics`
- **Auth Required**: Yes
- **Models Used**: `Quote`, `SocialAccount`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "stats": {
      "totalQuotes": 12,
      "pendingCount": 5,
      "scheduledCount": 4,
      "postedCount": 3,
      "failedCount": 0,
      "connectedAccountsCount": 2
    },
    "categoryStats": [
      { "_id": "Motivation", "count": 6 },
      { "_id": "Success", "count": 4 }
    ],
    "recentActivity": [...],
    "upcomingScheduled": [...]
  }
  ```

---

## 7. Current API Status & Limitations

- **Stable Endpoints**: All Authentication, Quote CRUD, Quote Generation, Scheduler, Social Accounts, and Analytics endpoints are active and verified.
- **Known Limitations**: Social account posting currently simulates publishing logs inside the Node Cron worker rather than invoking external provider OAuth APIs.
- **Planned Improvements**: Transition AI generation backend service to Groq API.
