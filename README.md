TaskFlow – Full Stack Task Management System
Overview

TaskFlow is a full-stack task management web application that allows teams to create projects, manage tasks, assign members, and track project progress efficiently. The application includes authentication, role-based access control, analytics dashboards, and real-time workflow tracking.

Features
Authentication
User Signup & Login
JWT-based Authentication
Protected Routes
Secure Session Handling
Dashboard
Project Statistics
Task Analytics
Progress Tracking
Productivity Charts
Project Management
Create, Update & Delete Projects
Assign Team Members
Track Project Progress
Task Management
Create & Assign Tasks
Task Priorities
Kanban Workflow
Status Tracking:
To Do
In Progress
Review
Done
Team Management
Role-Based Access Control
Admin & Member Roles
Team Collaboration
Reports & Analytics
Performance Tracking
Task Completion Analytics
Workflow Insights
Messaging
Team Communication Interface
Settings
User Profile Management
Account Preferences
Tech Stack
Frontend
React.js
Tailwind CSS
Vite
Recharts
Lucide React
Backend
Node.js
Express.js
MongoDB Atlas
JWT Authentication
Mongoose
Database

MongoDB Atlas is used for storing:

Users
Projects
Tasks
Team Data
API Features
REST APIs
Authentication Middleware
Role-Based Authorization
Input Validation
Error Handling
Deployment
Frontend: Railway
Backend: Railway
Database: MongoDB Atlas
Installation & Setup
Clone Repository
git clone <your-github-repo-link>
cd task-management
Backend Setup
cd backend
npm install
Create .env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run Backend
npm run dev
Frontend Setup
cd frontend
npm install
npm run dev
Folder Structure
task-management/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
└── README.md
Screens Included
Dashboard
Projects
Tasks
Team
Reports
Messages
Settings
Future Improvements
Real-Time Notifications
File Upload Support
Dark/Light Theme Customization
Mobile Optimization
Drag & Drop Tasks
Author

Samridhi Gupta

GitHub: GitHub Profile
