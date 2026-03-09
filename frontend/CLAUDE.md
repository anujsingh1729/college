# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at http://localhost:3000
npm run build    # Production build
npm test         # Run tests (interactive watch mode)
npm test -- --watchAll=false  # Run tests once (CI mode)
```

## Architecture

**CollegeEdge** is a React app that lets parents create personalized college readiness plans for their children. It's a Create React App project using React 19, React Router v7, Axios, and Tailwind CSS v4.

### User Flow
1. **Home** (`/`) — Landing page with CTA linking to Profile
2. **Profile** (`/profile`) — Form collecting child's name, grade, interests, dream colleges, career goals; POSTs to backend at `http://localhost:8001/generate-plan`
3. **Dashboard** (`/dashboard`) — Displays the AI-generated plan from `localStorage`

### Key Details
- The backend API runs on `http://localhost:8001`. The single endpoint is `POST /generate-plan`.
- The generated plan is stored in `localStorage` under the keys `plan` (JSON object) and `childName` (string). Dashboard redirects to `/profile` if no plan is found.
- The plan response shape expected by Dashboard: `{ activities, volunteering, summer_programs, skills_certifications, monthly_tracker, essay_topics }` — each an array of strings.
- Styling uses Tailwind CSS v4 (configured via `postcss.config.js` and `tailwind.config.js`), with an indigo color theme throughout.
- No global state management — state flows through `localStorage` between Profile and Dashboard.
