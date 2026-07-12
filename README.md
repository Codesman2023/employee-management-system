# Employee Management System (EMS)

## Overview

Employee Management System (EMS) is a full-stack web application to manage employees, tasks, attendance, and leave workflows with role-based access for Admins and Employees.

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (Vite)

---

## Project Structure

```text
EMS/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── db/
│       │   └── db.js
│       ├── routes/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       └── services/
└── Frontend/
```

---

## Backend (`/Backend`)

### Description

- Tech Stack: Node.js, Express, MongoDB
- Core capabilities: Authentication, task management, attendance, leave handling, analytics

### Key Features

- Role-based authentication (Admin / Employee) with JWT
- Logout with token blacklist handling
- Task workflow: create -> assign -> update status -> complete
- Leave and attendance management
- Analytics endpoints for admin dashboard insights

### Notable Backend Files

- `server.js`: Entry point (default port `3000`)
- `src/app.js`: Route and middleware mounting
- `src/db/db.js`: MongoDB connection setup
- `src/routes/`: Route definitions
- `src/controllers/`: Route business logic
- `src/middlewares/`: Authorization middleware
- `src/models/`: Mongoose models
- `src/services/`: Service layer

---

## Frontend (`/Frontend`)

### Description

- Tech Stack: React (Vite)
- Includes Admin and Employee dashboards for task operations and profile-based access

### Main Usage

- Admin Dashboard: Create/update/delete tasks, view employees and tasks
- Employee Dashboard: View assigned tasks, update task status

---

## Authentication

All protected endpoints require a valid JWT.

Use in header:

```http
Authorization: Bearer <token>
```

Some flows may also set a `token` cookie on login.

---

## API Endpoints

### Authentication and Profile

| Endpoint | Method | Description | Request Body | Success | Error Status |
|---|---|---|---|---|---|
| `/auth/login` | POST | Unified admin/employee login | `{ email, password }` | 200 | 400, 401, 403 |
| `/admins/profile` | GET | Get admin profile | - | 200 | 401 |
| `/employees/profile` | GET | Get employee profile | - | 200 | 401 |

### Task Management

| Endpoint | Method | Description | Request Body | Success | Error Status |
|---|---|---|---|---|---|
| `/admins/tasks` | POST | Create a task | `{ title, description, assignedTo, dueDate, category }` | 201 | 400, 500 |
| `/admins/tasks` | GET | Get all tasks (admin) | - | 200 | 401, 500 |
| `/admins/tasks/:id` | PUT | Update a task | `{ title, description, assignedTo, dueDate, category, status }` | 200 | 400, 404, 500 |
| `/admins/tasks/:id` | DELETE | Delete a task | - | 200 | 404, 500 |
| `/employees/tasks` | GET | Get tasks assigned to employee | - | 200 | 401, 500 |
| `/employees/tasks/:id` | PUT | Update employee task status | `{ status }` | 200 | 403, 404, 500 |

### Employee Management (Admin)

| Endpoint | Method | Description | Request Body | Success | Error Status |
|---|---|---|---|---|---|
| `/admins/employees` | GET | Get all employees | - | 200 | 401, 500 |

### Attendance

#### Employee

- `POST /attendance/clock-in`
- `POST /attendance/clock-out`
- `GET /attendance/today`

#### Admin

- `GET /attendance/all`

### Leave Management

- `POST /leaves/apply-leave`
- `GET /leaves/my-leaves`
- `GET /leaves/all-leaves`
- `PUT /leaves/approve-leave/:id`
- `PUT /leaves/reject-leave/:id`

### Analytics (Admin)

- `GET /analytics/summary`
- `GET /analytics/tasks`
- `GET /analytics/productivity`
- `GET /analytics/risk`

### Employee Task Submission

- `PUT /employee-tasks/tasks/:taskId/add-link`

---

## Request Payload Requirements

### Create Task (`POST /admins/tasks`)

```json
{
  "title": "Task Title",
  "description": "Task details",
  "assignedTo": "employeeObjectId",
  "dueDate": "YYYY-MM-DD",
  "category": "Task Category"
}
```

### Update Task (`PUT /admins/tasks/:id`)

```json
{
  "title": "Task Title",
  "description": "Task details",
  "assignedTo": "employeeObjectId",
  "dueDate": "YYYY-MM-DD",
  "category": "Task Category",
  "status": "pending|in-progress|completed|failed"
}
```

### Employee Task Status Update (`PUT /employees/tasks/:id`)

```json
{
  "status": "pending|in-progress|completed|failed"
}
```

Notes:

- `assignedTo` must be a valid Employee ObjectId
- Dates should be sent in ISO format (`YYYY-MM-DD`)

---

## HTTP Status Codes

- `200 OK`: Successful GET/PUT/DELETE
- `201 Created`: Successful POST (task creation)
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required/failed
- `403 Forbidden`: Action not allowed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side failure

---

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
