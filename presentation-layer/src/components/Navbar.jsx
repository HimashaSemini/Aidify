import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import '../App.css';
import NotificationDropdown from "./NotificationDropdown.jsx";
import { FaBell } from "react-icons/fa";
import Home from "../pages/Home.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const IMAGE_BASE = "http://localhost:5000/";

  const fixImageURL = (path) => {
    if (!path) return IMAGE_BASE + "uploads/profiles/default.png";

    // already full URL
    if (path.startsWith("http")) return path;

    // fix Windows backslashes
    path = path.replace(/\\/g, "/");

    // ensure uploads/ exists
    if (!path.startsWith("uploads")) {
      path = "uploads/" + path;
    }

    return IMAGE_BASE + path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Aidify
        </Link>

        <div>
                <FaBell
                  size={20}
                  className="text-black cursor-pointer"
                  onClick={() => setShowNotifications(!showNotifications)}
                />

                {showNotifications && <NotificationDropdown />}
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* DONOR */}
            {user?.role === "donor" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/donor-dashboard">
                    Home
                  </Link>
                </li>
              
                <li className="nav-item">
                <Link className="nav-link" to="/create-donation">
                  Donate
                </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/donor-impact">
                    My Donations Impact
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/my/latest">
                    Track Donation
                  </Link>

                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About Us
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">
                    Contact Us
                  </Link>
                </li>
              </>
            )}


            {/* ADMIN */}
            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-dashboard">
                    Admin Dashboard
                  </Link>
                </li>

                {/* donations Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="warehouseDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                     Manage Donations
                  </a>

                  <ul className="dropdown-menu" aria-labelledby="warehouseDropdown">
                    <li>
                      <Link className="dropdown-item" to="/admin-schedule">
                        Schedule Donations
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin-received">
                        Received Donations
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin-in-transit">
                        In Transit Donations
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin-confirm-delivery">
                        Confirm Deliveries
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin-delivered">
                        Delivered Donations
                      </Link>
                    </li>
                  </ul>
                </li>


                <li className="nav-item">
                  <Link className="nav-link" to="/create-admin">
                    Create Admin
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                
                <li className="nav-item">
                    <Link className="nav-link" to="/list">
                      Admin List
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="/admin/messages">
                      View Contact Messages
                    </Link>
                </li>
                {/* Warehouse Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="warehouseDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Warehouses
                  </a>

                  <ul className="dropdown-menu" aria-labelledby="warehouseDropdown">
                    <li>
                      <Link className="dropdown-item" to="/create-warehouse">
                        Create Warehouse
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/warehouses">
                        Manage Warehouses
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}

            </ul>
            
          <div className="ms-auto d-flex align-items-center">
            {user && (
              <Link
                to="/profile"
                className="d-flex align-items-center text-decoration-none nav-item ms-3 text-black"
              >
                <img
                  src={
                    user?.profile_image
                      ? fixImageURL(user.profile_image)
                      : IMAGE_BASE + "uploads/profiles/default.png"
                  }
                  alt="profile"
                  className="rounded-circle me-2"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
                <span>{user.name}</span>
              </Link>
            )}
          </div>

        {/* LOGOUT */}
            {user && (
              <div className="nav-item">
                <button
                  className="btn btn-light btn-sm ms-5 border"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}  
        </div>
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;
