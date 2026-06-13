# 📓 Retroleaf — Retro Digital Journal App

> A full-stack MERN journaling app with a warm typewriter/CRT-terminal aesthetic. Track moods, build writing streaks, search your memories, and make journaling a daily ritual.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/cloud/atlas)

---

## 🔗 Live Demo

- **Frontend:** [https://retro-leaf.vercel.app](https://retro-leaf.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | JWT-based auth with httpOnly cookies and bcrypt password hashing |
| 🔥 **Writing Streaks** | Automatically tracks current and longest daily journaling streaks |
| 🎭 **Mood Tracking** | Tag each entry with a mood and view a visual mood breakdown on the dashboard |
| 🔍 **Full-Text Search & Filters** | Search by title, content, or tags; filter by mood or favorites with pagination |
| 🎲 **Memory Lane** | Get surprised by a random entry from your journaling past |
| ⭐ **Favorites & Tags** | Star important entries and organize them with custom tags |
| 🎨 **Profile Customization** | Choose an avatar emoji and a retro color theme (amber, mint, purple, blue) |
| 🛡️ **IP-Based Rate Limiting** | General API limiter, stricter auth limiter (anti brute-force), and entry-creation limiter (anti-spam) |
| 📊 **Site Visit Analytics** | Tracks total visits, unique visitors, and last-24h activity by IP |

---

## 🛠 Tech Stack

### Frontend
- **React 18** (Vite) — fast dev server and optimized build tooling
- **React Router v6** — client-side routing
- **Tailwind CSS v3** — utility-first styling with custom retro design tokens
- **Axios** — API communication with cookie-based auth (`withCredentials: true`)

### Backend
- **Node.js + Express** — REST API server
- **MongoDB + Mongoose** — database and schema modeling
- **JWT (jsonwebtoken)** — stateless authentication tokens
- **bcryptjs** — secure password hashing
- **express-rate-limit** — IP-based request throttling
- **cookie-parser** — httpOnly cookie handling

### Fonts
- **Special Elite** — typewriter-style display font for headings
- **Space Mono** — monospace body font for UI elements
- **Lora** — serif font for journal entry content

---

## 📁 Project Structure

```
retro-journal/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # auth, entry, visit logic
│   ├── middleware/               # auth, error handler, rate limiters, visit logger
│   ├── models/                   # User, Entry, Visit schemas
│   ├── routes/                   # API route definitions
│   ├── utils/generateToken.js
│   ├── server.js                 # App entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/           # Navbar, Footer, EntryCard, StreakWidget, etc.
    │   ├── context/AuthContext.jsx
    │   ├── pages/                # Landing, Login, Register, Dashboard, etc.
    │   ├── utils/api.js          # Axios instance
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── .env.example
```

---

## ⚙️ How It Works

### Authentication Flow
1. User registers/logs in → backend validates credentials and hashes passwords with **bcrypt**
2. On success, a **JWT** is generated and stored in an **httpOnly cookie** (not accessible via JavaScript, protecting against XSS)
3. Every protected request automatically includes this cookie (`withCredentials: true` in Axios)
4. The `authMiddleware` verifies the token on the backend and attaches the user to `req.user`

### Journal Entries
- Each entry belongs to a user (`Entry.user` references `User._id`)
- Entries support: **title, content, mood, tags, favorite status, privacy flag, and weather**
- **MongoDB text indexes** on `title`, `content`, and `tags` power the full-text search feature

### Streak System
Every time a new entry is created, `updateStreak()` checks the date of the last entry:
- **Same day** → streak unchanged
- **Consecutive day** → streak +1
- **Gap of 2+ days** → streak resets to 1
- **Longest streak** is preserved even if the current streak resets

### Rate Limiting (IP-Based)
| Limiter | Limit | Window | Purpose |
|---|---|---|---|
| General | 100 requests | 15 min | All `/api` routes |
| Auth | 10 requests | 15 min | Login/Register — brute-force protection |
| Entry Creation | 15 entries | 1 min | Spam protection |

### Visit Analytics
A lightweight middleware logs each visiting IP with timestamp and path. The `/api/visits/stats` endpoint aggregates **total visits**, **unique IPs**, and **visits in the last 24 hours**.

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/retro-journal.git
cd retro-journal
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env     # Fill in your environment variables
npm install
npm start
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env     # Set VITE_API_URL
npm install
npm run dev
```

- Frontend runs at `http://localhost:5173`
- Backend runs at `http://localhost:5000`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/retro_journal` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret for signing JWTs | Generate with `openssl rand -hex 32` |
| `JWT_EXPIRE` | Token expiry duration | `7d` |
| `CLIENT_URL` | Frontend URL (for CORS) | `https://retroleaf.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window per IP | `100` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://example-api.onrender.com/api` |

---

## ☁️ Deployment

### Database — MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Database Access** → add a database user (username/password)
3. **Network Access** → allow access from anywhere (`0.0.0.0/0`)
4. Copy the connection string and append your DB name, e.g. `.../retro_journal?retryWrites=true&w=majority`

### Backend — Render
1. Push your code to GitHub
2. On [render.com](https://render.com) → **New → Web Service** → connect your repo
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add all environment variables from the table above
5. Deploy — copy the resulting URL (e.g. `https://example-api.onrender.com`)

### Frontend — Vercel
1. On [vercel.com](https://vercel.com) → **New Project** → import your repo
2. Configure:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add `VITE_API_URL` pointing to your Render backend URL
4. Deploy — copy the resulting URL (e.g. `https://retroleaf.vercel.app`)

### Final Step — Link Frontend & Backend
Go back to **Render** → update `CLIENT_URL` to your Vercel URL (no trailing slash). Render will auto-redeploy. Test by registering an account on your live frontend.

---

## 🧪 API Reference

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public (rate limited) |
| `POST` | `/api/auth/login` | Log in | Public (rate limited) |
| `POST` | `/api/auth/logout` | Log out | Private |
| `GET` | `/api/auth/me` | Get current user | Private |
| `PUT` | `/api/auth/profile` | Update avatar / theme / password | Private |

### Entries
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/entries` | List entries (search / filter / pagination) | Private |
| `POST` | `/api/entries` | Create entry | Private (rate limited) |
| `GET` | `/api/entries/stats` | Mood breakdown + streak data | Private |
| `GET` | `/api/entries/random` | Random past entry | Private |
| `GET` | `/api/entries/:id` | Get one entry | Private |
| `PUT` | `/api/entries/:id` | Update entry | Private |
| `DELETE` | `/api/entries/:id` | Delete entry | Private |

### Analytics
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/visits/stats` | Site visit analytics | Public |

---

## 🎨 Design Philosophy

Retroleaf draws from **typewriters and CRT monitors** — warm amber tones, a dark scanline-textured background, and serif body text for that "handwritten journal" feel. The blinking cursor and monospace UI elements reinforce the nostalgic terminal aesthetic without sacrificing modern usability or responsiveness.

**Color themes available:** Amber · Mint · Purple · Blue

---

## Internship Context

> Developed as part of the **CodTech IT Solutions** internship program.
>
> **Intern:** Vikas Sharma | **ID:** CITS2901 | **Duration:** 4 Weeks

---

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---