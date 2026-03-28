import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/All.css";

const IMAGE_BASE = "http://localhost:5000/";

const AdminDelivered = () => {
  const [donations, setDonations] = useState([]);
  const token = localStorage.getItem("token");

  const loadDelivered = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/donations/delivered",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivered donations");
    }
  };

  useEffect(() => {
    loadDelivered();
  }, []);

  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4">
        <br/><br/>
        <h3>Delivered Donations</h3>

        <div class="table-responsive">
        <table className="table table-bordered table-striped mt-3 table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Category</th>
              <th>Image</th>
              <th>Qty</th>
              <th>Donor</th>
              <th>From Warehouse</th>
              <th>To Warehouse</th>
              <th>Impact</th>
              <th>Delivered Date</th>
            </tr>
          </thead>

          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No delivered donations
                </td>
              </tr>
            ) : (
              donations.map((d) => (
                <tr key={d.donation_id}>
                  <td>{d.donation_id}</td>
                  <td>{d.item_name}</td>
                  <td>{d.item_category}</td>
                  <td>
                    {d.image_url ? (
                      <img
                        src={
                          d.image_url.startsWith("uploads")
                            ? IMAGE_BASE + d.image_url
                            : IMAGE_BASE + "uploads/" + d.image_url
                        }
                        alt="item"
                        width="100"
                      />

                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{d.quantity}</td>
                  <td>{d.donor_name}</td>
                  <td>{d.from_warehouse}</td>
                  <td>{d.to_warehouse || "-"}</td>
                  <td>
                    <span className="badge bg-info">
                      {d.impact_points}
                    </span>
                  </td>
                  <td>
                    {new Date(d.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
      <br/><br/><br/>
    </div></>
  );
};

export default AdminDelivered;
