# SprintLens

SprintLens is a lightweight developer workflow and task management platform foundation. The current codebase focuses on a working backend MVP with authentication, role-based access control, and task CRUD APIs using Node.js, Express, MongoDB Atlas, JWT, and bcryptjs.

## Current Scope

This repository currently focuses on the backend foundation of SprintLens:

- User registration and login
- Password hashing with bcryptjs
- JWT authentication
- Protected routes with middleware
- Role-based access for `admin` and `user`
- Task CRUD APIs
- MongoDB Atlas integration

The next phase is a minimal frontend MVP that will turn this into a usable product shell, followed by a broader productivity and analytics layer.

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
├── frontend
│   ├── index.html
│   ├── src
│   ├── vite.config.js
│   └── package.json
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

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend` with:

```env
PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the backend

```bash
cd backend
npm run dev
```

The server will run at:

```text
http://localhost:5000
```

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

The frontend will run on the Vite local URL shown in the terminal.

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
- This repository is intentionally structured to evolve into the full SprintLens product, not just a throwaway demo.

## Deployment

### Backend on Render

1. Push the latest code to GitHub.
2. Create a new **Web Service** on Render.
3. Connect the SprintLens GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Use these build and start settings:

```text
Build Command: npm install
Start Command: npm run start
```

6. Add these environment variables on Render:

```env
PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

7. Deploy the service and copy the live backend URL.

### Frontend on Vercel

The minimal frontend MVP is now scaffolded locally. When it is ready to deploy:

1. Create a Vercel project.
2. Connect the same GitHub repository.
3. Set the frontend root directory to `frontend`.
4. Add the deployed backend URL to the frontend environment variables.

### Important Deployment Notes

- Keep MongoDB Atlas IP access open while testing deployment, or add the Render server IP when needed.
- If the frontend is deployed later, update backend CORS to allow the frontend URL.
- Never commit `.env` or database credentials to GitHub.

## Product Direction

SprintLens is being shaped as a reusable platform, not a one-off test app.

Short-term:

- Complete the minimal frontend MVP
- Connect frontend auth and task flows to the deployed backend
- Keep the UI simple and functional

Mid-term:

- Add productivity views and dashboard surfaces
- Add richer task workflows and team-oriented features
- Prepare the codebase for the next assignment phase without rewriting the backend
