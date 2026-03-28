import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import "../styles/All.css";
import Navbar from "../components/Navbar.jsx";

const CreateDonation = () => {
  const { user } = useAuth();
  const [itemName, setItemName] = useState("");
  const [condition, setCondition] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [handoverType, setHandoverType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  // Wait for user to be available
  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!token) return; 
    console.log("USER from context:", user);
  console.log("TOKEN from user:", user?.token);
  console.log("TOKEN from localStorage:", localStorage.getItem("token"));

    // Fetch all warehouses
    axios
      .get("http://localhost:5000/api/warehouses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWarehouses(res.data))
      .catch((err) => console.error("Warehouse fetch error:", err));

    // Fetch nearest warehouse
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/warehouses/nearest?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setWarehouseId(res.data.warehouse_id);
        } catch (err) {
          console.error("Nearest warehouse error:", err);
        }
      },
      (err) => console.warn("Geolocation error:", err)
    );
  }, [token]);

  // Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit Donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!token) {
      setMessage("You must be logged in to submit a donation.");
      setLoading(false);
      return;
    }

    if (!itemName || !condition || !handoverType || !warehouseId || quantity < 1) {
      setMessage("Please fill all required fields correctly.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("item_condition", condition);
    formData.append("warehouse_id", warehouseId);
    formData.append("quantity", Number(quantity));
    formData.append("handover_type", handoverType);
    if (comments) formData.append("comments", comments);
    if (image) formData.append("image", image);

    // DEBUG log
    console.log("Submitting donation with these fields:");
    for (let [key, value] of formData.entries()) console.log(key, value);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/donations/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAiCategory(res.data.ai_category);
      setConfidence(res.data.confidence);
      setMessage("Donation submitted successfully!");

      // Reset form
      setItemName("");
      setCondition("");
      setWarehouseId("");
      setQuantity(1);
      setComments("");
      setImage(null);
      setPreview(null);
      setHandoverType("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Donation error:", err.response?.data || err.message);
      setMessage(
        err.response?.data?.message ||
          "Donation failed. Please check all fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show login message if user not available
  if (!token) {
    return (
      <div className="container mt-5">
        <h2>Please log in to submit a donation</h2>
      </div>
    );
  }

  return (
    <>
    <div className="bgdonor2">
      <div className="container mt-5">
        <br/><br/>
        <h2>Request a Donation</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* Item Name */}
          <div className="mb-3">
            <label>Item Name</label>
            <input
              className="form-control"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          {/* Condition */}
          <div className="mb-3">
            <label>Item Condition</label>
            <select
              className="form-control"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="New">New</option>
              <option value="Used - Good">Used - Good</option>
              <option value="Used - Fair">Used - Fair</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
            />
          </div>

          {/* Handover Type */}
          <div className="mb-3">
            <label className="form-label">How should we receive this donation?</label>
            <select
              className="form-control"
              value={handoverType}
              onChange={(e) => setHandoverType(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="COLLECT">Admin will collect</option>
              <option value="DROP_OFF">I will deliver</option>
            </select>
          </div>

          {/* Comments */}
          <div className="mb-3">
            <label className="form-label">Comments (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Any additional notes about this donation"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          {/* Warehouse */}
          <div className="mb-3">
            <label>Warehouse</label>
            <select
              className="form-control"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w.warehouse_id} value={w.warehouse_id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div className="mb-3">
            <label>Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <img src={preview} alt="preview" className="img-thumbnail mb-3" />
          )}

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Processing..." : "Submit Donation Request"}
          </button>
        </form>

        {/* AI Result */}
        {aiCategory && (
          <div className="alert alert-success mt-4">
            <h5>AI Classification</h5>
            <p>Category: {aiCategory}</p>
            <p>
              AI Confidence:{" "}
              {confidence !== null ? Number(confidence).toFixed(2) : "N/A"}%
            </p>
          </div>
        )}
      </div>
      </div>
      
    </>
  );
};

export default CreateDonation;
