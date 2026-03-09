import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  useEffect(() => {
    if (token && userStr) setUser(JSON.parse(userStr));
  }, [token, userStr]);

  const onLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={onLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={onLogin} />} />
        <Route path="/" element={user ? <Dashboard user={user} onLogout={onLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
