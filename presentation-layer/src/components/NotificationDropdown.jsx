import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await axios.get("http://localhost:5000/api/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setNotifications(res.data);
  };

  const markRead = async (id) => {
    await axios.put(
      `http://localhost:5000/api/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchNotifications();
  };

  const openThankYou = async (donationId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/thankyou/${donationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedMessage(res.data.message);
      setShowMessage(true);
    } catch {
      alert("Error loading message");
    }
  };

  return (
    <div
      className="dropdown-menu show p-2 shadow"
      style={{
        width: "700px",
        maxHeight: "400px",
        overflowY: "auto",
        whiteSpace: "normal",
        overflowWrap: "break-word",
      }}
    >
      <h6 className="dropdown-header">Notifications</h6>

      {notifications.length === 0 && (
        <p className="text-center text-muted">No notifications</p>
      )}

      {/* ✅ FIXED MAP FUNCTION */}
      {notifications.map((n) => {
        const isThankYou = n.message.startsWith("THANKYOU::");

        if (isThankYou) {
          const donationId = n.message.split("::")[1];

          return (
            <div key={n.id} className="dropdown-item">
              <strong>🎉 Donation Completed</strong>
              <br />

              <button
                className="btn btn-sm btn-success mt-1"
                onClick={() => openThankYou(donationId)}
              >
                📩 View Thank You
              </button>
            </div>
          );
        }

        return (
          <div
            key={n.id}
            className={`dropdown-item small ${
              n.is_read ? "text-muted" : "fw-bold"
            }`}
            onClick={() => markRead(n.id)}
            style={{
              cursor: "pointer",
              padding: "8px 10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>{n.username || "Dear"}</strong>, {n.message}
            <br />
            <small className="text-muted">
              {new Date(n.created_at).toLocaleString()}
            </small>
          </div>
        );
      })}

      {/* ✅ POPUP */}
      {showMessage && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            overflowY: "auto",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            zIndex: 9999,
            width: "1000px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <h5>💌 Thank You</h5>
          <p style={{ whiteSpace: "pre-line" }}>{selectedMessage}</p>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => setShowMessage(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;