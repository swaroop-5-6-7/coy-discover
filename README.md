# Coy — Discover Tab Prototype

A mobile-first swipe discovery feature built alongside Coy's existing experience using **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, and **SQLite (`better-sqlite3`)**.

## Features
- **Coy-Matched UI:** Clean light-mode, pastel-accented, neo-brutalist interface matching Coy's brand identity.
- **Tab Navigation:** Includes a blank **Home** placeholder tab, the interactive **Discover** swipe deck, and a **Matches** list view.
- **Swipe Experience:** Smooth touch/mouse drag gestures on mobile and dedicated **Pass** / **Like** buttons on desktop, with clear visual stamps and an empty state once all profiles are reviewed.
- **Privacy-First Matching:** Pre-seeded likes (`has_liked_me`) remain strictly server-side in SQLite and are never exposed in `/api/feed`. Only mutual likes trigger an **"It's a match!"** modal and appear in `/api/matches`.
- **SQLite Persistence:** Swipes and mutual matches persist across page reloads in a local SQLite database (`coy.db`), automatically seeded with 32 profiles on first startup.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Next.js API Routes (Node.js)
- **Database:** SQLite via `better-sqlite3`

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install