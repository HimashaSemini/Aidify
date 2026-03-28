import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [impact, setImpact] = useState(null);
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const loadImpact = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations/donor-impact",
        { headers }
      );
      setImpact(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load donor dashboard");
    }
  };

  useEffect(() => {
    loadImpact();
  }, []);

  if (!impact) return null;

  return (
    <>
      <div className="bgdonor">
      <br/><br/><br/>
      <div className="container mt-2">
        {/* WELCOME */}
        <h2>👋 Welcome, {impact.donorName}</h2>
        <p className="text-muted">
          Thank you for making a real difference 💚
        </p>

        {/* IMPACT CARDS */}
        <div className="row g-4 mt-3">
          <div className="col-md-4">
            <div className="card text-bg-success shadow">
              <div className="card-body text-center">
                <h5>Delivered Donations</h5>
                <h2>{impact.totalDonations}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-bg-info shadow">
              <div className="card-body text-center">
                <h5>Items Donated</h5>
                <h2>{impact.totalItems}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-bg-warning shadow">
              <div className="card-body text-center">
                <h5>Impact Points ⭐</h5>
                <h2>{impact.impactPoints}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS OVERVIEW */}
        <div className="mt-5">
          <h4>📦 Donation Status Overview</h4>

          <div className="row mt-3">
            {impact.statusData.map((s) => (
              <div key={s.status} className="col-md-2 col-6 mb-3">
                <div className="border rounded p-3 text-center">
                  <h6>{s.status}</h6>
                  <strong>{s.count}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-5">
          <h4>⚡ Quick Actions</h4>

          <div className="d-flex flex-wrap gap-3 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/create-donation")}
            >
              ➕ New Donation
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/my-donations")}
            >
              📄 My Donations
            </button>

            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/donor-impact")}
            >
              📊 Impact Dashboard
            </button>

            <button
              className="btn btn-outline-dark"
              onClick={() => navigate("/leaderboard")}
            >
              🏆 Leaderboard
            </button>
          </div>
          <br/><br/><br/><br/><br/><br/><br/>
        </div>
      </div>
      </div>
    </>
  );
};

export default DonorDashboard;
