# SprintLens

SprintLens is a backend-first task management MVP built for the Primetrade internship assignment. It provides user authentication, role-based access control, and task CRUD APIs using Node.js, Express, MongoDB Atlas, JWT, and bcryptjs.

## Current Scope

This repository currently focuses on the backend submission requirements:

- User registration and login
- Password hashing with bcryptjs
- JWT authentication
- Protected routes with middleware
- Role-based access for `admin` and `user`
- Task CRUD APIs
- MongoDB Atlas integration

The frontend MVP and later analytics dashboard will be added in the next phase.

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

## Project Structure

```text
SprintLens
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── .env
└── README.md
```

## Setup Instructions

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `backend` with:

```env
PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### 3. Run the backend

```bash
cd backend
npm run dev
```

The server will run at:

```text
http://localhost:5000
```

## API Endpoints

### Auth

#### Register
`POST /api/auth/register`

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

#### Login
`POST /api/auth/login`

Request body:

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

### Tasks

All task routes require a JWT in the `Authorization` header:

```text
Authorization: Bearer <token>
```

#### Get tasks
`GET /api/tasks`

#### Create task
`POST /api/tasks`

Request body:

```json
{
  "title": "First Task",
  "description": "My first task",
  "priority": "high"
}
```

#### Update task
`PUT /api/tasks/:id`

#### Delete task
`DELETE /api/tasks/:id`

#### Admin-only fetch all tasks
`GET /api/tasks/admin`

## Role Rules

- `admin` can view and manage all tasks
- `user` can only manage their own tasks

## Notes

- `.env` is ignored by git and should never be committed.
- MongoDB Atlas credentials should be rotated if exposed.
- The backend has been tested locally with register, login, create task, and fetch task flows.
