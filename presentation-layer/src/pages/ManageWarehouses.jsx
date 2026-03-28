import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ManageWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [editWarehouse, setEditWarehouse] = useState(null); // warehouse being edited
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warehouses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWarehouses(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch warehouses ❌");
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Delete warehouse
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/warehouses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("Warehouse deleted ✅");
      fetchWarehouses();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete warehouse ❌");
    }
  };

  // Start editing
  const handleEdit = (warehouse) => {
    setEditWarehouse(warehouse);
    setEditName(warehouse.name);
    setEditCapacity(warehouse.capacity);
    setEditPhone(warehouse.phone);
    setEditAddress(warehouse.address);
  };

  // Update warehouse
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName || !editCapacity || !editPhone || !editAddress) {
      setMessage("All fields required ❌");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/warehouses/${editWarehouse.warehouse_id}`,
        { name: editName, capacity: editCapacity, latitude: editWarehouse.latitude, longitude: editWarehouse.longitude, phone: editPhone, address: editAddress },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage("Warehouse updated ✅");
      setEditWarehouse(null);
      fetchWarehouses();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update warehouse ❌");
    }
  };

  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4 ">
        <br/><br/>
        <h3>Manage Warehouses</h3>

        {message && <div className="alert alert-info">{message}</div>}

        {/* Warehouse Table */}
        <div class="table-responsive">
        <table className="table table-bordered mt-3 table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.warehouse_id}>
                <td>{w.name}</td>
                <td>{w.capacity}</td>
                <td>{w.phone}</td>
                <td>{w.address}</td>
                <td>{Number(w.latitude).toFixed(5)}</td>
                <td>{Number(w.longitude).toFixed(5)}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(w)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(w.warehouse_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Map */}
        <h5 className="mt-4">Warehouse Locations</h5>
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={7}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {warehouses.map((w) => (
            <Marker key={w.warehouse_id} position={[Number(w.latitude), Number(w.longitude)]}>
              <Popup>
                {w.name} <br /> Capacity: {w.capacity}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Edit Form */}
        {editWarehouse && (
          <div className="mt-4 card p-3">
            <h5>Edit Warehouse: {editWarehouse.name}</h5>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Capacity</label>
                <input className="form-control" type="number" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input className="form-control" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input className="form-control" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
              </div>
              <button className="btn btn-success me-2">Update</button>
              <button className="btn btn-secondary" onClick={() => setEditWarehouse(null)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
    </div></>
    
  );
};

export default ManageWarehouses;
