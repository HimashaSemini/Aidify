import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, role, user } = res.data;

      // 🔐 Save token
      localStorage.setItem("token", token);

      // 👤 Save user (CONSISTENT KEY)
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: user.id,
          name: user.name,
          email: user.email,
          role: role,
        })
      );

      // 🌍 Auth context
      login({
        userId: user.id,
        name: user.name,
        email: user.email,
        role,
        token,
      });

      // 🚀 Redirect
      navigate(role === "admin" ? "/admin-dashboard" : "/donor-dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    }
  };

  return (
    <>
    <div className="login-page">
    <div className="login-container">
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
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

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <p className="mt-3 text-center">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
      </div>
      </div>
    </>
  );
};

export default Login;
