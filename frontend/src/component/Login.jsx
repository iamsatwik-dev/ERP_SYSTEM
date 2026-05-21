import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    setUsername("");
    setPassword("");
  };

  const handleAdminClick = () => {
    try { window.location.href = '/admin'; } catch(e) { navigate('/admin'); }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <h2 className="title">Welcome to ABC IT Solutions</h2>

        <div>
          <button onClick={handleAdminClick} className="admin-btn">
            Admin
          </button>
        </div>

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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

        <div className="button-group">
          <button className="ok-btn">OK</button>
          <button onClick={handleReset} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
