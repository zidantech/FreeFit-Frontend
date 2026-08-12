# Free-Fit.com Frontend

A modern, responsive live sports streaming platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

Free-Fit.com is a web application that allows users to stream live sports matches, watch highlights, and follow their favorite teams across multiple sports including Football, Basketball, Tennis, Formula 1, and more.

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2.0 | React framework with App Router |
| **React** | 18.3.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.4.3 | Utility-first CSS framework |
| **Lucide React** | 0.400.0 | Icon library |
| **Django REST API** | - | Backend service |

---

## Project Structure

```
free-fit/
├── app/                          # Next.js App Router
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Landing page (public)
│   ├── globals.css                # Global styles & Tailwind directives
│   ├── home/
│   │   └── page.tsx               # Logged-in user dashboard
│   └── (auth)/                    # Auth route group
│       ├── signin/
│       │   └── page.tsx           # Login page
│       ├── signup/
│       │   └── page.tsx           # Registration page
│       └── interest/
│           └── page.tsx           # Sport interest selection (post-signup)
│
├── components/                     # Reusable UI components
│   ├── Navbar.tsx                 # Responsive navigation with mobile hamburger
│   ├── VideoPlayer.tsx            # Custom HTML5 video player with controls
│   ├── MatchCard.tsx              # Live/ended match card with team logos & scores
│   └── SportSelector.tsx          # Multi-select sport grid with selection states
│
├── hooks/                          # Custom React hooks
│   └── useAuth.ts                 # Authentication state management hook
│
├── lib/                            # Utilities & services
│   └── api.ts                     # API service layer (all backend endpoints)
│
├── middleware.ts                  # Next.js middleware (route protection)
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── next.config.js                 # Next.js configuration (static export)
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies & scripts
```

---

## Pages

### 1. Landing Page (`/`)
**Public page** - No authentication required

**Sections:**
- **Video Highlights Player** — Featured sports highlights with playlist
  - 3 demo videos (Football Goals, F1 Monaco GP, Champions League Final)
  - Custom video controls (play/pause, seek, volume, fullscreen)
  - Click playlist items to switch videos
- **Live Sports CTA** — Full-width banner with background image
  - "Watch Now" (authenticated) or "Get Started" (guest) button
- **Quick Links** — Live Matches, Schedule, Highlights cards
- **Sports Grid** — Masonry layout showcasing all available sports
- **Footer** — Copyright notice

**Responsive Behavior:**
- Mobile: Single column layouts, stacked video playlist, hamburger nav
- Tablet: 2-column grids, side-by-side elements
- Desktop: Full 4-column sports grid, horizontal layouts

---

### 2. Sign In (`/signin`)
**Public page** — Authenticated users redirected to `/home`

**Features:**
- Email & password form with validation
- "Remember Me" checkbox
- "Forgot Password?" link (placeholder)
- Google OAuth button (UI only)
- Link to Sign Up page
- Error display for failed login attempts
- Loading state on submit

**API Integration:**
```
POST /api/auth/login/
Body: { email, password }
Response: { access, refresh, next }
```

---

### 3. Sign Up (`/signup`)
**Public page** — Authenticated users redirected to `/home`

**Features:**
- Name, Email, Password, Confirm Password fields
- Password visibility toggle (eye icon)
- Client-side validation (password match, min 8 chars)
- Google OAuth button (UI only)
- Link to Login page
- Background image with dark overlay

**API Integration:**
```
POST /api/auth/register/
Body: { email, password, confirm_password }
Response: { message, next }
```

**Post-Registration Flow:**
```
Sign Up → Interest Page → Home Dashboard
```

---

### 4. Interest Selection (`/interest`)
**Protected page** — Requires authentication

**Purpose:** New users select favorite sports for personalized content

**Features:**
- Grid of 12 sports (Football, Tennis, Basketball, Cricket, Hockey, Golf, Baseball, Wrestling, Formula 1, Boxing, Rugby, Athletics)
- Multi-select with visual indicators (checkmarks, cyan border)
- "Continue" button saves preferences to API
- "Skip for now" option
- Counter showing selected count

