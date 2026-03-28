import React from "react";
import { Link } from "react-router-dom";
import "../styles/All.css";

const Home = () => {
  return (
      <>
      <div className="home-bg">
      <div className="container mt-5 text-center">
        <h1>Welcome to Aidify</h1>
        <p>Your platform for donating items and helping communities.</p>

        <div className="mt-4">
          <Link to="/login" className="btn btn-primary mx-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-success mx-2">
            Register
          </Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default Home;






  





