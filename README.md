# Pro-Tasker Backend

This is the backend for **Pro-Tasker**, a full-stack task management app built with the MERN stack (MongoDB, Express.js, React.js, Node.js).
It supports user authentication, project and task CRUD operations, secure role-based access, and collaboration support for small teams.

---

## 🔧 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing
- Multer (for file uploads)
- CORS
- Dotenv
- Render (deployment)
- MongoDB Atlas (cloud DB)

---

## 📁 Project Structure

/backend
│
├── controllers/ # Route handler logic
├── models/ # Mongoose schemas (User, Project, Task)
├── routes/ # Express routes
├── middleware/ # Auth middleware (auth, role, etc.)
├── utils/ # Helper functions, API paths
├── uploads/ # File upload storage
├── .env # Secret environment variables
├── server.js # Main server entry
└── README.md # You're here

pgsql
Copy
Edit

---

## 🔐 Authentication & Authorization

- JWT tokens issued on login and stored client-side
- Protected routes via `authMiddleware`
- Passwords are hashed using `bcrypt` with pre-save hooks
- Role-based access (admin vs. member)
- Ownership-based authorization for project/task modification

---
