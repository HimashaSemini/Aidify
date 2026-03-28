// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";
import "../styles/reg.css"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role: "donor",
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(
        "Registration failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="card auth-card">
          <div className="card-body">
            <h3 className="auth-title">Create Account</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-success w-100 auth-btn">
                Register
              </button>
            </form>

            <p className="auth-link">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
