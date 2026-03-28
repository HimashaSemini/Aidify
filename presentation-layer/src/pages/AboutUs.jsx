import React from "react";
import "../styles/All.css";

const AboutUs = () => {
  return (
    <>
    <div className="bgdonor4">
    <div className="container mt-5">
        <br/><br/>
        
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="text-center mb-4">About Aidify</h2>
          <div className="card shadow-sm p-4">
            

            <p className="text-muted">
              <center>Aidify <br/>is a smart donation management system <br/>designed to improve
              transparency, efficiency, and donor engagement in physical item
              donations. <br/>The platform bridges the gap between donors and
              charitable organizations by providing real-time tracking,
              warehouse management, and AI-powered features.</center>
            </p>

            <h5 className="mt-4">🎯 Our Mission</h5>
            <p>
              To make physical donations transparent, trackable, and impactful
              using modern web technologies and artificial intelligence.
            </p>

            <h5 className="mt-3">🚀 Key Features</h5>
            <ul>
              <li>Item-based donation management</li>
              <li>Real-time donation tracking</li>
              <li>Warehouse and logistics management</li>
              <li>AI-based image classification</li>
              <li>AI-generated thank-you notes</li>
              <li>Impact points and leaderboard</li>
            </ul>

            <h5 className="mt-3">🤝 Who Can Use Aidify?</h5>
            <ul>
              <li>Donors who want transparent donation tracking</li>
              <li>Admins managing donations and warehouses</li>
              <li>Visitors interested in understanding the platform</li>
            </ul>
          </div>
          <br/><br/><br/>
        </div>
      </div>
    </div>
    </div>

    </>
  );
};

export default AboutUs;
