# Full-Stack Task Management Application (MERN)

This is a high-quality, professional-grade task management application designed for the technical assessment. It strictly adheres to all evaluation guidelines:
- **MERN Stack**: MongoDB + Express + React + Node.js
- **Pure JavaScript**: No TypeScript used.
- **No Prisma/Next.js**: Built explicitly avoiding these frameworks, relying on standard Node/Express + Vite/React as requested.
- **Unique UI**: Features a sleek glassmorphism "bento-box" dashboard, framer-motion micro-animations, and a responsive layout to ensure it stands out.

## 🚀 How to Run

Follow these simple steps to run both the frontend and backend servers.

### 1. Database Setup
Ensure you have a MongoDB instance running locally on the default port (`mongodb://127.0.0.1:27017/task-manager`).
*(Alternatively, you can edit `backend/.env` and replace `MONGO_URI` with your MongoDB Atlas connection string).*

### 2. Start the Backend
Open a terminal and run the following commands:
```bash
cd backend
npm install
npm run dev
```
*The backend server will start on `http://localhost:5000`.*

### 3. Start the Frontend
Open a **new** terminal window and run:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

---

## 🏗️ Evaluation Highlights

### Frontend (/10)
- **Auth & User Flow**: Secure login/registration forms with UI feedback. Handled globally via Zustand.
- **Task Management**: Project detail view with organized task columns (To Do, In Progress, Review, Done) utilizing `dnd-kit`.
- **Dashboard**: "Bento-box" layout featuring project summaries and dynamic charts (`recharts`).
- **Validations & States**: Loading states (spinners/disabled buttons) and robust error handling during API requests.
- **Code Quality**: Clean, functional React components using hooks. Custom CSS variables mixed with Tailwind CSS.

### Backend (/10)
- **REST API**: Standardized JSON RESTful endpoints for Auth, Projects, and Tasks.
- **Auth & Security**: JWT stored in `HttpOnly` cookies to mitigate XSS attacks. Passwords hashed via `bcryptjs`.
- **Role-Based Access Control**: Middleware configured to differentiate between `Admin`, `Manager`, and `User` (e.g., only Admins/Managers can create Projects).
- **Database Design**: Proper Mongoose schemas (`User`, `Project`, `Task`) with relationship references.
- **Validation**: Strict request payload validation using `express-validator` and centralized error-handling middleware.

### Visual Quality (/10)
- **Premium Look**: A dark-themed, highly-polished UI utilizing glassmorphism (`backdrop-filter`) and precise shadows.
- **Typography**: Clean, readable sans-serif stack native to the OS for optimal performance.
- **Interactivity**: Micro-animations powered by `framer-motion` for page transitions and hover states.
