# Employee Management System (EMS)

## Overview

Employee Management System (EMS) is a full-stack application for managing employees, tasks, attendance, leaves, and analytics with Admin and Employee role-based workflows.

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite, Tailwind CSS

## Repository Layout

```text
employee-management-system/
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
└── Frontend/
    ├── package.json
    ├── .env
    ├── src/
    ├── public/
    └── vite.config.js
```

## Features

- Admin and Employee authentication using JWT
- Admin dashboard for employee, task, leave, attendance and analytics management
- Employee dashboard for task tracking, leave requests, attendance, and profile updates
- Task creation, assignment, status updates, and submission links
- Attendance clock-in / clock-out tracking
- Leave application, approval, and rejection flows
- Email notifications via Brevo SMTP
- Profile image upload using Cloudinary

## Prerequisites

- Node.js 18+ installed
- npm available
- MongoDB running locally or accessible via connection string

## Backend Setup

1. Open a terminal in `Backend/`
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file or use the existing `.env` with these values:

   ```env
   DB_CONNECT=mongodb://127.0.0.1:27017/Employee-management-system
   JWT_SECRET=ems_local_jwt_secret_change_before_production
   PORT=4000
   FRONTEND_URL=http://localhost:5173

   BREVO_SMTP_HOST=smtp-relay.brevo.com
   BREVO_SMTP_PORT=587
   BREVO_SMTP_USER=<your-brevo-username>
   BREVO_SMTP_KEY=<your-brevo-password>
   BREVO_FROM_EMAIL=<your-from-email>
   BREVO_FROM_NAME="EMS Support"

   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

5. The API runs by default on `http://localhost:4000`

## Frontend Setup

1. Open a terminal in `Frontend/`
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create or verify `.env` contains:

   ```env
   VITE_BASE_URL=http://localhost:4000
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

5. The React app runs by default on `http://localhost:5173`

## Useful npm Scripts

### Backend

- `npm start` — run the backend with Node
- `npm run dev` — run the backend with nodemon
- `npm run seed:admin` — seed the default admin user

### Frontend

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint on frontend files

## API Routes

### Authentication

- `POST /auth/login` — login for admin or employee
- `POST /auth/forgot-password` — request password reset
- `POST /auth/reset-password/:token` — reset password

### Admin Routes

- `GET /admins/profile` — admin profile
- `GET /admins/employees` — list employees
- `POST /admins/tasks` — create task
- `GET /admins/tasks` — list tasks
- `PUT /admins/tasks/:id` — update task
- `DELETE /admins/tasks/:id` — delete task
- `GET /admins/employees/:id` — employee detail
- `PUT /admins/employee/:id` — update employee
- `DELETE /admins/employee/:id` — delete employee
- `GET /admins/logout` — admin logout

### Employee Routes

- `GET /employees/profile` — employee profile
- `PUT /employees/profile` — update employee profile
- `GET /employees/tasks` — list assigned tasks
- `PUT /employees/tasks/:id` — update employee task status
- `GET /employees/logout` — employee logout

### Leave Routes

- `POST /leaves/apply-leave` — employee apply leave
- `GET /leaves/my-leaves` — employee leave history
- `GET /leaves/all-leaves` — admin leave list
- `PUT /leaves/approve-leave/:id` — admin approve leave
- `PUT /leaves/reject-leave/:id` — admin reject leave

### Attendance Routes

- `POST /attendance/clock-in` — employee clock in
- `POST /attendance/clock-out` — employee clock out
- `GET /attendance/today` — employee today attendance
- `GET /attendance/all` — admin attendance list

### Employee Task Submission

- `PUT /employee-tasks/tasks/:taskId/add-link` — submit task link

### Analytics Routes

- `GET /analytics/summary` — summary stats
- `GET /analytics/tasks` — task analytics data
- `GET /analytics/productivity` — productivity analytics
- `GET /analytics/risk` — risk analytics

## Environment Variables

### Backend

- `DB_CONNECT` — MongoDB connection string
- `JWT_SECRET` — secret key for JWT
- `PORT` — backend port (default `4000`)
- `FRONTEND_URL` — frontend origin for email links
- `BREVO_SMTP_HOST` / `BREVO_SMTP_PORT` / `BREVO_SMTP_USER` / `BREVO_SMTP_KEY`
- `BREVO_FROM_EMAIL` / `BREVO_FROM_NAME`
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`

### Frontend

- `VITE_BASE_URL` — backend API base URL

## Notes

- The backend serves static uploads from `/uploads`
- The frontend uses `import.meta.env.VITE_BASE_URL` to call the backend
- Seed the initial admin user with `npm run seed:admin`
- Change default secrets and credentials before deploying to production

## Contact

If you need help running the app, verify the backend is active on `http://localhost:4000` and the frontend on `http://localhost:5173`.


## Setup Guide

### 1) Backend Setup

```bash
cd Backend
npm install
```

Create `.env` in `Backend/`:

```env
MONGO_URI=mongodb://localhost:27017/ems
# Optional
PORT=3000
```

Run backend:

```bash
node server.js
# or
npx nodemon
```

### 2) Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env` in `Frontend/`:

```env
VITE_BASE_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

---

## Environment Variables

### Backend (`/Backend/.env`)

- `MONGO_URI` (required): MongoDB connection string
- `PORT` (optional): API server port (default `3000`)

### Frontend (`/Frontend/.env`)

- `VITE_BASE_URL`: Backend API base URL (example: `http://localhost:3000`)

---

## Important Notes

- Ensure both backend and frontend are running on expected ports
- All protected routes require JWT in `Authorization` header (or valid token cookie)
- Validate IDs and payload fields before making write operations

---

## License

Add your project license details here.
