# FreeFit-Frontend

A modern, responsive live sports streaming platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Features live match streaming, real-time chat, sports forums, and a full Django REST API backend.

---

## Tech Stack

| Technology | Version | Purpose |
|:---|:---|:---|
| **Next.js** | 14.2.0 | React framework with App Router |
| **React** | 18.3.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.4.3 | Utility-first CSS framework |
| **Lucide React** | 0.400.0 | Icon library |
| **Django REST Framework** | — | Backend API service |

---

## Project Structure

```
free-fit/
├── app/                          # Next.js App Router
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Landing page (public)
│   ├── globals.css                # Global styles & Tailwind directives
│   ├── home/
│   │   └── page.tsx               # Logged-in user dashboard (live/upcoming/past tabs)
│   ├── forum/
│   │   └── page.tsx               # Forum hub — browse, join, create forums
│   ├── forum/[id]/
│   │   └── page.tsx               # Forum chat room
│   ├── matches/[id]/
│   │   └── page.tsx               # Match detail with stream + live chat
│   └── (auth)/                    # Auth route group
│       ├── signin/
│       │   └── page.tsx           # Login page
│       ├── signup/
│       │   └── page.tsx           # Registration page
│       └── interest/
│           └── page.tsx           # Sport interest selection (post-signup)
│
├── components/                     # Reusable UI components
│   ├── Navbar.tsx                 # Fixed nav with Forum link + icons
│   ├── VideoPlayer.tsx            # Custom HTML5 player with LIVE CHAT sidebar
│   ├── LiveChat.tsx               # Collapsible live chat for streams
│   ├── MatchCard.tsx              # Unified live/upcoming/past match card
│   └── SportSelector.tsx          # Multi-select sport grid
│
├── hooks/                          # Custom React hooks
│   └── useAuth.ts                 # Authentication state management
│
├── lib/                            # Utilities & services
│   └── api.ts                     # API client (auth, dashboard, matches, teams, streams)
│
├── middleware.ts                  # Route protection
├── tailwind.config.ts             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── next.config.js                 # Next.js config (static export)
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies & scripts
```

---

## Pages

### 1. Landing Page (`/`)

**Public page** — No authentication required

**Sections (in order):**

| Section | Description |
|:---|:---|
| **Watch Now Hero** | Full-height auto-rotating image carousel (5 sports images), left/right arrows, dot indicators, "Watch Now" / "Get Started" CTA |
| **Matches Streaming Now** | Featured video player with playlist thumbnails (3 highlight videos) |
| **Live Sports** | Grid of live matches from Dashboard API with scores, team logos, "Watch Live" buttons |
| **Coming Up** | Schedule cards from Dashboard API — sport, league, team names, VS, date/time, bell reminder |
| **All Sports** | 7-category grid (Cricket, Football, Basketball, Volleyball, Hockey, Tennis, Baseball) |
| **Quick Links** | Live Matches, Schedule, Highlights cards |
| **Explore More** | Masonry image grid showcasing sports |
| **Footer** | Free-fit.com logo + Facebook, X (Twitter), Instagram social icons |

**Hero Carousel Features:**
- Auto-rotates every 5 seconds with crossfade
- Manual navigation with left/right arrows
- Dot indicators (active = cyan pill, inactive = white circle)
- Dark overlay for text readability

---

### 2. Home Dashboard (`/home`)

**Protected page** — Requires authentication

**Tabs:**
- **Live Matches** — Fetched from `GET /api/matches/live/`
- **Upcoming** — Fetched from `GET /api/matches/upcoming/`
- **Previous** — Fetched from `GET /api/matches/past/`

**Features:**
- Featured live stream player (auto-fetches from `/api/streams/featured/`)
- Sport filter pills (horizontal scroll)
- Match cards with team logos, scores, status badges
- Loading skeletons while fetching

---

### 3. Forum Hub (`/forum`)

**Protected page** — Requires authentication

**Features:**
- **Your Forums** — Already joined forums with "Enter Chat" button
- **Discover** — New forums to join with "Join Forum" button
- **Create Forum** — Modal with name, description, category, public/private toggle
- **Search** — Filter forums by name/description
- **Category Filter** — All, Football, Basketball, Formula 1, Tennis, MMA, Fantasy, eSports

---

### 4. Forum Chat (`/forum/[id]`)

**Protected page** — Requires authentication

**Features:**
- Real-time-style message list (demo data)
- User avatars + timestamps
- Cyan bubble for "You", dark bubble for others
- Auto-scroll to newest message
- Send via Enter key or send button

---

### 5. Match Detail (`/matches/[id]`)

**Public/Protected** — Stream requires auth if match is live

