# 🎓 Student Management System

A full-stack web application for university and college faculty to manage student records efficiently.

> 🔗 **Repository:** https://github.com/Peace-exe/student-management-system

---

## 📁 Project Structure
```
student-management-system/
├── web/        # React + TypeScript frontend
└── server/     # Node.js + Express backend
```

---

## ✨ Features

- **Authentication** — Secure login and registration with JWT cookie-based auth
- **Token Validation** — Auto-redirect to dashboard if session is still valid
- **Dashboard** — At-a-glance overview of enrollment stats and key metrics
- **Student Records** — Full CRUD with pagination (10 per page)
- **Account Management** — View and update profile details
- **Persistent Session** — Auth state survives page refreshes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework & build tool |
| TypeScript | Type safety |
| React Router | Client-side routing |
| Zustand | Global state (auth + students) |
| Axios | HTTP client |
| shadcn/ui + Tailwind CSS | UI components & styling |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcrypt | Password hashing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB Atlas account or local MongoDB instance

---

### 1. Clone the repository
```bash
git clone https://github.com/Peace-exe/student-management-system.git
cd student-management-system
```

---

### 2. Set up the Server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=7001
```

Start the server:
```bash
npm start
```

Server will run at `http://localhost:7001`

> ⚠️ **Important — MongoDB IP Whitelist**
> This project uses MongoDB Atlas which restricts connections by IP address. Before the server can connect to the database, your local IP must be whitelisted.
>
> **Contact the repository owner** [@Peace-exe](https://github.com/Peace-exe) with your IP address to get access.
>
> Run this command in terminal to get your local IP Address: <u>***curl -4 ifconfig.me***</u>.
>
> Without this step, the server will start but all API calls will fail with a database connection error.

---

### 3. Set up the Frontend

Open a new terminal:
```bash
cd web
npm install
npm run dev
```

App will run at `http://localhost:5173`

---

## 🔐 Auth Flow

1. On app load, checks for `token` cookie
2. If present, validates via `GET /profile/validateToken`
3. If store has user data → redirects to dashboard
4. Any check failing → stays on login page

---

## 🔗 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | No | Register new account |
| `POST` | `/login` | No | Login, sets JWT cookie |
| `POST` | `/logout` | Yes | Logout, clears cookie |
| `GET` | `/profile` | Yes | Get current user |
| `GET` | `/profile/validateToken` | Yes | Validate JWT token |
| `POST` | `/profile/update` | Yes | Update profile fields |

### Students
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/getAllStudents?page=n` | Yes | Paginated student list |
| `POST` | `/createStudent` | Yes | Add new student |
| `POST` | `/updateStudent?rollNum=` | Yes | Update student by roll number |
| `DELETE` | `/deleteStudent/:rollNum` | Yes | Delete student by roll number |

> Roll number format: `123/ABC/456`

---

## 📄 License

This project is for internal/academic use.