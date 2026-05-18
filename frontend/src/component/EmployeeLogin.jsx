import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Admin.css';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const base = window.__BACKEND_URL__ || 'http://localhost:5000';
        const res = await fetch(`${base}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error || 'Invalid credentials');
          return;
        }
        const j = await res.json();
        // store token locally and mark as employee for UI gating
        try { localStorage.setItem('token', j.token); } catch {}
        try { localStorage.setItem('isEmployee', 'true'); localStorage.setItem('employeeEmail', email); } catch(e) {}
        try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}
        try { window.location.href = '/employee'; } catch(e) { navigate('/employee'); }
      } catch (err) {
        setError('Login failed');
      }
    })();
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header"><h2>Employee Login</h2></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: '#d9534f', marginTop: 8 }}>{error}</div>}
          <div className="button-group">
            <button className="ok-btn" type="submit">Login</button>
            <button type="button" className="cancel-btn" onClick={() => { setEmail(''); setPassword(''); setError(''); }}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
