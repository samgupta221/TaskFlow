# TaskFlow – Task Management Web App

## Overview

TaskFlow is a full-stack task management application where users can create projects, manage tasks, assign team members, and track progress with role-based access control.

---

## Features

* User Authentication (Signup/Login)
* JWT Protected Routes
* Project Management
* Task Creation & Assignment
* Kanban Task Workflow
* Dashboard Analytics
* Team Management
* Role-Based Access Control (Admin/Member)
* Reports & Progress Tracking
* Responsive UI

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication

---

## Installation

### Clone Repository

```bash id="0efxkh"
git clone <your-github-repo-link>
cd task-management
```

### Backend Setup

```bash id="9l6vd9"
cd backend
npm install
```

Create `.env`

```env id="1jlwm1"
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run Backend

```bash id="phj4hk"
npm run dev
```

### Frontend Setup

```bash id="x2s6hn"
cd frontend
npm install
npm run dev
```

---

## Deployment

* Frontend: Railway
* Backend: Railway
* Database: MongoDB Atlas

---

## Author

Samridhi Gupta

GitHub: [GitHub Profile](https://github.com/samgupta221?utm_source=chatgpt.com)
