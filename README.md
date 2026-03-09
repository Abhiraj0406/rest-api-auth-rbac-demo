# REST API with Auth & Role-Based Access

Backend: **Python / FastAPI** · Frontend: **React.js** · Database: **PostgreSQL**

Users can register and log in with JWT authentication, are assigned roles (`user` or `admin`), and can perform CRUD operations on **tasks** via a protected REST API and a simple React dashboard.

---

## Tech Stack

| Layer      | Technology                |
|-----------|---------------------------|
| Backend   | Python 3.10–3.14, FastAPI |
| Frontend  | React.js (Create React App) running on Node.js 18+ |
| Database  | PostgreSQL 14+            |
| Auth      | JWT (python-jose), bcrypt password hashing (passlib) |

---

## Backend (FastAPI)

### 1. Install dependencies

```bash
cd backend
python -m venv venv
# Windows PowerShell
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### 2. Configure database (.env)

Copy the example file and edit it:

```bash
cd backend
copy .env.example .env
```

`backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/rest_api_db
SECRET_KEY=<your-long-random-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> For this assignment we use **PostgreSQL**. You can adjust `USER`, `PASSWORD`, and DB name as needed.

### 3. Create the PostgreSQL database

Run once after configuring `.env`:

```bash
cd backend
.\venv\Scripts\Activate.ps1
python create_db.py
```

This connects to PostgreSQL and creates `rest_api_db` (or the DB name from `DATABASE_URL`) if it does not exist.

### 4. Run the backend

Development (auto‑reload):

```bash
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

API endpoints:

- Base: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

The app mounts two routers under `/api/v1`:

- `auth` – registration and login
- `tasks` – CRUD for tasks with role‑based access control

---

## Frontend (React.js)

### 1. Configure API URL

`frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000
```

### 2. Install and run

```bash
cd frontend
npm install
npm start
```

The React app runs at: `http://localhost:3000`

**Features:**

- Registration and login forms that call the FastAPI backend.
- Stores JWT in `localStorage` and attaches `Authorization: Bearer <token>` to API calls.
- Protected dashboard showing the user’s tasks (or all tasks if `role = 'admin'`).
- Create, edit, toggle complete, and delete tasks.
- Clear error/success messages for API responses (validation, 401, etc.).

---

## API Design

### Auth

| Method | Endpoint                    | Auth | Description                                |
|--------|-----------------------------|------|--------------------------------------------|
| POST   | `/api/v1/auth/register`     | No   | Register new user (password ≥ 8 chars)     |
| POST   | `/api/v1/auth/login`        | No   | Login, returns JWT access token + user     |

**Register – request body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "User Name"
}
```

**Login – response (Token model):**

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "User Name",
    "role": "user",
    "is_active": true
  }
}
```

### Tasks (protected)

All tasks endpoints require header:

```http
Authorization: Bearer <access_token>
```

| Method | Endpoint             | Description                                             |
|--------|----------------------|---------------------------------------------------------|
| GET    | `/api/v1/tasks`      | List tasks (own tasks for `user`, all tasks for `admin`)|
| POST   | `/api/v1/tasks`      | Create new task                                         |
| GET    | `/api/v1/tasks/{id}` | Get single task (owner or admin only)                   |
| PATCH  | `/api/v1/tasks/{id}` | Update task (title/description/completed)               |
| DELETE | `/api/v1/tasks/{id}` | Delete task (owner or admin only)                       |

**Task create – request body:**

```json
{
  "title": "Finish assignment",
  "description": "Implement auth + RBAC demo"
}
```

---

## Security & Roles

- **Password hashing:** `passlib` with `bcrypt` (`bcrypt` pinned to a compatible version).
- **JWT tokens:** signed with `SECRET_KEY` and `HS256`, containing `sub` (user id) and `role`.
- **Roles:**
  - `user` – can only see and modify their own tasks.
  - `admin` – can see and manage all tasks.
- **Protected routes:** use a dependency that decodes JWT, loads the user, and enforces `is_active` and role checks.

To promote a user to admin, update the `role` column to `"admin"` in the `users` table (e.g., via pgAdmin).

---

## Project Structure

```text
backend/
  main.py          # FastAPI app, CORS, routing, lifespan (DB create)
  config.py        # Settings (DB URL, JWT config) via .env
  database.py      # SQLAlchemy engine + SessionLocal + Base
  models.py        # User, Task ORM models
  schemas.py       # Pydantic models (User, Token, Task)
  auth.py          # Hash/verify password, JWT helpers, auth dependencies
  create_db.py     # Script to create PostgreSQL database if missing
  routers/
    auth.py        # /api/v1/auth – register & login
    tasks.py       # /api/v1/tasks – tasks CRUD with RBAC

frontend/
  public/          # React static assets
  src/
    api.js         # API client (fetch wrapper, auth headers)
    App.js         # Routing + auth state
    Login.js       # Login form
    Register.js    # Registration form
    Dashboard.js   # Protected tasks UI
```

---

## Troubleshooting

- **`database "rest_api_db" does not exist`**  
  Run `python create_db.py` in `backend/` after configuring `.env`, or create the DB manually.

- **`fastapi` not found (in terminal)**  
  Make sure the venv is activated, then `pip install -r requirements.txt`. Use `python -m uvicorn main:app --reload` instead of bare `uvicorn` if needed.

- **Frontend can’t reach backend / CORS errors**  
  Backend CORS allows `http://localhost:3000`. Ensure `REACT_APP_API_URL=http://localhost:8000` and that backend is running on port 8000.

- **401 Unauthorized from tasks endpoints**  
  Log in again; token may be expired or missing. The React dashboard automatically logs out and redirects on 401.

---

## Scalability & Deployment Notes

- **Stateless API:** JWT-based auth lets you scale horizontally without server-side sessions.
- **Database:** Use connection pooling and add read replicas for heavy read workloads.
- **Caching:** Introduce Redis to cache frequently accessed data (e.g., task lists) or token blacklists.
- **Deploy:** Run behind a reverse proxy (e.g., Nginx), use multiple workers (Gunicorn + Uvicorn), and containerize with Docker/Kubernetes for auto‑scaling and load balancing.
