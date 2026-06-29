# Dap – Black Business Directory

**Dap** is a Yelp-like web app focused on discovering, celebrating, and supporting Black-owned businesses across America.

![Home Page](https://github.com/user-attachments/assets/40bb664c-b781-423f-a9dd-df20fb0c494a)

## Features

- 🔍 **Search & Filter** – Find businesses by name, description, or category
- 🗂️ **Category Browse** – Filter by Food & Dining, Beauty & Wellness, Shopping, Arts & Entertainment, Health & Fitness, Books & Education, Media & Tech
- ⭐ **Ratings & Reviews** – View and submit star ratings with written reviews
- ➕ **Add Your Business** – Free listing form for Black business owners
- 📍 **Business Detail Pages** – Full info including address, phone, website, owner name, and reviews

## Screenshots

| Browse Listings | Business Detail | Add a Business |
|---|---|---|
| ![Listings](https://github.com/user-attachments/assets/6b9d0c38-09a9-44e1-a85d-3ae86e65b427) | ![Detail](https://github.com/user-attachments/assets/93377bd2-f9bb-49de-9898-80846014c5ff) | ![Add](https://github.com/user-attachments/assets/77bbe74d-bb01-4834-a6f0-a5c6202f0f39) |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express 5 |
| Database | SQLite via better-sqlite3 |
| Styling | Custom CSS (no framework) |

## Getting Started

### Prerequisites
- Node.js 18+

### Install dependencies

```bash
npm run install:all
```

### Build the frontend

```bash
npm run build
```

### Start the server

```bash
npm start
```

The app will be available at **http://localhost:3001**

### Development (hot-reload)

Run the backend and frontend concurrently in separate terminals:

```bash
# Terminal 1 – API server
npm run dev:server

# Terminal 2 – Vite dev server (proxies /api to port 3001)
npm run dev:client
```

The dev client runs at **http://localhost:5173**

## Project Structure

```
Dap/
├── server/
│   ├── index.js      # Express API + static file serving
│   ├── db.js         # SQLite schema, seed data
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/   # Navbar, Footer, BusinessCard, StarRating
│   │   ├── pages/        # Home, Businesses, BusinessDetail, AddBusiness
│   │   └── App.jsx       # Router setup
│   └── package.json
└── package.json          # Root scripts
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/businesses` | List all businesses (supports `?search=`, `?category=`) |
| `GET` | `/api/businesses/:id` | Get a single business |
| `POST` | `/api/businesses` | Add a new business |
| `GET` | `/api/businesses/:id/reviews` | Get reviews for a business |
| `POST` | `/api/businesses/:id/reviews` | Submit a review |
| `GET` | `/api/featured` | Get top-rated businesses |
| `GET` | `/api/categories` | List all categories |
