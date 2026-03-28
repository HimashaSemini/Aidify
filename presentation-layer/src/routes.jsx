// src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreateWarehouse from "./pages/CreateWarehouse.jsx";
import DonationTracking from "./pages/DonationTracker.jsx";
import AdminReceived from "./pages/AdminReceived.jsx";
import CreateAdmin from "./pages/CreateAdmin.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminScheduleDonations from "./pages/AdminDonationSchedule.jsx";
import AdminInTransit from "./pages/AdminTransit.jsx";
import AdminDelivered from "./pages/AdminDelivered.jsx";
import AdminDeliveryConfirm from "./pages/AdminDeliveryConfirm.jsx";
import DonorImpact from "./pages/DonorImpact.jsx";
import DonorLeaderboard from "./pages/DonorLeaderboard.jsx";
import AnalyticsDashboard from "./pages/AnalyticsDashboard.jsx";
import AdminList from "./pages/AdminList.jsx";
import CreateDonation from "./pages/DonateItem.jsx";
import AdminContactMessages from "./pages/AdminContactMessages.jsx";
import Profile from "./pages/Profile.jsx";
import MyDonations from "./pages/MyDonations.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/donor-dashboard" element={<DonorDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/create-donation" element={<CreateDonation />} />
      <Route path="/donor-impact" element={<DonorImpact />} />
      <Route path="/create-warehouse" element={<CreateWarehouse />} />
      <Route path="/admin-schedule" element={<AdminScheduleDonations />} />
      <Route path="/admin-received" element={<AdminReceived />} />
      <Route path="/admin-in-transit" element={<AdminInTransit />} />
      <Route path="/admin-confirm-delivery" element={<AdminDeliveryConfirm />} />
      <Route path="/admin-delivered" element={<AdminDelivered />} />
      <Route path="/leaderboard" element={<DonorLeaderboard />} />
      <Route path="/donations/my/latest" element={<DonationTracking />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/admin/create-admin" element={user?.role === "admin" ? <CreateAdmin /> : <Navigate to="/login" />}/>
      <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
      <Route path="/list" element={<AdminList />} />
      <Route path="/admin/messages" element={<AdminContactMessages />} />
      <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/my-donations" element={<MyDonations />} />


    </Routes>
  );
};

export default AppRoutes;