**API Integration:**
```
POST /api/users/me/interests/
Body: { interests: ["football", "basketball"] }
```

**Fallback:** Uses default sports list if API unavailable

---

### 5. Home Dashboard (`/home`)
**Protected page** — Requires authentication

**Main Features:**

#### Video Player Section
- Full-width featured live stream player
- Auto-fetches from `/api/streams/featured/`
- Falls back to demo video if API unavailable

#### Sport Selector
- Horizontal scrollable pills
- "All Sports" + individual sport filters
- Filters live & previous matches by selected sport
- Mobile: horizontal scroll with no scrollbar

#### Live Matches Tab
- Real-time match cards with:
  - Team logos (left & right)
  - Live scores (center, large font)
  - "LIVE" badge with pulsing red dot
  - League name
  - "Watch Live" button (links to stream)
- Demo data: Arsenal vs Man Utd, Real Madrid vs Barcelona, Liverpool vs Chelsea

#### Previous Matches Tab
- Same card layout but with "FT" (Full Time) badge
- Final scores displayed
- No action button
- Demo data: Bayern vs Dortmund, Juventus vs AC Milan, etc.

#### Trending Highlights
- 3-column grid of highlight thumbnails
- Duration badges, view counts
- Hover play button overlay
- Links to full highlight pages

**API Endpoints Used:**
```
GET /api/matches/live/
GET /api/matches/previous/
GET /api/streams/featured/
GET /api/sports/
```

---

## Components

### Navbar (`components/Navbar.tsx`)

**Desktop:**
- Logo (left)
- Nav links: Live, Highlights, Categories (center)
- Login button or User avatar + Logout (right)

**Mobile (`< 768px`):**
- Hamburger menu icon
- Slide-down menu with all links
- Auth buttons in menu
- Close with X icon

**Auth States:**
- Guest: Shows "Login" button
- Authenticated: Shows user avatar + logout button

---

### VideoPlayer (`components/VideoPlayer.tsx`)

Custom HTML5 video player with:
- Play/Pause toggle (center overlay + controls)
- Progress bar (clickable seek)
- Time display (current / duration)
- Volume mute/unmute
- Skip forward/backward 10s
- Fullscreen toggle
- Auto-hide controls after 3 seconds of inactivity
- Keyboard-friendly controls

**Props:**
```typescript
interface VideoPlayerProps {
  src: string;           // Video URL
  poster?: string;       // Thumbnail image
  autoPlay?: boolean;    // Default: false
  className?: string;    // Additional classes
}
```

---

### MatchCard (`components/MatchCard.tsx`)

Reusable match display card:

**Live State:**
- Pulsing red "LIVE" badge
- Current score (large, monospace)
- "Watch Live" action button

**Ended State:**
- "FT" (Full Time) badge
- Final score
- No action button

**Upcoming State:**
- Start time display
- "VS" instead of score
- No action button

**Props:**
```typescript
interface MatchCardProps {
  id: string;
  teams: [Team, Team];           // Home & away teams
  status: "live" | "upcoming" | "ended";
  league?: string;               // League name
  startTime?: string;            // ISO 8601
  streamUrl?: string;            // For live matches
  isPremium?: boolean;
}
```

---

### SportSelector (`components/SportSelector.tsx`)

Multi-select sport grid:
- 2-4 column responsive grid
- Sport icon + name per item
- Selected state: cyan border, checkmark badge, highlighted text
- Toggle selection on click

**Props:**
```typescript
interface SportSelectorProps {
  sports: Sport[];
  selected: string[];            // Selected sport slugs
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;         // Default: true
}
```

---

## API Service (`lib/api.ts`)

Centralized API client for Django backend.

### Configuration
```
Base URL: https://free-fit-backend.onrender.com/api
Auth: Bearer JWT token (localStorage)
Content-Type: application/json
```

