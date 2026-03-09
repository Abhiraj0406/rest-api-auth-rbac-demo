# Project Setup Instructions – REST API + React (FastAPI + PostgreSQL)

**Stack:** Backend = Python (FastAPI) + PostgreSQL | Frontend = React.js

---

## Prerequisites (install these first)

| Tool | Purpose | Check |
|------|--------|--------|
| **Python 3.11 or 3.12** | Backend (required) | `python --version` |
| **Node.js 18+** | Frontend | `node --version` |
| **PostgreSQL** | Database | `psql --version` (or use pgAdmin) |
| **Git** | Version control | `git --version` |

**Important:** Use **Python 3.11 or 3.12** for the backend. Python 3.15 (and other very new versions) often lack pre-built wheels for `pydantic-core` and will try to compile from source (Rust/Cargo), which causes install failures. If you only have 3.15, install 3.12 from [python.org](https://www.python.org/downloads/) and use it for this project.

---

## Step 1 – Create project folder structure

From your workspace root (e.g. `E:\Desktop\rest-api-auth-rbac-demo`):

```powershell
# You're already in the project folder; create backend & frontend
mkdir backend
mkdir frontend
```

**Target structure:**
```
rest-api-auth-rbac-demo/
├── backend/          # FastAPI app
├── frontend/         # React app
├── README.md         # (we'll add later)
└── SETUP_INSTRUCTIONS.md  # this file
```

---

## Step 2 – Backend setup (FastAPI + PostgreSQL)

### 2.1 Go to backend folder and create virtual environment

Use **Python 3.11 or 3.12** (not 3.15). On Windows you can use the Python Launcher:

```powershell
cd backend
# If you have Python 3.12 installed (recommended):
py -3.12 -m venv venv
# Or if your default python is already 3.11/3.12:
python -m venv venv
```

### 2.2 Activate virtual environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

You should see `(venv)` in the prompt.

### 2.3 Install backend dependencies

Create `backend/requirements.txt` with:

```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.9
pydantic[email-validator]>=2.5.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6
```

Then run:

```powershell
pip install -r requirements.txt
```

### 2.4 PostgreSQL setup

1. Open **pgAdmin** or **psql** and create a database, e.g. `rest_api_db`.
2. Create a user (optional) or use your default superuser.
3. Note: **host**, **port** (usually 5432), **database name**, **username**, **password**.

Example (psql):

```sql
CREATE DATABASE rest_api_db;
```

### 2.5 Environment variables for backend

Create `backend/.env` (do **not** commit this file; we'll add it to `.gitignore`):

```env
DATABASE_URL=postgresql://username:password@localhost:5432/rest_api_db
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace `username`, `password`, and `rest_api_db` with your PostgreSQL credentials. Use a long random string for `SECRET_KEY` in production.

---

## Step 3 – Frontend setup (React)

### 3.1 Create React app

From project root (`E:\Desktop\rest-api-auth-rbac-demo`):

```powershell
cd E:\Desktop\rest-api-auth-rbac-demo
npx create-react-app frontend
```

If it asks to install `create-react-app`, accept. Wait for the install to finish.

### 3.2 Optional: use Vite (faster alternative)

If you prefer Vite:

```powershell
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 3.3 Frontend env for API URL

Create `frontend/.env` (or `.env.local`):

```env
REACT_APP_API_URL=http://localhost:8000
```

For Vite use: `VITE_API_URL=http://localhost:8000`.

---

## Step 4 – Git and GitHub (step-by-step push)

### 4.1 Initialize Git (once)

From project root:

```powershell
cd E:\Desktop\rest-api-auth-rbac-demo
git init
```

### 4.2 Create `.gitignore`

Create `.gitignore` in the project root with at least:

```gitignore
# Backend
backend/venv/
backend/.env
backend/__pycache__/
backend/*.pyc
backend/.pytest_cache/

# Frontend
frontend/node_modules/
frontend/build/
frontend/.env
frontend/.env.local

# IDE / OS
.idea/
.vscode/
*.log
.DS_Store
Thumbs.db
```

### 4.3 Create repo on GitHub

1. Go to [github.com](https://github.com) → **New repository**.
2. Name it e.g. `rest-api-auth-rbac-demo`.
3. Do **not** add README, .gitignore, or license (we already have .gitignore).
4. Copy the repo URL (e.g. `https://github.com/YOUR_USERNAME/rest-api-auth-rbac-demo.git`).

### 4.4 First commit and push

```powershell
git add .
git status
git commit -m "Initial project structure: FastAPI backend + React frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rest-api-auth-rbac-demo.git
git push -u origin main
```

Replace the URL with your actual GitHub repo URL.

### 4.5 Push step-by-step as you build

After each logical chunk of work (e.g. “auth APIs done”, “CRUD done”, “frontend login”):

```powershell
git add .
git status
git commit -m "Brief description, e.g. Add user registration and login APIs"
git push
```

**Example commit sequence:**

1. `Initial project structure: FastAPI backend + React frontend`
2. `Add user model, registration and login with JWT`
3. `Add role-based access (user vs admin)`
4. `Add tasks CRUD APIs and API versioning`
5. `Add Swagger docs and error handling`
6. `Add React auth UI and protected dashboard`
7. `Add React CRUD UI and error/success messages`
8. `Add README and scalability note`

---

## Step 5 – Verify setup

### Backend

```powershell
cd backend
.\venv\Scripts\Activate
uvicorn main:app --reload
```

If you have a `main.py` that defines `app`, you should see the server at `http://localhost:8000`. (We'll add `main.py` when we build the API.)

### Frontend

```powershell
cd frontend
npm start
```

React app should open at `http://localhost:3000`.

---

## Quick checklist before coding

- [ ] `backend/` with `venv`, `requirements.txt`, `.env`
- [ ] `frontend/` created with Create React App (or Vite)
- [ ] PostgreSQL database created and `DATABASE_URL` in `backend/.env`
- [ ] `.gitignore` in root (includes `venv`, `.env`, `node_modules`)
- [ ] Git initialized, remote added, first push done

Once this is done, tell me and we’ll implement the backend (auth, RBAC, CRUD, versioning, Swagger) and then the React UI, step by step with commits you can push after each step.

---

## Troubleshooting: "pydantic-core" / "Rust" / "Cargo" install error

If `pip install -r requirements.txt` fails with errors about **pydantic-core**, **Rust**, or **Cargo**, you are almost certainly using **Python 3.15** (or another very new version) for which pre-built wheels are not available.

**Fix:**

1. Install **Python 3.12** from [python.org](https://www.python.org/downloads/) (e.g. "Windows installer (64-bit)").
2. Remove the existing venv and recreate it with 3.12:

   ```powershell
   cd E:\Desktop\rest-api-auth-rbac-demo\backend
   Remove-Item -Recurse -Force venv
   py -3.12 -m venv venv
   .\venv\Scripts\Activate
   pip install -r requirements.txt
   ```

3. If `py -3.12` is not found, use the full path to Python 3.12, e.g. `C:\Users\admin\AppData\Local\Programs\Python\Python312\python.exe -m venv venv`.
