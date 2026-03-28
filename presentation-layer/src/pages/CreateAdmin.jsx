import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext";

const CreateAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/create-admin",
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Admin created successfully");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <>
      <div className="bgadmin">
      <div className="container mt-5 " style={{ maxWidth: "500px" }}>
        <br/><br/>
        <h3>Create Admin</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-danger w-100">Create Admin</button>
        </form>
      </div>
      <br/><br/><br/>
    </div></>
  );
};

export default CreateAdmin;