### Auth Module (`authAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `register()` | `POST /auth/register/` | Create new account |
| `login()` | `POST /auth/login/` | Authenticate, store tokens |
| `logout()` | — | Clear tokens, redirect |
| `isAuthenticated()` | — | Check token existence |
| `getTokens()` | — | Retrieve access & refresh |

**Token Storage:**
- `localStorage.access_token` — JWT access token
- `localStorage.refresh_token` — JWT refresh token
- `localStorage.user` — Cached user profile
- `localStorage.interests` — Selected sports
- `localStorage.remember_me` — Remember preference

### User Module (`userAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getProfile()` | `GET /users/me/` | Current user data |
| `updateProfile()` | `PATCH /users/me/` | Update profile fields |
| `updateInterests()` | `POST /users/me/interests/` | Save sport preferences |

### Streams Module (`streamsAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getStreams()` | `GET /streams/` | List all streams |
| `getStream(id)` | `GET /streams/:id/` | Single stream details |
| `getFeatured()` | `GET /streams/featured/` | Featured streams |
| `getLive()` | `GET /streams/?status=live` | Live only |
| `recordView()` | `POST /streams/:id/view/` | Analytics tracking |

### Matches Module (`matchesAPI`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getLiveMatches()` | `GET /matches/live/` | Currently live matches |
| `getPreviousMatches()` | `GET /matches/previous/` | Finished matches |
| `getMatchDetails(id)` | `GET /matches/:id/` | Single match details |

### Other Modules

- `scheduleAPI` — Event scheduling & reminders
- `highlightsAPI` — Match highlights & replays
- `newsAPI` — Sports news articles
- `sportsAPI` — Sports categories & leagues

### Error Handling

All API methods:
- Throw errors with descriptive messages
- Auto-retry on 401 with token refresh
- Console log errors for debugging

---

## Authentication Flow

```
┌─────────────┐     POST /api/auth/register/     ┌─────────────┐
│   Sign Up   │ ─────────────────────────────────►│   Django    │
│   (/signup) │                                   │   Backend   │
└─────────────┘                                   └─────────────┘
       │                                                  │
       │              { message, next: "/login" }          │
       │◄─────────────────────────────────────────────────│
       │                                                  │
       ▼                                                  ▼
┌─────────────┐     POST /api/auth/login/        ┌─────────────┐
│   Sign In   │ ─────────────────────────────────►│   Django    │
│   (/signin) │  { email, password }               │   Backend   │
└─────────────┘                                   └─────────────┘
       │                                                  │
       │         { access, refresh, next: "/home" }       │
       │◄─────────────────────────────────────────────────│
       │                                                  │
       │    localStorage.setItem("access_token", access)  │
       │    localStorage.setItem("refresh_token", refresh)│
       ▼                                                  ▼
┌─────────────┐                                         ┌─────────────┐
│  Interest   │◄────────── First time users ──────────│   Django    │
│  (/interest)│                                         │   Backend   │
└─────────────┘                                         └─────────────┘
       │                                                  │
       │    POST /api/users/me/interests/                 │
       │    { interests: ["football", "tennis"] }         │
       ▼                                                  ▼
┌─────────────┐                                         ┌─────────────┐
│    Home     │◄────────── Authenticated API ──────────│   Django    │
│   (/home)   │    Authorization: Bearer <token>        │   Backend   │
└─────────────┘                                         └─────────────┘
```

---

## Middleware (`middleware.ts`)

Route protection using Next.js middleware:

| Route Type | Behavior |
|-----------|----------|
| **Protected** (`/home`, `/interest`) | Redirect guests to `/signin` |
| **Auth pages** (`/signin`, `/signup`) | Redirect authenticated users to `/home` |
| **Public** (`/`, `/about`) | No restriction |

**Checks:** `cookies.access_token` existence

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| **Mobile** | < 640px | Single column, hamburger nav, stacked elements |
| **Tablet** | 640px - 1024px | 2-column grids, side-by-side forms |
| **Desktop** | > 1024px | Full layouts, 3-4 column grids, horizontal nav |

