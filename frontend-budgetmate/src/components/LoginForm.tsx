import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    axios.post('http://localhost:8080/api/auth/login', { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token); // or res.data.userId
        localStorage.setItem('userId', res.data.id); 
        // Example during login/register
localStorage.setItem('username', res.data.username);

        navigate('/dashboard');
      })
      .catch(() => alert('Invalid credentials!'));
  };

return (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white text-center">
            <h2 className="mb-0">
              <i className="fas fa-sign-in-alt me-2"></i>
              Login
            </h2>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="fas fa-envelope me-1 text-primary"></i>
                  Email
                </label>
                <input 
                  className="form-control" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter your email"
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="fas fa-lock me-1 text-primary"></i>
                  Password
                </label>
                <input 
                  className="form-control" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                  required 
                />
              </div>
              <button className="btn btn-primary w-100 py-2 fw-semibold" type="submit">
                <i className="fas fa-sign-in-alt me-2"></i>
                Login
              </button>
            </form>
          </div>
          <div className="card-footer text-center py-3 bg-light">
            <small className="text-muted">
              Don't have an account? 
              <a href="/register" className="text-primary text-decoration-none ms-1">
                Register here
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default LoginForm;
