# Task Manager

A full-stack task management app with a card-based UI, real-time status updates, and localStorage persistence.

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- React Router DOM
- Zustand (with `persist` middleware → localStorage)
- Tailwind CSS + shadcn/ui
- Axios

**Backend**
- Node.js + Express.js
- Mongoose + MongoDB

---

## Project Structure

```
├── client/                  # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── TaskPage.tsx
│   │   │   ├── Account.tsx
│   │   │   └── NotFound.tsx
│   │   ├── store/
│   │   │   ├── useAuthStore.ts
│   │   │   └── useTaskStore.ts
│   │   ├── hooks/
│   │   │   └── use-toast.ts
│   │   └── App.tsx
│
└── server/                  # Backend (Express)
    ├── models/
    │   └── task.js
    ├── routes/
    │   └── taskRouter.js
    └── index.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2. Setup the server

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=7001
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```

### 3. Setup the client

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Reference

Base URL: `http://localhost:7001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/task/getAllTasks` | Fetch all tasks |
| `POST` | `/task/createTask` | Create a new task |
| `PATCH` | `/task/updateTaskStatus/:id` | Update task status |
| `DELETE` | `/task/deleteTask/:id` | Delete a task |

### Task object

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Fix login bug",
  "description": "Auth token not refreshing on expiry",
  "status": "in_progress",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

Valid status values: `todo` | `in_progress` | `done`

---

## Features

- JWT-based authentication with httpOnly cookies
- Card-based task UI with color-coded status (yellow → green → white)
- Inline status update directly on the card (optimistic update + rollback on failure)
- Zustand store with `persist` middleware — tasks survive page refresh via localStorage
- API only called on first load; subsequent visits hydrate from localStorage
- Responsive layout with collapsible sidebar

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `7001`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |