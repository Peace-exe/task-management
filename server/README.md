# Student Management System — Server

A backend REST API server for managing student data with authentication built using Node.js, Express.js, and MongoDB.

---

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **JWT (jsonwebtoken)**: Authentication
- **bcrypt**: Password hashing

---

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd server
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root of the server directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=your_port_number
```

> ⚠️ **Important:** The server will not run without the `.env` file. Make sure to add it before starting the server.

4. Start the server

```bash
npm start
```

---

## API Routes

### Auth Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Login and receive JWT cookie | No |
| POST | `/logout` | Logout and clear cookie | Yes |

### Student Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/createStudent` | Create a new student record | Yes |
| GET | `/getAllStudents` | Get all students (paginated, 10 per page) | Yes |
| PATCH | `/updateStudent` | Update a student record | Yes |
| DELETE | `/deleteStudent` | Delete a student record | Yes |

---

## Pagination

The `/getAllStudents` route supports pagination via query parameter:

```
GET /getAllStudents?page=1
GET /getAllStudents?page=2
```

---

## Authentication

This server uses **JWT tokens** stored in HTTP cookies for authentication. After a successful login, a token is set in the cookie which is validated on protected routes.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Your MongoDB connection string |
| `PORT` | Port number the server runs on |

---

## Notes

- All protected routes require a valid JWT cookie obtained after login.
- Passwords are hashed using bcrypt before being stored in the database.
- Student roll numbers must follow the format: `123/ABC/456` (3 digits / 3 uppercase letters / 3 digits).