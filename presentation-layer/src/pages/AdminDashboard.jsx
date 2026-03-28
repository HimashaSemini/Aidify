import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/All.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    received: 0,
    transit: 0,
    delivered: 0,
  });

  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const loadStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations",
        { headers }
      );

      const donations = res.data;

      setStats({
        total: donations.length,
        received: donations.filter(d => d.status === "Received").length,
        transit: donations.filter(d => d.status === "In Transit").length,
        delivered: donations.filter(d => d.status === "Delivered").length,
        sub: donations.filter(d => d.status === "Submitted").length,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4">
        <br/><br/>
        <h2 className="mb-4">📊 Admin Dashboard</h2>

        {/* STAT CARDS */}
        <div className="row g-4">
          <div className="col-md-12">
            <div className="card text-bg-primary shadow">
              <div className="card-body text-center">
                <h5>Total Donations</h5>
                <h2>{stats.total}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-bg-secondary shadow">
              <div className="card-body text-center">
                <h5>Donations Requests</h5>
                <h2>{stats.sub}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-bg-warning shadow">
              <div className="card-body text-center">
                <h5>Donations Received</h5>
                <h2>{stats.received}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-bg-info shadow">
              <div className="card-body text-center">
                <h5>Donations In Transit</h5>
                <h2>{stats.transit}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-bg-success shadow">
              <div className="card-body text-center">
                <h5>Delivered Donations</h5>
                <h2>{stats.delivered}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts could go here */}
        <div className="mt-5">
          <h4>📈 Analytics Overview</h4>
          <p>Detailed analytics and charts will be implemented here.</p>
          <div className="analytics-charts">
            <button className="btn btn-outline-secondary" onClick={() => navigate("/analytics-dashboard")}>
              View Analytics Dashboard
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-5">
          <h4>⚡ Quick Actions</h4>

          <div className="d-flex flex-wrap gap-3 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/admin-schedule")}
            >
              🗓️ Schedule New Donation
            </button>
            
            <button
              className="btn btn-outline-warning"
              onClick={() => navigate("/admin-received")}
            >
              📦 Manage Received
            </button>

            <button
              className="btn btn-outline-info"
              onClick={() => navigate("/admin-in-transit")}
            >
              🚚 Dispatch / In Transit
            </button>

            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/admin-delivered")}
            >
              ✅ Delivered Donations
            </button>

            <button
              className="btn btn-outline-dark"
              onClick={() => navigate("/leaderboard")}
            >
              🏆 Donor Leaderboard
            </button>
          </div>
        </div>
      </div><br/><br/><br/>
      </div>
    </>
  );
};

export default AdminDashboard;
