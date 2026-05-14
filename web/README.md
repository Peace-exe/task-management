# 🎓 Faculty — Student Management System

A modern, responsive web application for university and college faculty to manage student records efficiently.

---

## ✨ Features

- **Dashboard** — At-a-glance overview of enrollment stats and key metrics
- **Student Records** — Full CRUD: add, view, edit, and delete student entries with pagination
- **Authentication** — Secure login and registration with JWT cookie-based auth
- **Token Validation** — Auto-redirect to dashboard if session is still valid on page load
- **Account Management** — View and update profile details
- **Persistent Auth** — User session survives page refreshes via localStorage

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) + [Vite](https://vitejs.dev/) | Frontend framework & build tool |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [Zustand](https://zustand-demo.pmnd.rs/) | Global state management (auth + students) |
| [Axios](https://axios-http.com/) | HTTP client |
| [shadcn/ui](https://ui.shadcn.com/) | UI component library |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |


---

## 📁 Project Structure
```
web/
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   └── DashboardLayout   # Sidebar + header shell
│   ├── hooks/
│   │   └── use-toast.ts      # Sonner-backed toast hook
│   ├── pages/
│   │   ├── Login.tsx         # Login + Register
│   │   ├── Overview.tsx      # Dashboard home
│   │   ├── StudentRecords.tsx# CRUD student table
│   │   └── Account.tsx       # Profile management
│   ├── store/
│   │   ├── useAuthStore.ts   # Auth state (persisted)
│   │   └── useStudentStore.ts# Student state
│   └── main.tsx              # App entry point
├── index.html
├── vite.config.ts
└── tsconfig.json
```

---

## 🔐 Auth Flow

1. On app load, checks for `token` cookie
2. If present, validates via `GET /profile/validateToken`
3. If store has user data → redirects to dashboard
4. Any check failing → stays on login page
5. Auth state is persisted in `localStorage` via Zustand

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn
- Backend API running (Node/Express) — see the backend repo

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd student-management/web

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔗 API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Login with email & password |
| `POST` | `/signup` | Register new faculty account |
| `GET` | `/profile` | Get current user profile |
| `GET` | `/profile/validateToken` | Validate JWT token |
| `POST` | `/profile/update` | Update profile fields |
| `GET` | `/getAllStudents?page=n` | Paginated student list |
| `POST` | `/createStudent` | Add new student |
| `POST` | `/updateStudent?rollNum=` | Update student by roll number |
| `DELETE` | `/deleteStudent/:rollNum` | Delete student by roll number |

> **Note:** All API calls use `withCredentials: true` to send the JWT cookie with every request. Roll numbers containing slashes are `encodeURIComponent` encoded in URLs.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is for internal/academic use.