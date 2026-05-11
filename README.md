# Airbnb-style listings app

A full-stack **Node.js** learning project inspired by Airbnb: browse vacation rentals, save favourites, book stays as a **guest**, or manage listings as a **host**. Server-rendered pages use **EJS**, data lives in **MongoDB** via **Mongoose**, and sessions (including file uploads metadata) are backed by the same database.

---

## Features

| Area | What you can do |
|------|------------------|
| **Browse** | Home page and `/homes` list; property detail at `/homes/:homeId`. |
| **Auth** | Sign up (guest or host), log in, log out. Passwords hashed with **bcryptjs**; signup validated with **express-validator**. |
| **Guests** | Book a home with check-in / check-out, nights, optional **discount %**, and **My Bookings** at `/bookings`. |
| **Favourites** | Add/remove homes; view list at `/favourites` (intended for logged-in users). |
| **House rules** | Hosts can attach an optional **PDF**; guests download from `/rules/:homeId` when logged in. |
| **Hosts** | Under `/host`: add listing (photo required; rules optional), edit, delete, and see **Host Homes List**. Routes are protected: you must be logged in. |
| **Uploads** | Listing photos (PNG/JPG/JPEG) stored under `uploads/`; optional rules PDF under `rules/`. |

> **Role behaviour:** Booking and guest-only flows use `userType === "guest"`. If a **host** hits a guest-only booking URL, they are redirected to `/host/host-home-list`.

---

## Tech stack

- **Runtime:** Node.js (CommonJS)
- **Web:** [Express](https://expressjs.com/) 5, [EJS](https://ejs.co/) views
- **Database:** [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Sessions:** [express-session](https://github.com/expressjs/session) + [connect-mongo](https://github.com/jdesboeufs/connect-mongo) (collection `sessions`)
- **Files:** [Multer](https://github.com/expressjs/multer) (disk storage, filtered MIME types)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) 3.x, built from `views/input.css` → `public/output.css`
- **Dev workflow:** [nodemon](https://nodemon.io/) + [concurrently](https://github.com/open-cli-tools/concurrently) for server + Tailwind watch

## Architecture

SSR: server owns routes + DB + EJS; public/ is static assets.

---

## Prerequisites

- **Node.js** (LTS recommended)
- A **MongoDB** instance and connection string (local [MongoDB Community](https://www.mongodb.com/try/download/community), [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), or Docker, etc.)

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd airbnb
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (same folder as `app.js`):

```env
MONGO_URL=mongodb://127.0.0.1:27017/airbnb
SESSION_SECRET=use-a-long-random-string-in-production
```

| Variable | Purpose |
|----------|---------|
| `MONGO_URL` | MongoDB connection URI used by Mongoose and the session store. |
| `SESSION_SECRET` | Secret for signing the session cookie. |

> **Security:** Never commit `.env` or real secrets to Git. Add `.env` to `.gitignore` if it is not already ignored.

### 3. Ensure upload directories exist

The app writes to `uploads/` (images) and `rules/` (optional PDFs). If they are missing, create them:

```bash
mkdir uploads rules
```

### 4. Run the app

```bash
npm start
```

This runs **nodemon** on `app.js` and **Tailwind** in watch mode (see `package.json` scripts).

- **App:** [http://localhost:3000](http://localhost:3000)

---

## Project structure (high level)

```
airbnb/
├── app.js                 # Express app, session, multer, MongoDB connect
├── controllers/           # Route handlers (auth, store, host, errors)
├── models/                # Mongoose schemas: User, Home, Booking
├── routes/                # authRouter, storeRouter, hostRouter
├── views/                 # EJS templates + Tailwind source (input.css)
├── public/                # Static assets (compiled output.css)
├── uploads/               # Listing images (generated filenames)
├── rules/                 # Optional house-rules PDFs
└── utils/pathUtil.js      # Root path helper
```

---

## Useful routes

| Method | Path | Notes |
|--------|------|--------|
| GET | `/` | Landing / featured listings |
| GET | `/homes` | All listings |
| GET | `/homes/:homeId` | Listing detail |
| GET/POST | `/login`, `/signup`, `/logout` | Authentication |
| GET | `/bookings` | Guest: my bookings |
| GET/POST | `/book/:homeId` | Guest: booking form and submit |
| GET | `/favourites` | Favourites list |
| POST | `/favourites` | Add to favourites |
| POST | `/favourites/delete/:homeId` | Remove |
| GET | `/rules/:homeId` | Download house rules PDF (logged in) |
| * | `/host/*` | Host CRUD (requires login) |

---

## Signup password rules

Signup uses strict validation (see `controllers/authController.js`): minimum length, upper/lowercase, digit, and a special character from **`!` `@` `&`** only, plus matching confirm password and terms acceptance.

---

## Scripts

| Script | Command |
|--------|---------|
| Start dev (server + Tailwind) | `npm start` |
| Tailwind only (watch) | `npm run tailwind` |
| Tests | Not configured (`npm test` is a placeholder) |

---

## License

ISC (per `package.json`). Adjust if you publish under a different license.

---

## Acknowledgements

Built as a **Node course** chapter project (`chapter-10---airbnb` in `package.json`). Naming and UX are educational references to Airbnb, not an official Airbnb product.
