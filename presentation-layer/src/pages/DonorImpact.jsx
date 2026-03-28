import { useEffect, useState } from "react";
import axios from "axios";


const DonorImpact = () => {
  const [impact, setImpact] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    loadImpact();
  }, []);

  const loadImpact = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations/donor-impact",
        { headers }
      );
      setImpact(res.data);
    } catch (err) {
      alert("Failed to load impact dashboard");
    }
  };

  if (!impact) return null;

  return (
    <>
      
      <div className="bgdonor3">
      <div className="container mt-4">
        <br/><br/><br/>
        <h3>🌍 Your Donation Impact</h3>

        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5>Total Donations</h5>
              <h2>{impact.totalDonations}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5>Items Donated</h5>
              <h2>{impact.totalItems}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm">
              <h5>Impact Points</h5>
              <h2>{impact.impactPoints}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center p-3 shadow-sm bg-light">
              <h6>💖Thank You</h6>
              <p className="mb-0">
                You’ve helped <b>{impact.totalItems}</b> people with your kindness!
              </p>
            </div>
          </div>
        </div>

        <hr />

        <h5>Donation Status Breakdown</h5>
        <div className="table-responsive">
        <table className="table table-bordered mt-2 table-hover">
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {impact.statusData.map((s) => (
              <tr key={s.status}>
                <td>{s.status}</td>
                <td>{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      </div>
    </>
  );
};

export default DonorImpact;