**Features:**
- Full match info: teams, logos, score, league, sport
- **Live stream player** (only if `is_live=true`)
- **Collapsible Live Chat sidebar** — Toggle open/closed, send messages, like/dislike/reply
- Match status badge: LIVE (red pulse), FT (gray), Upcoming (cyan)

---

### 6. Sign In (`/signin`)

**Public page** — Authenticated users redirected to `/home`

- Email & password form
- JWT token storage (`access_token`, `refresh_token`)
- Error display with Django field-level messages

---

### 7. Sign Up (`/signup`)

**Public page** — Authenticated users redirected to `/home`

- Name, Email, Password, Confirm Password
- Password visibility toggle
- Client-side validation

---

### 8. Interest Selection (`/interest`)

**Protected page** — Post-signup flow

- 12 sports grid
- Multi-select with visual indicators
- Saves to `POST /api/users/me/interests/`

---

## Components

### VideoPlayer (`components/VideoPlayer.tsx`)

Custom HTML5 video player with **integrated Live Chat sidebar**.

**Video Controls:**
- Play/Pause (center overlay + bottom controls)
- Progress bar (clickable seek)
- Time display (current / duration)
- Volume mute/unmute
- Skip forward/backward 10s
- Fullscreen toggle
- Auto-hide controls after 3s inactivity

**Live Chat Sidebar:**
- Collapsible — click `›` to collapse into vertical tab, click tab to reopen
- "LIVE CHAT" red header with pulsing cyan dot
- User avatars, messages, timestamps
- Like / Dislike / Reply buttons per message
- "Add comment" rounded input with send button
- Auto-scroll to bottom on new messages

---

### LiveChat (`components/LiveChat.tsx`)

Standalone collapsible chat component used in both VideoPlayer and Match Detail.

**Props:**
```ts
interface LiveChatProps {
  streamId?: string;  // For API integration
}
```

---

### MatchCard (`components/MatchCard.tsx`)

Unified card for **live**, **upcoming**, and **past** matches.

| Status | Badge | Action |
|:---|:---|:---|
| **Live** | Red "LIVE" pulse | "Watch Live" button |
| **Upcoming** | Cyan "Upcoming" | "Set Reminder" button |
| **Past** | Gray "FT" | "View Highlights" link |

Displays team logos (fetched from backend URLs directly), scores, league, sport.

---

### Navbar (`components/Navbar.tsx`)

**Desktop:**
- Logo (left)
- Nav links: Live, Highlights, Categories, **Forum** (with `MessageSquare` icon)
- Login / User avatar + Logout (right)

**Mobile:**
- Hamburger menu with all links + icons

---

## API Integration (`lib/api.ts`)

### Auth

| Method | Endpoint | Description |
|:---|:---|:---|
| `register(email, password, confirmPassword)` | `POST /auth/register/` | Create account |
| `login(email, password)` | `POST /auth/login/` | Authenticate, store JWT tokens |
| `logout()` | — | Clear tokens, redirect |
| `isAuthenticated()` | — | Check token existence |

### Dashboard (NEW)

| Method | Endpoint | Description |
|:---|:---|:---|
| `dashboardAPI.getDashboard()` | `GET /dashboard/` | Returns `live_matches`, `upcoming_matches`, `past_matches` for homepage |

### Matches (UPDATED)

| Method | Endpoint | Description |
|:---|:---|:---|
| `matchesAPI.getLive()` | `GET /matches/live/` | Live matches |
| `matchesAPI.getUpcoming()` | `GET /matches/upcoming/` | Upcoming matches |
| `matchesAPI.getPast()` | `GET /matches/past/` | Finished matches |
| `matchesAPI.getDetails(id)` | `GET /matches/{id}/` | Single match with stream URL |

> **Status Logic:** `(is_live=true)` = Live, `(is_live=false, is_past=false)` = Upcoming, `(is_past=true)` = Past

### Teams (NEW)

| Method | Endpoint | Description |
|:---|:---|:---|
| `teamsAPI.getTeams()` | `GET /teams/` | List all teams |
| `teamsAPI.getTeam(id)` | `GET /teams/{id}/` | Team details |

### Streams

| Method | Endpoint | Description |
|:---|:---|:---|
| `streamsAPI.getStreams()` | `GET /streams/` | All streams |
| `streamsAPI.getFeatured()` | `GET /streams/featured/` | Featured stream for hero |
| `streamsAPI.getLive()` | `GET /streams/?status=live` | Live streams only |
| `streamsAPI.recordView(id, duration, quality)` | `POST /streams/{id}/view/` | Analytics |

### User

| Method | Endpoint | Description |
|:---|:---|:---|
| `userAPI.getProfile()` | `GET /users/me/` | Current user |
| `userAPI.updateProfile(data)` | `PATCH /users/me/` | Update profile |
| `userAPI.updateInterests(interests)` | `POST /users/me/interests/` | Save sport preferences |

