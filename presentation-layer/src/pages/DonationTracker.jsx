import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  Circle
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =======================
   Fix Leaflet Icons
======================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const IMAGE_BASE = "http://localhost:5000/";
/* =======================
   Status Colors
======================= */
const statusColors = {
  Submitted: "gray",
  Scheduled: "blue",
  Received: "orange",
  "In Transit": "purple",
  Delivered: "green",
};

/* =======================
   Auto Fit Bounds
======================= */
const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [60, 60] });
    }
  }, [points, map]);

  return null;
};

/* =======================
   Truck Icon
======================= */
const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995470.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

/* =======================
   Main Component
======================= */
const DonationTracking = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [truckPosition, setTruckPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -----------------------
     Fetch Data
  ----------------------- */
  useEffect(() => {
    fetchTracking();
  }, []);

  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/donations/my/latest",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDonations(res.data);
      if (res.data.length > 0) {
        setSelectedDonationId(res.data[0].donation_id);
      }
    } catch {
      setError("Failed to fetch donation tracking");
    } finally {
      setLoading(false);
    }
  };

  /*showAll*/
  const showAll = selectedDonationId === "all";

  /* -----------------------
     Selected Donation
  ----------------------- */
  const selectedDonation = !showAll
  ? donations.find(d => d.donation_id === selectedDonationId)
  : null;

  /* -----------------------
     Animate Truck
  ----------------------- */
  useEffect(() => {
    if (
      !selectedDonation?.location ||
      !selectedDonation?.destination
    )
      return;

    const start = [
      selectedDonation.location.lat,
      selectedDonation.location.lng,
    ];
    const end = [
      selectedDonation.destination.lat,
      selectedDonation.destination.lng,
    ];

    let step = 0;
    const steps = 100;

    const interval = setInterval(() => {
      step++;

      const lat =
        start[0] + ((end[0] - start[0]) * step) / steps;
      const lng =
        start[1] + ((end[1] - start[1]) * step) / steps;

      setTruckPosition([lat, lng]);

      if (step >= steps) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, [selectedDonation]);

  /* -----------------------
     Loading States
  ----------------------- */
  if (loading)
    return <p className="text-center mt-4">Loading…</p>;
  if (error)
    return <p className="text-center mt-4 text-danger">{error}</p>;
  if (donations.length === 0)
    return <p className="text-center mt-4">No donations found</p>;


  /* -----------------------
     Path
  ----------------------- */
  const singlePath =
    !showAll &&
    selectedDonation &&
    selectedDonation.location &&
    selectedDonation.destination
      ? [
          [
            selectedDonation.location.lat,
            selectedDonation.location.lng
          ],
          [
            selectedDonation.destination.lat,
            selectedDonation.destination.lng
          ]
        ]
      : null;

  const isSameLocation =
    singlePath &&
    singlePath[0][0] === singlePath[1][0] &&
    singlePath[0][1] === singlePath[1][1];


  const allPaths = donations
    .filter(d => d.location && d.destination)
    .map(d => ({
      id: d.donation_id,
      status: d.status,
      path: [
        [d.location.lat, d.location.lng],
        [d.destination.lat, d.destination.lng],
      ],
      pickup: d.location,
      destination: d.destination
    }));

  const offsetPath = (path, index) => {
    const OFFSET = 0.005;
    return path.map(([lat, lng]) => [
      lat + OFFSET * index,
      lng + OFFSET * index
    ]);
  };


  const StatusLegend = () => (
    <div className="card p-3 mb-3 shadow-sm">
      <h6 className="mb-2">📍 Tracking Status Guide</h6>

      <div className="d-flex align-items-center mb-1">
        <span style={{ color: "gray", fontSize: "18px" }}>■</span>
        <span className="ms-2">
          <b>Submitted</b> - Donation submitted and waiting to be processed
        </span>
      </div>

      <div className="d-flex align-items-center mb-1">
        <span style={{ color: "blue", fontSize: "18px" }}>■</span>
        <span className="ms-2">
          <b>Scheduled</b> - Pickup scheduled
        </span>
      </div>

      <div className="d-flex align-items-center mb-1">
        <span style={{ color: "orange", fontSize: "18px" }}>■</span>
        <span className="ms-2">
          <b>Received</b> - Arrived at warehouse
        </span>
      </div>

      <div className="d-flex align-items-center mb-1">
        <span style={{ color: "purple", fontSize: "18px" }}>■</span>
        <span className="ms-2">
          <b>In Transit</b> - Moving from pickup &gt; destination
        </span>
      </div>

      <div className="d-flex align-items-center">
        <span style={{ color: "green", fontSize: "18px" }}>■</span>
        <span className="ms-2">
          <b>Delivered</b> - Successfully delivered
        </span>
      </div>
    </div>
  );

  /* =======================
     Render
  ======================= */
  return (
    <div className="bgdonor2">
    <div className="container mt-4">
      <br /><br /><br />
      <h2 className="mb-4">📦 Donation Tracking</h2>
      <div>
        {/* TIMELINES */}
      {donations.map(d => (
        <div key={d.donation_id} className="card mb-3 p-3 shadow-sm">
          <h5>Donation #{d.donation_id}</h5>
          <div className="card mb-3 p-3 shadow-sm position-relative">
{d.image_url ? (
                      <img
                        src={
                          d.image_url.startsWith("uploads")
                            ? IMAGE_BASE + d.image_url
                            : IMAGE_BASE + "uploads/" + d.image_url
                        }
                        alt="item"
                        style={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          position: "absolute",
                          top: "10px",
                          right: "10px"
            }}
                      />

                    ) : (
                      "—"
                    )}
         
          
          <p>Status: <b>{d.status}</b><br/>
          Item Name: {d.item_name}<br/>
          Category: {d.item_category}<br/>
          Condition: {d.item_condition}<br/>
          Quantity: {d.quantity}<br/>
          Pickup Location: {d.pickup_name}<br/>
          Destination Warehouse: {d.dest_name}
          </p>
                    </div>

          {d.timeline.length === 0 ? (
            <p className="text-muted">No tracking updates yet</p>
          ) : (
            <ul className="list-group">
              {d.timeline.map((t, i, d) => (
                
                <li key={i} className="list-group-item d-flex justify-content-between">
                  <span>{t.stage}</span>
                  <span className="text-muted">
                    {new Date(t.date).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      </div>
      
      <div>
      <h2 className="mb-4">🚚 Live Delivery Map</h2>


      {/* Donation Selector */}
      <select
        className="form-select mb-3"
        value={selectedDonationId ?? "all"}
        onChange={(e) =>
          setSelectedDonationId(
            e.target.value === "all" ? "all" : Number(e.target.value)
          )
        }
      >
        <option value="all">📦 All Donations</option>

        {donations.map((d) => (
          <option key={d.donation_id} value={d.donation_id}>
            Donation #{d.donation_id} — {d.status}
          </option>
        ))}
      </select>
 
      
      <StatusLegend />

      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={7}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        
        {/* ========= SINGLE DONATION ========= */}
        {!showAll && selectedDonation && selectedDonation.location && selectedDonation.destination && (() => {
          
          return (
            <>
              <FitBounds points={singlePath} />

              {isSameLocation ? (
                <>
                  <Marker position={singlePath[0]}>
                    <Popup>
                      <b>{selectedDonation.location.warehouse}</b>
                      <br />
                      Pickup & Destination are the same
                    </Popup>
                  </Marker>

                  <Circle
                    center={singlePath[0]}
                    radius={300}
                    pathOptions={{ color: "gray" }}
                  />
                </>
              ) : (
                <>

              <Marker position={singlePath[0]}>
                <Popup>
                  <b>Pickup:</b> {selectedDonation.pickup_name}
                </Popup>
              </Marker>

              <Marker position={singlePath[1]}>
                <Popup>
                  <b>Destination:</b> {selectedDonation.dest_name}
                </Popup>
              </Marker>

              <Polyline
                positions={singlePath}
                pathOptions={{
                  color: statusColors[selectedDonation.status],
                  weight: 5,
                  dashArray:
                    selectedDonation.status === "In Transit" ? "10,10" : null
                }}
              />

              {truckPosition && selectedDonation.status === "In Transit" && (
                <Marker position={truckPosition} icon={truckIcon}>
                  <Popup>🚚 Delivery in progress</Popup>
                </Marker>

              )}
            </>
              )}
            </>
          );
        })()}

        {/* ========= ALL DONATIONS ========= */}
        {showAll && allPaths.length > 0 && (
          <>
            <FitBounds points={allPaths.flatMap(d => d.path)} />

            {allPaths.map((d, index) => {
              const offsetedPath = offsetPath(d.path, index);

              if (!offsetedPath || offsetedPath.length < 2) return null;

              return (
                <React.Fragment key={d.id}>
                  <Marker position={offsetedPath[0]}>
                    <Popup>
                      Pickup — Donation #{d.id}<br />
                      Status: {d.status}
                    </Popup>
                  </Marker>

                  <Marker position={offsetedPath[1]}>
                    <Popup>
                      Destination — Donation #{d.id}
                    </Popup>
                  </Marker>

                  <Polyline
                    positions={offsetedPath}
                    pathOptions={{
                      color: statusColors[d.status] || "black",
                      weight: 5,
                      dashArray: d.status === "In Transit" ? "8,8" : null,
                    }}
                  />
                </React.Fragment>
              );
            })}
          </>
        )}
      </MapContainer>
        </div>
    </div>
    </div>
  );
};

export default DonationTracking;
