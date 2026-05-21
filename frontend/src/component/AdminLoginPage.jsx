import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Admin.css';
import '../Login.css';


const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please fill in all fields');

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminName', data.name || 'Admin');
      localStorage.setItem('adminEmail', data.email || email);
      try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
      try { window.location.href = '/admin'; } catch (e) { navigate('/admin'); }
    } catch {
      setError('Network error. Is the server running?');
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header"><h2>Admin Login</h2></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
                style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>
          {error && <div style={{ color: '#d9534f', marginTop: 8 }}>{error}</div>}
          <div className="button-group">
            <button className="ok-btn" type="submit" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setEmail(''); setPassword(''); setError(''); }}
            >
              Clear
            </button>
          </div>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/admin-signup" style={{ color: '#2a78d4', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
