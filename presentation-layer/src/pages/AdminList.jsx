import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/All.css";
 

const BASE_URL = "http://localhost:5000/api";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAdmins(res.data);
    } catch (error) {
      console.error("Failed to load admin list", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Loading admins...</p>;
  }

  return (
    <>
    <div className="bgadmin">
    <div className="container mt-4 ">
        <br/><br/>
      <h2 className="mb-4">👥 Admin List</h2>

      <div className="card shadow-sm">
        <div class="table-responsive">
        <table className="table table-bordered mb-0 table-hover">
          <thead className="table table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map((admin, index) => (
                <tr key={admin.user_id}>
                    <td>{index + 1}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>
                    {admin.created_at
                        ? new Date(admin.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                </tr>
                ))

            )}
          </tbody>
        </table>
        </div>
      </div>
      <br/><br/><br/>
    </div>
    </div></>
  );
};

export default AdminList;
