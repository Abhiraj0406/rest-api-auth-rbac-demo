import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from './api';

export default function Register({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(email, password, fullName || null);
      setSuccess('Account created. Logging you in...');
      const { login } = await import('./api');
      const data = await login(email, password);
      onLogin(data.access_token, data.user);
    } catch (err) {
      const msg = Array.isArray(err.detail) ? err.detail.map(d => d.msg).join(' ') : (err.detail?.message || err.detail || 'Registration failed.');
      setError(msg);
    }
  }

  return (
    <div style={styles.container}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
        <input type="text" placeholder="Full name (optional)" value={fullName} onChange={e => setFullName(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <p><Link to="/login">Login</Link></p>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: '40px auto', padding: 20, fontFamily: 'sans-serif' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: 10, fontSize: 16 },
  button: { padding: 12, background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16 },
  error: { color: 'red', margin: 0 },
  success: { color: 'green', margin: 0 },
};
