import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Map click handler
const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const CreateWarehouse = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position) {
      setMessage("Please select warehouse location on map ❌");
      return;
    }

    if (!name || !capacity) {
      setMessage("All fields required");
      return;
    }

    setLoading(true);
    setMessage("");

    const payload = {
      name: name.trim(),
      latitude: Number(position.lat),
      longitude: Number(position.lng),
      capacity: Number(capacity),
      phone: phone.trim(),
      address: address.trim(),
    };

     console.log("Sending warehouse payload:", payload);
    console.log("User token:", user?.token);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/warehouses",
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Server response:", res.data);
      setMessage("Warehouse created successfully");
      setName("");
      setCapacity("");
      setPosition(null);
    } 
    catch (err) {
        console.error("Axios error:", err.response?.data || err.message);
      setMessage(
        `Failed to create warehouse (${
          err.response?.data?.message || err.message
        })`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bgadmin">
      <div className="container mt-4 " style={{ maxWidth: "800px" }}>
        <br/><br/>
        <h3 className="mb-3">Create Warehouse</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Warehouse Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Capacity */}
          <div className="mb-3">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              className="form-control"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Map */}
          <div className="mb-3">
            <label className="form-label">
              Select Warehouse Location (Click on Map)
            </label>

            <MapContainer
              center={[7.8731, 80.7718]} // Sri Lanka
              zoom={7}
              style={{ height: "350px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <LocationPicker setPosition={setPosition} />

              {position && <Marker position={position} />}
            </MapContainer>

            {position && (
              <small className="text-muted">
                Selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
              </small>
            )}
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating..." : "Create Warehouse"}
          </button>
        </form>
      </div>
      <br />
      <br />
      <br />
    </div></>
  );
};

export default CreateWarehouse;
