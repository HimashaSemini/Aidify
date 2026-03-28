import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/All.css";

const AdminDeliveryConfirm = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInTransit = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/donations/in-transit",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDonations(res.data);
    } catch (err) {
      alert("Failed to load in-transit donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInTransit();
  }, []);

  const markDelivered = async (id) => {
    if (!window.confirm("Confirm donation delivered?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/donations/${id}/delivered`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      loadInTransit();
    } catch (err) {
      alert("Failed to mark as delivered");
    }
  };

  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4">
        <br/><br/>
        <h3>Confirm Deliveries</h3>

        <div class="table-responsive">
        <table className="table table-bordered mt-3 table-hover">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>From Warehouse</th>
              <th>Destination Warehouse</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((d) => (
              <tr key={d.donation_id}>
                <td>{d.donor_name}</td>
                <td>{d.item_name}</td>
                <td>{d.quantity}</td>
                <td>{d.warehouse_name}</td>
                <td>{d.destination_warehouse_name}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => markDelivered(d.donation_id)}
                  >
                    Mark as Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {!loading && donations.length === 0 && (
          <p className="text-muted">No deliveries pending confirmation</p>
        )}
      </div>
      <br/><br/><br/>
    </div></>
  );
};

export default AdminDeliveryConfirm;
