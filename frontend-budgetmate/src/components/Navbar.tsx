import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to={isLoggedIn ? "/dashboard" : "/"}>
          <i className="fas fa-wallet me-2"></i>
          BudgetMate
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-bold"
                    style={{ fontSize: '20px' }} to="/">
                    Login </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-bold"
                    style={{ fontSize: '20px' }} to="/register">
                    Register
                  </Link> </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-bold"
                    style={{ fontSize: '20px' }}
                    to="/dashboard"
                  >
                    <i className="fas fa-home me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-bold"
                    style={{ fontSize: '20px' }}
                    to="/charts"
                  >
                    <i className="fas fa-chart-pie me-1"></i> Charts
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-3"
                    style={{ fontSize: '18px' }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>);};

export default Navbar;
