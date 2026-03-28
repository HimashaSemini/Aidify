import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/All.css";

const AdminScheduleDonations = () => {
  const [donations, setDonations] = useState([]);
  const [dates, setDates] = useState({});

  const loadDonations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/donations/submitted",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDonations(res.data);
    } catch (err) {
      alert("Failed to load submitted donations");
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const schedule = async (id) => {
  if (!dates[id]) {
    alert("Please select a date");
    return;
  }

  try {
    await axios.put(
      `http://localhost:5000/api/admin/donations/${id}/schedule`,
      { scheduled_date: dates[id] },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Donation scheduled ✅");
    loadDonations();
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Failed to schedule donation ❌");
  }
};
    
const groupedDonations = Object.values(
  donations.reduce((acc, donation) => {
    const key = `${donation.user_id}_${donation.donation_id}`;
    if (!acc[key]) {
      acc[key] = { groupKey: key, items: [] };
    }
    acc[key].items.push(donation);
    return acc;
  }, {})
);

const users = Object.values(
    donations.reduce((acc, d) => {
      if (!acc[d.user_id]) {
        acc[d.user_id] = {
          user: d,
          handovers: {},
        };
      }

      if (!acc[d.user_id].handovers[d.handover_type]) {
        acc[d.user_id].handovers[d.handover_type] = [];
      }

      acc[d.user_id].handovers[d.handover_type].push(d);
      return acc;
    }, {})
  );


  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4 ">
        <br/><br/>
        <h3>📅 Schedule Donations</h3>

        <div class="table-responsive-xl">

        <table className="table table-bordered mt-3 table-hover">
          <thead>
            <tr>
              <th>Donor Details</th>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Warehouse</th>
              <th>Handover</th>
              <th>Schedule Date</th>
              <th>Action</th>
            </tr>
          </thead>


          <tbody>
            {groupedDonations.map((group) =>
    group.items.map((d, index) => (
                <tr key={d.donation_id}>

                

                  {/* MERGED DONOR DETAILS */}
                  {index === 0 && (
                    <td rowSpan={group.items.length}>
                      <p><strong>Name:</strong> {d.donor_name}</p>
                      <p><strong>Email:</strong> {d.donor_email}</p>
                      <p><strong>Phone:</strong> {d.donor_phone}</p>
                      <p><strong>Address:</strong> {d.donor_address}</p>
                    </td>
                
                  )}

                <td>{d.item_name}</td>
                <td>{d.item_category}</td>
                <td>{d.quantity}</td>
                <td>{d.warehouse_name}</td>
                
                <td>
                  {d.handover_type === "COLLECT"
                    ? "Admin Collects"
                    : "Donor Drop-off"}
                </td>
               
             
                
                
                <td>
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) =>
                      setDates({ ...dates, [d.donation_id]: e.target.value })
                    }
                  />
                </td>

                
                

              {index === 0 &&
                <td rowSpan={group.items.length}>
                    
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => schedule(d.donation_id)}
                    >
                        Schedule
                    </button>
                 

                    &nbsp;
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                        if (window.confirm("Cancel this donation?")) {
                            await axios.put(
                            `http://localhost:5000/api/admin/donations/${d.donation_id}/cancel`,
                            {},
                            {
                                headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }
                            );
                            loadDonations();
                        }
                        }}
                    >
                        Cancel
                    </button>
                 </td>
              }
         
              </tr>
            ))
            )}       
          </tbody>
        </table>
        </div>
        <br /><br /><br />

        
        
        {donations.length === 0 && (
          <p className="text-muted">No submitted donations</p>
        )}
      </div>
    </div></>
  );
};

export default AdminScheduleDonations;
