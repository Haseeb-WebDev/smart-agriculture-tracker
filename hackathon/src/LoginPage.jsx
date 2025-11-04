import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setIsLoggedIn, setUserRole }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('farmer');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    // Store user data in localStorage (fake auth)
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);

    // Update App state
    setIsLoggedIn(true);
    setUserRole(role);

    // Redirect based on role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/farmer');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🌾 Smart Agriculture Market Tracker</h1>
          <p>Empowering farmers with real-time market insights</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Login As</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Mode - No real authentication required</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;