# AI-Powered Quote Auto Scheduler

> A full-stack MERN demonstration application for generating, managing, scheduling, and automatically publishing AI-driven motivational and business quotes.

---

## Overview

The **AI-Powered Quote Auto Scheduler** is a full-stack web application built using the MERN stack (MongoDB Atlas, Express.js, React + Vite, Node.js). It empowers users to generate high-engagement social media quotes and metadata across 12 distinct categories using AI models, manage a personal quote library, schedule posts manually or using AI recommended peak engagement slots, and automatically publish posts via a background Node Cron service.

---

## Tech Stack

### Backend
- **Node.js & Express.js**: RESTful API framework
- **MongoDB Atlas & Mongoose**: Cloud NoSQL database with Mongoose schemas and text indexing
- **JWT & Bcryptjs**: Token-based authentication and secure password hashing
- **Node Cron**: Background daemon for automated post publishing
- **AI Service Integration**: AI model integration for structured quote and metadata generation

### Frontend
- **React 18 (Vite 5)**: Fast UI framework with component-driven architecture
- **React Router v6**: Client-side routing and protected view management
- **Tailwind CSS v3**: Utility-first CSS with modern glassmorphism design tokens
- **Axios**: HTTP client configured with JWT request/response interceptors
- **Lucide React**: Modern icon set

---

## Key Features

1. **JWT Authentication**: User registration, login, JWT token management, and protected routes.
2. **AI Quote Generator**: Structured content generation across 12 categories (*Motivation, Success, Leadership, Business, Productivity, Fitness, Self Improvement, Positivity, Entrepreneurship, Mindfulness, Happiness, Wisdom*).
3. **Quote Library**: Full CRUD capabilities, search query support, category/status filtering, quote duplication, and edit modals.
4. **Smart Scheduler**: Manual datetime scheduling, AI recommended time calculation, target social platform multi-selection (*LinkedIn, Instagram, Facebook*), and AI bulk auto-scheduling.
5. **Background Scheduler**: Node Cron background task running every minute to transition `Scheduled` quotes to `Posted`.
6. **Social Accounts**: Platform connection tracking and OAuth readiness architecture.
7. **Posting History**: Comprehensive audit log table of published and attempted post executions.
8. **Dashboard & Analytics**: Real-time stats widgets, status counts, and category distribution visualizations.
9. **Settings**: System health monitoring and environment connection status indicators.

---

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Update with your MongoDB URI and API keys
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API calls to `http://localhost:5000`.

---

## Documentation

Comprehensive project documentation is available in the [`docs/`](./docs) directory:
- [`AGENTS.md`](./AGENTS.md): Guidance for AI coding assistants and developers
- [`docs/00_PROJECT_CONTEXT.md`](./docs/00_PROJECT_CONTEXT.md): Vision, domain, and feature overview
- [`docs/01_ARCHITECTURE.md`](./docs/01_ARCHITECTURE.md): System architecture and data flow
- [`docs/02_IMPLEMENTATION_PLAN.md`](./docs/02_IMPLEMENTATION_PLAN.md): Feature roadmap and milestones
- [`docs/03_API_REFERENCE.md`](./docs/03_API_REFERENCE.md): API documentation
- [`docs/04_CHANGELOG.md`](./docs/04_CHANGELOG.md): Version history and changes
- [`docs/05_NEXT_TASK.md`](./docs/05_NEXT_TASK.md): Current sprint focus and pending tasks
- [`docs/06_DECISIONS.md`](./docs/06_DECISIONS.md): Architectural Decision Records (ADRs)
- [`docs/07_SETUP.md`](./docs/07_SETUP.md): Installation and configuration guide
