import { useEffect, useState } from "react";
import axios from "axios";


const DonorLeaderboard = () => {
  const [donors, setDonors] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // 🔑 Get logged-in user safely
  const currentUserId = JSON.parse(
    localStorage.getItem("user")
  )?.userId;

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const loadLeaderboard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/donations/leaderboard?month=${month}&year=${year}`,
        { headers }
      );
      setDonors(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to load leaderboard");
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [month, year]);

  return (
    <>
      <div className="bgdonor2">
      <div className="container mt-4">
        <br/><br/>
        <h3>🏆 Top Donors Leaderboard</h3>
        <br />
        <p>See who's making the biggest impact!</p>

        {/* Filters */}
        <div className="d-flex gap-3 mt-3 mb-3">
          <select
            className="form-select w-25"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Month {i + 1}
              </option>
            ))}
          </select>

          <select
            className="form-select w-25"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {/* Leaderboard Table */}
        <div class="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Impact Points</th>
              <th>Delivered Donations</th>
              <th>Items Donated</th>
            </tr>
          </thead>

          <tbody>
            {donors.map((d, index) => {
              const isCurrentUser =
                Number(d.user_id) === Number(currentUserId);

              return (
                <tr
                  key={d.user_id}
                  className={isCurrentUser ? "table-info" : ""}
                >
                  <td>
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>

                  <td>
                    {d.name}
                    {isCurrentUser && (
                      <span className="badge bg-primary ms-2">
                        You
                      </span>
                    )}
                  </td>

                  <td>{d.impact_points}</td>
                  <td>{d.total_donations}</td>
                  <td>{d.total_items}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        {donors.length === 0 && (
          <p className="text-muted">No donor data available</p>
        )}
      </div>
      </div>
    </>
  );
};

export default DonorLeaderboard;