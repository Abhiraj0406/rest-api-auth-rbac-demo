const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('token');
}

export async function api(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export async function register(email, password, fullName) {
  return api('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name: fullName || null }),
  });
}

export async function login(email, password) {
  return api('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getTasks() {
  return api('/api/v1/tasks');
}

export async function createTask(title, description) {
  return api('/api/v1/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description: description || null }),
  });
}

export async function updateTask(id, data) {
  return api(`/api/v1/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id) {
  return api(`/api/v1/tasks/${id}`, { method: 'DELETE' });
}
