import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const BASE_URL = "http://localhost:5000/api";

const AnalyticsDashboard = () => {
  const [donationTrends, setDonationTrends] = useState([]);
  const [warehouseStats, setWarehouseStats] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [allDonors, setAllDonors] = useState([]);

  const [previewData, setPreviewData] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    received: 0,
    transit: 0,
    delivered: 0,
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  /* ------------------ FETCH DATA ------------------ */
  const fetchAnalytics = async () => {
  try {
    const trendsRes = await axios.get(`${BASE_URL}/admin/analytics/donation-trends`, authHeader);
    const warehouseRes = await axios.get(`${BASE_URL}/admin/analytics/warehouse-stats`, authHeader);
    const topDonorsRes = await axios.get(`${BASE_URL}/admin/analytics/top-donors`, authHeader);
    const allDonorsRes = await axios.get(`${BASE_URL}/admin/analytics/all-donors`, authHeader);

    // Make sure these are arrays
    setDonationTrends(Array.isArray(trendsRes.data) ? trendsRes.data : []);
    setWarehouseStats(Array.isArray(warehouseRes.data) ? warehouseRes.data : []);
    setTopDonors(Array.isArray(topDonorsRes.data) ? topDonorsRes.data : []);
    setAllDonors(Array.isArray(allDonorsRes.data) ? allDonorsRes.data : []);

  } catch (error) {
    console.error("Failed to load analytics", error);
  }
};

/*load stats*/
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
    fetchAnalytics();
    loadStats();
  }, []);


  /* ------------------ CHART DATA ------------------ */

