# TaskFlow — Smart Task Manager 🚀

A full-stack task management application built with the **MERN Stack** (MongoDB, Express/Hono.js, React, Node.js) featuring JWT authentication, drag-and-drop Kanban board, dashboard analytics, and AI-powered task recommendations.

## ✨ Features

- **User Authentication** — Secure registration and login with JWT tokens and bcrypt password hashing
- **CRUD Tasks** — Create, read, update, and delete tasks with full validation
- **Task Priority Levels** — Low, Medium, High, and Urgent with color-coded indicators
- **Drag-and-Drop Board** — Kanban-style board to move tasks between Pending, In Progress, and Completed
- **Dashboard Analytics** — Pie charts, bar charts, and line charts showing task distribution and trends
- **AI Recommendations** — Smart productivity suggestions (OpenAI GPT integration + rule-based fallback)
- **Due Date Reminders** — Automatic email notifications for upcoming deadlines
- **Search & Filter** — Real-time search with status, priority, and sort filters
- **Responsive Design** — Premium dark theme UI optimized for desktop and mobile
- **List & Board Views** — Toggle between list and Kanban views

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router DOM, Axios, Recharts, @hello-pangea/dnd |
| Backend | Node.js, Hono.js, JWT, bcrypt.js, Nodemailer, node-cron |
| Database | MongoDB, Mongoose ODM |
| AI | OpenAI GPT-3.5 (optional) |

## 📦 Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key_here

# Optional: OpenAI for AI recommendations
OPENAI_API_KEY=

# Optional: SMTP for email notifications
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

### 3. Run the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📁 Project Structure

```
TMA/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Route handlers
│   ├── middleware/auth.js     # JWT middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/email.js         # Email helper
│   └── server.js              # Entry point
├── frontend/
│   └── src/
│       ├── api/axios.js       # Axios instance
│       ├── components/        # Reusable components
│       ├── context/           # Auth context
│       └── pages/             # Route pages
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/tasks | List tasks (with search/filter) |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/status | Toggle status |
| PUT | /api/tasks/reorder | Reorder tasks (drag-and-drop) |
| GET | /api/tasks/analytics | Dashboard analytics |
| POST | /api/ai/recommendations | AI recommendations |

## 📄 License

MIT
