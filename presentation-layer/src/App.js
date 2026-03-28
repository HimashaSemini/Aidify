import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreateDonation from "./pages/DonateItem.jsx";
import CreateAdmin from "./pages/CreateAdmin.jsx";
import CreateWarehouse from "./pages/CreateWarehouse.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ManageWarehouses from "./pages/ManageWarehouses.jsx";
import AdminScheduleDonations from "./pages/AdminDonationSchedule.jsx";
import AdminReceived from "./pages/AdminReceived.jsx";
import AdminInTransit from "./pages/AdminTransit.jsx";
import AdminDelivered from "./pages/AdminDelivered.jsx";
import AdminDeliveryConfirm from "./pages/AdminDeliveryConfirm.jsx";
import DonorImpact from "./pages/DonorImpact.jsx";
import DonorLeaderboard from "./pages/DonorLeaderboard.jsx";
import AnalyticsDashboard from "./pages/AnalyticsDashboard.jsx";
import AdminList from "./pages/AdminList.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AdminContactMessages from "./pages/AdminContactMessages.jsx";
import DonationTracking from "./pages/DonationTracker.jsx";
import Profile from "./pages/Profile.jsx";
import MyDonations from "./pages/MyDonations.jsx";

import VNavbar from "./components/vNavBar.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
    <div className="app-wrapper">
      {/* Navbar switch */}
      {!token ? <VNavbar /> : <Navbar />}

      <main className="content">
      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />

        <Route path="/my-donations" element={<MyDonations />} />

        {/* ---------- DONOR ---------- */}
        <Route
          path="/donor-dashboard"
          element={
            user?.role === "donor" ? <DonorDashboard /> : <Navigate to="/" />
          }
        />

        <Route
          path="/create-donation"
          element={
            user?.role === "donor" ? <CreateDonation /> : <Navigate to="/" />
          }
        />

        <Route
          path="/donor-impact"
          element={
            user?.role === "donor" ? <DonorImpact /> : <Navigate to="/" />
          }
        />

        <Route
          path="/my/latest"
          element={
            user?.role === "donor" ? <DonationTracking /> : <Navigate to="/" />
          }
        />


        {/* ---------- SHARED ---------- */}
        <Route
          path="/leaderboard"
          element={
            user?.role === "donor" || user?.role === "admin"
              ? <DonorLeaderboard />
              : <Navigate to="/" />
          }
        />

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />

        <Route
          path="/warehouses"
          element={
            user?.role === "admin" ? <ManageWarehouses /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin-schedule"
          element={
            user?.role === "admin"
              ? <AdminScheduleDonations />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin-received"
          element={
            user?.role === "admin" ? <AdminReceived /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin-in-transit"
          element={
            user?.role === "admin" ? <AdminInTransit /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin-confirm-delivery"
          element={
            user?.role === "admin"
              ? <AdminDeliveryConfirm />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin-delivered"
          element={
            user?.role === "admin" ? <AdminDelivered /> : <Navigate to="/" />
          }
        />

        <Route
          path="/analytics-dashboard"
          element={
            user?.role === "admin"
              ? <AnalyticsDashboard />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/list"
          element={user?.role === "admin" ? <AdminList /> : <Navigate to="/" />}
        />

        <Route
          path="/create-warehouse"
          element={
            user?.role === "admin" ? <CreateWarehouse /> : <Navigate to="/" />
          }
        />

        <Route
          path="/create-admin"
          element={
            user?.role === "admin" ? <CreateAdmin /> : <Navigate to="/login" />
          }
        />

        <Route 
          path="/admin/messages" 
          element= {user?.role === "admin" ? <AdminContactMessages />: <Navigate to="/" />
          }
        />
      </Routes>
      </main>

      <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