---

## Authentication Flow

```
┌─────────────┐     POST /api/auth/register/     ┌─────────────┐
│   Sign Up   │ ────────────────────────────────► │   Django    │
│  (/signup)  │                                   │   Backend   │
└─────────────┘                                   └─────────────┘
       │                                                  │
       │              { message, next: "/login" }          │
       │◄─────────────────────────────────────────────────│
       ▼                                                  ▼
┌─────────────┐     POST /api/auth/login/         ┌─────────────┐
│   Sign In   │ ────────────────────────────────► │   Django    │
│  (/signin)  │  { email, password }               │   Backend   │
└─────────────┘                                   └─────────────┘
       │                                                  │
       │         { access, refresh, next: "/home" }       │
       │◄─────────────────────────────────────────────────│
       │                                                  │
       │    localStorage.setItem("access_token", access) │
       │    localStorage.setItem("refresh_token", refresh)│
       ▼                                                  ▼
┌─────────────┐                                         ┌─────────────┐
│  Interest   │◄────────── First time users ──────────│   Django    │
│ (/interest) │                                         │   Backend   │
└─────────────┘                                         └─────────────┘
       │                                                  │
       │    POST /api/users/me/interests/                 │
       ▼                                                  ▼
┌─────────────┐     GET /api/dashboard/              ┌─────────────┐
│    Home     │◄─────────────────────────────────────│   Django    │
│   (/home)   │  live_matches, upcoming, past       │   Backend   │
└─────────────┘                                         └─────────────┘
       │                                                  │
       │    GET /api/matches/live/                        │
       │    GET /api/matches/upcoming/                    │
       │    GET /api/matches/past/                        │
       ▼                                                  ▼
┌─────────────┐                                         ┌─────────────┐
│   Forum     │◄─────────────────────────────────────│   Django    │
│  (/forum)   │  browse, join, create forums         │   Backend   │
└─────────────┘                                         └─────────────┘
```

---

## Middleware (`middleware.ts`)

| Route Type | Behavior |
|:---|:---|
| **Protected** (`/home`, `/interest`, `/forum`, `/forum/*`) | Redirect guests to `/signin` |
| **Auth pages** (`/signin`, `/signup`) | Redirect authenticated users to `/home` |
| **Public** (`/`, `/matches/*`) | No restriction |

---

## Environment Variables

Create `.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://free-fit-backend.onrender.com/api

# For local development:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Installation & Development

```bash
# 1. Clone
git clone https://github.com/zidantech/FreeFit-Frontend.git
cd FreeFit-Frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your backend URL

# 4. Run dev server
npm run dev

# 5. Open http://localhost:3000
```

---

## Build for Production

```bash
# Static export
npm run build

# Output: out/
# Deploy to Vercel, Netlify, GitHub Pages, Render, etc.
```

---

## Backend Requirements

Your Django backend must expose:

```
POST   /api/auth/register/
POST   /api/auth/login/
GET    /api/dashboard/              ← NEW
GET    /api/matches/live/
GET    /api/matches/upcoming/       ← NEW
GET    /api/matches/past/           ← NEW
GET    /api/matches/{id}/
GET    /api/teams/                  ← NEW
GET    /api/teams/{id}/           ← NEW
GET    /api/streams/featured/
GET    /api/users/me/
POST   /api/users/me/interests/
GET    /api/sports/
```

**Notes:**
- All endpoints need **trailing slashes** (Django convention)
- CORS must allow your frontend domain
- JWT in `Authorization: Bearer <token>` header
- Render logo URLs directly from backend

---

## Demo Data

Frontend gracefully falls back to demo data when APIs are unavailable:

- **Hero Images:** 5 rotating sports backgrounds
- **Video Highlights:** 3 sample videos with posters
- **Live Matches:** Arsenal vs PSG (2-1), etc.
- **Forum:** 6 demo forums with categories
- **Chat Messages:** Pre-loaded demo conversations

---

## Troubleshooting

### "Expected a dictionary, but got str" (Login 400)

**Cause:** Login form arguments mismatch.  
**Fix:** Ensure `authAPI.login(email, password)` receives two strings, not an object. The API client stringifies them as `{email, password}` before sending.

### CORS Errors

Configure Django:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://freefit-live.vercel.app/",
]
```

### Content Hidden Under Navbar

The landing page hero uses `mt-16`/`mt-20` to push below the fixed navbar. Other pages add `pt-16`/`pt-20` to their main wrapper.

---

## License

Proprietary — FreeFit Development Team

---

_Last Updated: 2026-08-11_  
_Version: 2.0.0_
