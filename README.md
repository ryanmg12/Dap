# Dap

A web application with a **React** frontend and **Go** backend.

## Project Structure

```
.
├── backend/   # Go HTTP server
└── frontend/  # React app (Vite)
```

## Backend (Go)

```bash
cd backend
go run main.go
```

The server starts on `http://localhost:8080`.

### Endpoints

| Method | Path         | Description   |
|--------|--------------|---------------|
| GET    | /api/health  | Health check  |

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173` and proxies `/api` requests to the Go backend.

## Running Both Together

1. Start the backend: `cd backend && go run main.go`
2. Start the frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173`
