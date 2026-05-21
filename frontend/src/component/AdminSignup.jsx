import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Admin.css';
import '../Login.css';


const AdminSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (!form.secretKey.trim()) return 'Admin secret key is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          secretKey: form.secretKey.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminName', data.name);
      localStorage.setItem('adminEmail', data.email);
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
        <div className="admin-header"><h2>Admin Sign Up</h2></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
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
          <div className="input-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Admin Secret Key</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="secretKey"
                value={form.secretKey}
                onChange={handleChange}
                placeholder="Contact IT admin for this key"
                required
                style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          {error && <div style={{ color: '#d9534f', marginTop: 8 }}>{error}</div>}
          <div className="button-group">
            <button className="ok-btn" type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Sign Up'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setForm({ name: '', email: '', password: '', confirmPassword: '', secretKey: '' });
                setError('');
              }}
            >
              Clear
            </button>
          </div>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/admin-login" style={{ color: '#2a78d4', fontWeight: 600, textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