const donationTrendChart = {
  labels: donationTrends.map(item =>
    new Date(item.date).toLocaleDateString()
  ),
  datasets: [
    {
      label: "Donations per Day",
      data: donationTrends.map(item => item.count),
      borderWidth: 2,
      fill: false,
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

const warehouseChart = {
  labels: warehouseStats.map(item => item.warehouse || "Unknown"),
  datasets: [
    {
      label: "Donations by Warehouse",
      data: warehouseStats.map(item => item.count),
      backgroundColor: "rgba(153, 102, 255, 0.6)",
    },
  ],
};


const donorChart = {
  labels: topDonors.map(d => d.name),
  datasets: [
    {
      label: "Impact Points",
      data: topDonors.map(d => d.impact_points || d.impactPoints), // match backend column
      backgroundColor: "rgba(255, 159, 64, 0.5)",
    },
  ],
};

  /* ------------------ REPORT & PRINT ------------------ */
  const previewReport = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/admin/analytics/report/preview",
    authHeader
  );
  setPreviewData(res.data);
};

const downloadPDF = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/analytics/report/pdf`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob", // important to get binary data
      }
    );

    // Create a blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Aidify_Analytics_Report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Failed to download PDF", error);
    alert("Failed to download report");
  }
};


  const printDashboard = () => {
    window.print();
  };

  return (
    <>
    <div className="bgadmin">
    <div className="container mt-4 ">
        <br/><br/>
      <h2 className="mb-4">📊 Analytics Dashboard</h2>

      {/* KPI CARDS */}
      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Total Donations</h6>
            <h3>{stats.total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Donation Requests</h6>
            <h3>{stats.sub}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>In Transit</h6>
            <h3>{stats.transit}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Delivered</h6>
            <h3>{stats.delivered}</h3>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Donation Trends</h6>
            <Line data={donationTrendChart} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Warehouse Distribution</h6>
            <Bar data={warehouseChart} />
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card p-3 shadow-sm">
            <h6>Top Donors</h6>
            <Bar data={donorChart} />
          </div>
        </div>
      </div>

      {/* ALL DONORS TABLE */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card p-3 shadow-sm">
            <h6>All Donors</h6>

            <div style={{maxheight: "300px", overflow: "auto"}}>
            <div class="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Impact Points</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {allDonors.map((donor) => (
                  <tr key={donor.user_id}>
                    <td>{donor.user_id}</td>
                    <td>{donor.name}</td>
                    <td>{donor.email}</td>
                    <td>{donor.impactPoints || donor.impact_points}</td>
                    <td>{new Date(donor.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="d-flex gap-3 mb-4">
        <button
            className="btn btn-primary"
            onClick={() => {
                console.log("BUTTON CLICKED");
                previewReport();
            }}
            >
            Generate Report
            </button>

        <button className="btn btn-secondary" onClick={printDashboard}>
          Print Dashboard
        </button>
      </div>

      {/* ---------- REPORT PREVIEW ---------- */}
{previewData && (
  <div className="card p-3 mb-4">
    <h5>📄 Report Preview</h5>
    <p><strong>Total Donations:</strong> {previewData.totalDonations}</p>
    <p><strong>Delivered:</strong> {previewData.delivered}</p>
    <p><strong>In Transit:</strong> {previewData.inTransit}</p>

    <h6>Top Donors:</h6>
    <ul>
      {previewData.topDonors.map((d, idx) => (
        <li key={idx}>{d.name} - Impact Points: {d.impact_points}</li>
      ))}
    </ul>
    <br/><br/>
    <span class="border"></span>
    <br/><br/>
    <h6>Donors:</h6>
    <br/>
    <div class="table-responsive">
    <table className="table table-striped table-hover">
    <thead>
        <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Joined</th>
        </tr>
    </thead>
    <tbody>
        {previewData.donors.map((d, idx) => (
        <tr key={idx}>
            <td>{d.user_id}</td>
            <td>{d.name}</td>
            <td>{d.email}</td>
            <td>{new Date(d.created_at).toLocaleDateString()}</td>
        </tr>
        ))}
    </tbody>
    </table>
    </div>

    <br/><br/>
    <span class="border"></span>
    <br/><br/>
    <h6>Recent Donations:</h6>
    <br/>
    <div style={{maxheight: "300px", overflow: "auto"}}>
    <table className="table table-striped table-hover">
    <thead>
        <tr>
        <th>ID</th>
        <th>Item Name</th>
        <th>Category</th>
        <th>Status</th>
        <th>Donor</th>
        <th>Created At</th>
        <th>Image</th>
        </tr>
    </thead>
    <tbody>
        {previewData.donations.map((don, idx) => (
        <tr key={idx}>
            <td>{don.donation_id}</td>
            <td>{don.item_name}</td>
            <td>{don.item_category}</td>
            <td>{don.status}</td>
            <td>{don.donor_name}</td>
            <td>{new Date(don.created_at).toLocaleDateString()}</td>
            <td>
            {don.image_url && (
                <img 
                src={`http://localhost:5000/${don.image_url}`} 
                alt="donation" 
                width={50} 
                style={{ marginLeft: 10 }} 
                />
            )}
            </td>
        </tr>
        ))}
    </tbody>
    </table>
</div>
    <br/><br/>
    <span class="border"></span>
    <br/><br/>
    <h6>Warehouses:</h6>
    <br/>
    <div style={{maxheight: "300px", overflow: "auto"}}>
    <div class="table-responsive">
    <table className="table table-striped table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Warehouse Name</th>
                <th>Warehouse Location</th>
                <th>Warehouse Capacity</th>
            </tr>
        </thead>

        <tbody>
        {previewData.warehouses.map((w, idx) => (
        <tr key={idx}>
            <td>{w.warehouse_id}</td>
            <td>{w.name}</td>
            <td>{w.location}</td>
            <td>{w.capacity}</td>
        </tr>
        ))}
    </tbody>
    </table>
    </div>
    </div>

    <div className="d-flex gap-3 mb-4">
        <button
            className="btn btn-warning"
            onClick={() => {
                console.log("BUTTON CLICKED");
                downloadPDF();
            }}
            >
            download Report
            </button>
      </div>
  </div>
)}

    </div>
    <br/><br/><br/>
    </div></>
  );
};


export default AnalyticsDashboard;
