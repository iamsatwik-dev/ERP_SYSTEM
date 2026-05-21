import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Admin.css';

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo credentials
    if (email === 'manager@gmail.com' && password === 'manager123') {
      try { localStorage.setItem('isManager', 'true'); } catch(e) {}
  try { window.dispatchEvent(new Event('authChanged')); } catch(e) {}
  try { window.location.href = '/manager'; } catch(e) { navigate('/manager'); }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header"><h2>Manager Login</h2></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
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

export default ManagerLogin;
