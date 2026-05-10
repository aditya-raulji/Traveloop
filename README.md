# 🌍 Traveloop — Plan Your Perfect Journey

> **Traveloop** is a cinematic, full-stack travel planning platform that lets you plan trips, manage budgets, discover activities, and share stories with fellow travelers.

---

## 🔗 Live Demo

[https://traveloop.vercel.app](https://traveloop.vercel.app)

---

## 📸 Screenshots

| Landing Page | Dashboard | Itinerary Builder |
|---|---|---|
| Cinematic hero with parallax | Trip cards with status badges | Day-by-day drag & drop planner |

---

## ✨ Features

- 🗺 **Trip Management** — Create, edit, and organize multi-city trips with status tracking
- 📅 **Itinerary Builder** — Drag-and-drop day-by-day activity planner with time slots
- 💰 **Budget Tracker** — Expense tracking with pie charts and budget vs. actual comparison
- ✅ **Packing Checklist** — Custom templates (Beach, Business, Adventure) with progress tracking
- 🌆 **City Explorer** — Browse and discover cities with AI-powered activity search
- 🗒 **Trip Notes / Journal** — Day-by-day travel journal with inline editing
- 🌐 **Community Feed** — Share trip stories with ratings, photos, and likes
- 👤 **User Profile** — Bio, saved destinations, trip history, and settings
- 🔐 **Authentication** — Email/password and Google OAuth via NextAuth.js
- 🛡 **Admin Dashboard** — Full user/trip management with Recharts analytics
- 📄 **PDF Export** — Generate professional trip reports with `@react-pdf/renderer`
- 📱 **Fully Responsive** — Mobile-first design across all 14 screens

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma v7 |
| **Auth** | NextAuth.js v4 |
| **Animations** | Framer Motion |
| **Drag & Drop** | @dnd-kit |
| **Charts** | Recharts |
| **PDF** | @react-pdf/renderer |
| **UI Components** | Radix UI Primitives |
| **Deployment** | Vercel |

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
DATABASE_URL=postgresql://...        # Supabase pooled connection
DIRECT_URL=postgresql://...          # Supabase direct connection
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...                 # Optional: for Google OAuth
GOOGLE_CLIENT_SECRET=...
SUPABASE_URL=https://....supabase.co
SUPABASE_ANON_KEY=...
```

### 4. Push schema and seed data

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗄 Database Schema Overview

| Model | Description |
|---|---|
| `User` | Accounts with roles (user/admin), saved cities, language prefs |
| `Trip` | Core trip with title, dates, cover image, public/private |
| `TripStop` | Stop within a trip linked to `City` model |
| `City` | City reference data with country, continent, avg cost |
| `Activity` | Available activities linked to cities |
| `StopActivity` | Junction: activity assigned to a stop/day with time & cost |
| `Expense` | Individual expense records linked to trips or stops |
| `TripNote` | Journal notes attached to a trip, optionally by day |
| `PackingChecklist` | Checklist items for a trip |
| `CommunityPost` | User-shared trip stories with rating and images |
| `Budget` | Structured budget breakdown per trip |

---

## 📋 All 14 Screens

1. Landing / Hero Page
2. Sign In / Sign Up
3. Dashboard (My Trips)
4. New Trip Creation Wizard
5. City & Activity Explorer
6. Itinerary Builder (drag & drop)
7. User Profile & Settings
8. Budget Tracker
9. Packing Checklist
10. Community Feed
11. Trip Notes / Journal
12. Admin Dashboard
13. Public Trip Share Page
14. 404 / Error Pages

---

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Set environment variables (see above)
4. Deploy!

To make yourself an admin after deployment, run in the Supabase SQL Editor:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📄 License

MIT © Traveloop
