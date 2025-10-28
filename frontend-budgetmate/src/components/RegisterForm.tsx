
import React, { useState, ChangeEvent, FormEvent  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = false;

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const navigate = useNavigate();
  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  
  axios
    .post("http://localhost:8080/api/auth/register", form)
    .then((res) => {
      console.log("User registered: " + res.data.username);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("username", res.data.username);
      navigate("/dashboard");
    })
    .catch((err) => {
      const errorMsg =
        err.response?.data?.message || err.message || "Registration failed";
      alert("Registration failed: " + errorMsg);
    });
};


return (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white text-center ">
            <h2 className="mb-0">
              <i className="fas fa-user-plus me-2"></i>
              Register
            </h2>
            <p className="mb-0 mt-2 opacity-75">Create your BudgetMate account</p>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold text-dark">
                  <i className="fas fa-user me-2 text-primary"></i>
                  Username
                </label>
                <input 
                  id="username"
                  name="username" 
                  placeholder="Enter your Username" 
                  onChange={handleChange} 
                  className="form-control form-control-lg"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold text-dark">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  Email
                </label>
                <input 
                  id="email"
                  name="email" 
                  type="email" 
                  placeholder="Enter your Email" 
                  onChange={handleChange} 
                  className="form-control form-control-lg"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-bold text-dark">
                  <i className="fas fa-lock me-2 text-primary"></i>
                  Password
                </label>
                <input 
                  id="password"
                  name="password" 
                  type="password" 
                  placeholder="Enter your Password" 
                  onChange={handleChange} 
                  className="form-control form-control-lg"
                />
                <div className="form-text">
                  <i className="fas fa-info-circle me-1"></i>
                  Choose a strong password for your account
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold">
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </button>
            </form>
          </div>
          <div className="card-footer text-center py-3 bg-light border-0">
            <small className="text-muted">
              Already have an account? 
              <a href="/" className="text-primary text-decoration-none ms-1 fw-semibold">
                Login here
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default RegisterForm;