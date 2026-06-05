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

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=minutemailer&logoColor=white)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

### AI
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

### Tools & DevOps
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)

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
