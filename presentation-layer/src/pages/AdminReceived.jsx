import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/All.css";

const AdminReceived = () => {
  const [donations, setDonations] = useState([]);

  const load = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/donations/scheduled",
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setDonations(res.data);
  };

  useEffect(() => { load(); }, []);

  const markReceived = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/donations/${id}/receive`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    load();
  };

  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4 ">
        <br/><br/>
        <h3>Received Donations</h3>

        <div class="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Item</th>
              <th>Category</th>
              <th>Handover Warehouse</th>
              <th>Scheduled Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(d => (
              <tr key={d.donation_id}>
                <td>{d.donor_name}</td>
                <td>{d.item_name}</td>
                <td>{d.item_category}</td>
                <td>{d.warehouse_name}</td>
                <td>{d.scheduled_date}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => markReceived(d.donation_id)}
                  >
                    Mark as Received
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <br/><br/><br/>
    </div></>
  );
};

export default AdminReceived;
