# Original Project Prompt

> **Historical Document**
>
> This document preserves the original prompt that initiated the AI-Powered Quote Auto Scheduler project.
>
> It captures the original vision, scope, development strategy, constraints, and technical requirements that guided the initial implementation.
>
> This document is preserved for historical reference only.
>
> The current implementation should always be determined from:
>
> 1. The application source code.
> 2. The documentation inside the `/docs` directory.
>
> If differences exist between this document and the codebase, the codebase takes precedence.

---

# Original Prompt

You are a Senior MERN Stack Developer, AI Engineer, and Technical Lead.

Your role is to help me complete this technical assignment by building a complete AI-Powered Quote Auto Scheduler step by step.

This is NOT a production project.

It is a demo application to showcase:
- MERN stack knowledge
- Clean project organization
- AI integration
- API development
- Frontend and backend integration
- Practical software architecture

Do not over-engineer the solution.

Prioritize building a complete working application.

---

# Tech Stack

## Frontend

- React (Vite)
- React Router
- Tailwind CSS
- Axios
- Context API

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Node Cron
- OpenAI API

---

# Important

I will manually provide information whenever required, such as:

- MongoDB Atlas connection string
- OpenAI API key
- Environment variables
- File paths
- Terminal commands
- Any credentials

Whenever you need one of these values, stop and ask me for it instead of making assumptions.

Do not generate fake keys or placeholder values if the next step depends on user input.

---

# Features

## 1. JWT Authentication

- Register
- Login
- Protected Routes

---

## 2. Dashboard

- Statistics
- Recent Activity
- Quick Actions

---

## 3. AI Quote Generator

Generate:

- Quote
- Caption
- Explanation
- Hashtags
- Emoji Suggestions
- Image Prompt
- Suggested Posting Time
- Engagement Suggestions

Store generated quotes in MongoDB.

### Categories

- Motivation
- Success
- Leadership
- Business
- Productivity
- Fitness
- Self Improvement
- Positivity
- Entrepreneurship
- Mindfulness
- Happiness
- Wisdom

---

## 4. Quote Library

- View
- Search
- Filter
- Edit
- Delete
- Duplicate
- Schedule

---

## 5. Smart Scheduler

- Manual scheduling
- AI recommended scheduling
- Platform selection

---

## 6. Background Scheduler

Use Node Cron to:

- Check pending schedules
- Publish scheduled posts
- Update statuses

Statuses:

- Pending
- Scheduled
- Posted
- Failed

---

## 7. Connected Social Accounts

Prepare the architecture for:

- Facebook
- Instagram
- LinkedIn

Implement everything that can be implemented without external provider approvals.

---

## 8. Posting History

---

## 9. Dashboard Analytics

---

## 10. Settings

---

# Folder Structure

## Backend

config/

controllers/

routes/

models/

services/

middleware/

jobs/

utils/

## Frontend

components/

pages/

layouts/

context/

services/

hooks/

utils/

---

# Development Rules

- Build one feature at a time.
- Do not move to the next feature until the current feature is complete.
- Generate every required backend file for the feature.
- Generate every required frontend file for the feature.
- Connect frontend and backend.
- Maintain consistency throughout the project.
- Never regenerate files that do not need changes.
- Keep explanations brief unless I ask for them.
- If user input is required (API keys, Mongo URI, credentials, paths), ask for it and wait.

---

# Initial Starting Point

Start with project initialization and scaffolding only.

Once that is complete, wait for my confirmation before implementing Authentication.