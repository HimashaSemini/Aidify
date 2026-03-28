import { useEffect, useState } from "react";
import axios from "axios";


const AdminInTransit = () => {
  const [donations, setDonations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState({});

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const load = async () => {
    const [dRes, wRes] = await Promise.all([
      axios.get("http://localhost:5000/api/admin/donations/received", { headers }),
      axios.get("http://localhost:5000/api/warehouses", { headers }),
    ]);

    setDonations(dRes.data);
    setWarehouses(wRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const markTransit = async (id) => {
  if (!selectedWarehouse[id]) {
    alert("Select destination warehouse");
    return;
  }

  try {
    await axios.put(
      `http://localhost:5000/api/admin/donations/${id}/transit`,
      {
        destination_warehouse_id: selectedWarehouse[id],
      },
      { headers }
    );

    alert("Donation dispatched 🚚");
    load(); // reload received list
  } catch (err) {
    console.error(err);
    alert("Dispatch failed");
  }
};


  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4 ">
        <br/><br/>
        <h3>Dispatch Donations (In Transit)</h3>

        <div class="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Item</th>
              <th>Category</th>
              <th>From Warehouse</th>
              <th>Destination Warehouse</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((d, w) => (
              <tr key={d.donation_id}>
                <td>{d.donor_name}</td>
                <td>{d.item_name}</td>
                <td>{d.item_category}</td>
                <td>{d.warehouse_name}</td>

                <td>
                  <select
                    className="form-select"
                    onChange={(e) =>
                      setSelectedWarehouse({
                        ...selectedWarehouse,
                        [d.donation_id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((w) => (
                      <option key={w.warehouse_id} value={w.warehouse_id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => markTransit(d.donation_id)}
                  >
                    Dispatch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {donations.length === 0 && (
          <p className="text-muted">No received donations</p>
        )}
      </div>
      <br/><br/><br/>
    </div></>
  );
};

export default AdminInTransit;
