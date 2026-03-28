import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/All.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { updateUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [image, setImage] = useState(null);

  const IMAGE_BASE = "http://localhost:5000/";

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);


  /* =====================
     LOAD PROFILE
  ===================== */
  const fetchProfile = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/auth/profile",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUser(res.data);
    setForm({
      name: res.data.name || "",
      phone: res.data.phone || "",
      address: res.data.address || "",
    });
    setShowEdit(false);
  };

  /* =====================
     UPDATE PROFILE
  ===================== */

const handleUpdate = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("phone", form.phone);
  formData.append("address", form.address);
  if (image) formData.append("profile_image", image);

  // 1️⃣ Update profile
  await axios.put(
    "http://localhost:5000/api/auth/profile",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  // 2️⃣ Re-fetch updated profile
  const updated = await axios.get(
    "http://localhost:5000/api/auth/profile",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // 3️⃣ Update AuthContext → Navbar updates instantly
  updateUser(updated.data);

  setShowEdit(false);
  setImage(null);
};


  /* =====================
     DELETE ACCOUNT
  ===================== */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    await axios.delete(
      "http://localhost:5000/api/auth/profile",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    localStorage.clear();
    window.location.href = "/register";
  };

  if (!user) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="bgdonor2">
    <div className="container mt-4">
        <br/><br/><br/>
    <div className="text-center">
      <h2> My Profile - {user.role}</h2>
    </div>
      <br/><br/><br/>

    <div className="card p-4 mt-3" style={{ maxWidth: 500, margin: "auto", position: "relative" }}>
      <img
        src={
          user.profile_image
            ? `http://localhost:5000${user.profile_image}`
            :  IMAGE_BASE + "uploads/profiles/default.png"
        }
        alt="profile"
        className="rounded-circle mb-3"
        style={{ width: 200, height: 200 , position: "absolute", top: -60, left: "calc(90% - 120px)", objectFit: "cover", border: "4px solid gray"}}
      />

      <h3><b>{user.name}</b></h3>
      <br/><br/>
      <p><b>Phone :</b> {user.phone || "-"}</p>
      <p><b>Email  :</b> {user.email}</p>
      <p><b>Address :</b> {user.address || "-"}</p>

        <div className="d-flex justify-content-center mt-4">
      <button
        className="btn btn-primary me-2"
        onClick={() => setShowEdit(true)}
      >
        ✏️ Edit Profile
      </button>
</div>
<div className="d-flex justify-content-center mt-4">
      <button
        className="btn btn-danger"
        onClick={handleDelete}
      >
        🗑 Delete Account
      </button>
      </div>

      {/* =====================
          EDIT PROFILE MODAL
      ===================== */}
      {showEdit && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEdit(false)}
                ></button>
              </div> <br/><br/>

              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                  <textarea
                    className="form-control mb-2"
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />

                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEdit(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-success">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </div>
  );
};

export default Profile;