**Key Responsive Patterns:**
- Navigation: Hamburger menu on mobile, horizontal links on desktop
- Sports grid: 2 cols (mobile) → 4 cols (desktop)
- Match cards: 1 col (mobile) → 3 cols (desktop)
- Video player: Full width with stacked playlist (mobile), side playlist (desktop)
- Text sizes: `text-sm` (mobile) → `text-base` (desktop)
- Padding: `px-4` (mobile) → `px-6` (desktop)

---

## Environment Variables

Create `.env.local` from `.env.local.example`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://free-fit-backend.onrender.com/api

# For local development:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Note:** `NEXT_PUBLIC_` prefix required for client-side access

---

## Installation & Development

```bash
# 1. Clone or extract project
cd free-fit

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your backend URL

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## Build for Production

```bash
# Static export (configured in next.config.js)
npm run build

# Output directory: out/
# Deploy out/ to any static hosting (Vercel, Netlify, GitHub Pages)
```

---

## Backend Requirements

Your Django backend must expose these endpoints:

### Authentication
```
POST /api/auth/register/      → { email, password, confirm_password }
POST /api/auth/login/          → { email, password }
                               ← { access, refresh, next }
```

### User Profile
```
GET    /api/users/me/          → User profile data
PATCH  /api/users/me/          → Update profile
POST   /api/users/me/interests/ → { interests: string[] }
```

### Matches
```
GET /api/matches/live/         → Array of live matches
GET /api/matches/previous/     → Array of finished matches
GET /api/matches/:id/          → Single match details
```

### Streams
```
GET /api/streams/              → Array of streams
GET /api/streams/featured/     → Featured stream
GET /api/streams/:id/          → Single stream
```

### Sports
```
GET /api/sports/               → Array of sports
```

**Important:**
- All endpoints need **trailing slashes** (Django convention)
- CORS must allow your frontend domain
- JWT tokens in `Authorization: Bearer <token>` header

---

## Demo Data

The frontend includes demo data for development before backend is ready:

- **Live Matches:** Arsenal vs Man Utd, Real Madrid vs Barcelona, Liverpool vs Chelsea
- **Previous Matches:** Bayern vs Dortmund, Juventus vs AC Milan, PSG vs Marseille
- **Sports:** 12 sports with icons from Flaticon
- **Videos:** Google Storage sample videos (Big Buck Bunny variants)

Demo data automatically used when API calls fail.

---

## Customization

### Adding New Sports
Edit `defaultSports` array in:
- `app/(auth)/interest/page.tsx`
- `app/home/page.tsx`

```typescript
{ id: "13", name: "Volleyball", slug: "volleyball", icon: "https://..." }
```

### Changing Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  "brand-dark": "#0a0e27",     // Background
  "brand-cyan": "#00d4ff",     // Primary accent
}
```

### Adding New Pages
Create folder in `app/`:
```
app/new-page/
└── page.tsx
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome for Android

---

## Performance Notes

- Images use `loading="lazy"` for below-fold content
- Videos use `playsInline` for mobile autoplay
- API calls cached in localStorage where appropriate
- Static export for fast CDN delivery
- Responsive images with multiple sizes

---

## Troubleshooting

### CORS Errors
Ensure Django backend has CORS configured:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-frontend-domain.com",
]
```

### API Not Responding
Frontend automatically falls back to demo data. Check browser console for error details.

### JWT Token Expired
Frontend auto-refreshes tokens on 401 responses. If refresh fails, user is redirected to login.

### Mobile Menu Not Working
Ensure JavaScript is enabled. Menu uses React state (`useState`) for toggle.

---

## License

Proprietary — Free-Fit Development Team

## Contact

- Frontend Issues: frontend-team@free-fit.com
- Backend API: https://free-fit-backend.onrender.com
- Deployment: Render / Vercel / Netlify

---

*Last Updated: 2026-05-16*
*Version: 1.0.0*
