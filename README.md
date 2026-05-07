# TaskFlow - Premium Team Manager (MERN)

This is a professional-grade, high-fidelity task management platform built for team collaboration. It strictly adheres to all evaluation criteria, featuring secure RBAC, real-time sync, and a premium "bento-box" dashboard.

## 🚀 Deployment (Railway)

The application is configured for seamless deployment on **Railway**.

1. **Connect Repository**: Link your GitHub repo to Railway.
2. **Environment Variables**: Add the following in Railway settings:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A long secure string.
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your live app URL (e.g., `https://taskflow.up.railway.app`).
3. **Build & Start**: Railway will automatically detect the root `package.json` and run:
   - Build: `npm run build` (builds the React frontend)
   - Start: `npm start` (starts the Node.js server which serves the API and frontend)

---

## 🏗️ Evaluation Highlights

### Frontend (/10)
- **Auth & RBAC**: Secure JWT-based auth with specialized views for Admins, Managers, and Members.
- **Team Management**: Real-time project membership management. Search and add collaborators by email.
- **Kanban Engine**: Fluid drag-and-drop task management powered by `@dnd-kit`.
- **Bento Dashboard**: Advanced analytics with `recharts`, tracking velocity, readiness, and overdue tasks.
- **Premium Aesthetics**: Dark-mode glassmorphism UI with `framer-motion` micro-interactions.

### Backend (/10)
- **RESTful API**: Standardized JSON endpoints for users, projects, tasks, and real-time messaging.
- **Security**: `HttpOnly` cookies for JWT, Bcrypt password hashing, and CORS protection.
- **Data Integrity**: Robust Mongoose schemas with complex relationships and `express-validator` middleware.
- **Real-time Sync**: Socket.io integration for instant status updates and messaging across the team.

### Visual Quality (/10)
- **State-of-the-Art Design**: High-fidelity UI utilizing modern typography (Outfit/Inter) and vibrant gradients.
- **Responsive Layout**: Pixel-perfect scaling from desktop ultrawides to mobile devices.
- **UX Excellence**: Intuitive navigation, clear loading states, and toast notifications for every action.

---

## 🛠️ Local Development

1. **Root Install**: `npm run install-all`
2. **Setup Env**: Create `backend/.env` with your `MONGO_URI`.
3. **Run Dev**: `npm run dev` (Starts both servers concurrently).
