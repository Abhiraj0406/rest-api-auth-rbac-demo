# REST API with Auth & Role-Based Access

FastAPI (Python) backend + React frontend. User registration/login with JWT, role-based access (user vs admin), and Tasks CRUD.

## Quick start

### Backend

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file (see `backend/.env.example`). Set `DATABASE_URL` for PostgreSQL.

```bash
uvicorn main:app --reload
```

API: http://localhost:8000  
Swagger: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
```

Set `REACT_APP_API_URL=http://localhost:8000` in `.env` or `.env.local`.

```bash
npm start
```

App: http://localhost:3000

### Database

PostgreSQL. Create a database and set `DATABASE_URL` in `backend/.env`. Tables are created on first run.

To create an admin user: register normally, then set `role = 'admin'` for that user in the `users` table.

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register |
| POST | `/api/v1/auth/login` | Login (returns JWT) |
| GET | `/api/v1/tasks` | List tasks (own or all if admin) |
| POST | `/api/v1/tasks` | Create task (auth) |
| GET/PATCH/DELETE | `/api/v1/tasks/{id}` | Get/update/delete task (auth, owner or admin) |

Protected routes require header: `Authorization: Bearer <token>`.

## Scalability note

- **Stateless API**: JWT allows horizontal scaling; no server-side session store.
- **Database**: Use connection pooling (e.g. SQLAlchemy pool settings); consider read replicas for heavy read load.
- **Caching**: Add Redis for token blacklist or hot data (e.g. task lists) to reduce DB load.
- **Deployment**: Run behind a reverse proxy (e.g. Nginx); use multiple uvicorn workers or Gunicorn+Uvicorn. Optional: containerize with Docker and orchestrate with Kubernetes for auto-scaling and load balancing.
