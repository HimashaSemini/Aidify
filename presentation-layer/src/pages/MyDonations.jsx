import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/All.css";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations/my-delivered",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load donations");
    }
  };

  return (
    <div className="bgdonor2">
    <div className="container mt-4">
        <br/><br/><br/>
      <h3>📄 My Completed Donations</h3>
      <br/><br/>

      {donations.length === 0 ? (
        <p className="text-muted">No completed donations yet</p>
      ) : (
        <div className="row">
          {donations.map((d) => (
            <div key={d.donation_id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                {d.image_url && (
                  <img
                    src={`http://localhost:5000/${d.image_url}`}
                    alt="donation"
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body">
                  <h5>{d.item_name}</h5>

                  <p className="mb-1">
                    <strong>Quantity:</strong> {d.quantity}
                  </p>

                  <p className="mb-1">
                    <strong>Category:</strong> {d.item_category}
                  </p>

                  <p className="mb-1">
                    <strong>From:</strong> {d.from_warehouse || "-"}
                  </p>

                  <p className="mb-1">
                    <strong>To:</strong> {d.to_warehouse || "-"}
                  </p>

                  <p className="mb-1 text-success">
                    ⭐ Impact Points: {d.impact_points}
                  </p>

                  <small className="text-muted">
                    {new Date(d.updated_at).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default MyDonations;