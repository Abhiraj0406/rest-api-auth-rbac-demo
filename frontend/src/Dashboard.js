import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);

  function showError(msg) {
    setError(msg);
    setSuccess('');
    setTimeout(() => setError(''), 4000);
  }
  function showSuccess(msg) {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 4000);
  }

  async function loadTasks() {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 401) {
        onLogout();
        return;
      }
      showError(typeof err.detail === 'string' ? err.detail : (err.detail?.detail || 'Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setError('');
    try {
      await createTask(title.trim(), description.trim() || null);
      showSuccess('Task created.');
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      const msg = typeof err.detail === 'string' ? err.detail : (Array.isArray(err.detail) ? err.detail.map(d => d.msg).join(' ') : 'Create failed');
      showError(msg);
    }
  }

  async function handleUpdate(id) {
    setError('');
    try {
      await updateTask(id, { title: editTitle, description: editDesc, completed: editCompleted });
      showSuccess('Task updated.');
      setEditingId(null);
      loadTasks();
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      showError(typeof err.detail === 'string' ? err.detail : 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    setError('');
    try {
      await deleteTask(id);
      showSuccess('Task deleted.');
      loadTasks();
    } catch (err) {
      if (err.status === 401) { onLogout(); return; }
      showError(typeof err.detail === 'string' ? err.detail : 'Delete failed');
    }
  }

  function startEdit(t) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDesc(t.description || '');
    setEditCompleted(t.completed);
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span>Dashboard – {user?.email} ({user?.role})</span>
        <button onClick={onLogout} style={styles.logout}>Logout</button>
      </header>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleCreate} style={styles.form}>
        <input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
        <input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.btnAdd}>Add Task</button>
      </form>

      <h2>Tasks</h2>
      {loading ? <p>Loading...</p> : (
        <ul style={styles.list}>
          {tasks.map(t => (
            <li key={t.id} style={styles.item}>
              {editingId === t.id ? (
                <>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={styles.input} />
                  <input value={editDesc} onChange={e => setEditDesc(e.target.value)} style={styles.input} />
                  <label><input type="checkbox" checked={editCompleted} onChange={e => setEditCompleted(e.target.checked)} /> Done</label>
                  <button onClick={() => handleUpdate(t.id)} style={styles.btnSave}>Save</button>
                  <button onClick={() => setEditingId(null)} style={styles.btnCancel}>Cancel</button>
                </>
              ) : (
                <>
                  <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}{t.description ? ` – ${t.description}` : ''}</span>
                  <button onClick={() => startEdit(t)} style={styles.btnSm}>Edit</button>
                  <button onClick={() => handleDelete(t.id)} style={styles.btnSmDanger}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {!loading && tasks.length === 0 && <p>No tasks yet. Add one above.</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '20px auto', padding: 20, fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logout: { padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 },
  input: { padding: 10, fontSize: 14 },
  button: { padding: 10, background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
  btnAdd: { padding: 10, background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' },
  btnSave: { padding: 6, background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginLeft: 8 },
  btnCancel: { padding: 6, background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', marginLeft: 4 },
  btnSm: { padding: 4, marginLeft: 8, cursor: 'pointer' },
  btnSmDanger: { padding: 4, marginLeft: 4, color: '#dc3545', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  item: { padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  error: { color: 'red', margin: '0 0 10px 0' },
  success: { color: 'green', margin: '0 0 10px 0' },
};
