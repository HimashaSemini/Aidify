import React, { useState } from "react";
import axios from "axios";
import "../styles/All.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post("http://localhost:5000/api/contact", formData);
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
    } catch (error) {
        console.error(error);
        alert("Failed to send message");
    }
    };


  return (
    <div className="cpage-background">
    <div className="container mt-5">
        <br/><br/>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <br/><br/>
          <div className="card shadow-sm p-4 contact-form-wrapper">
            <h2 className="text-center mb-4">Contact Us</h2>

            <p className="text-center text-muted mb-4">
              Have questions or feedback? We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  className="form-control"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="d-grid">
                <button className="btn btn-primary" type="submit">
                  Send Message
                </button>
              </div>
            </form>

            <div className="text-center mt-4 text-muted">
              📧 support@aidify.com <br />
              ☎ +94 77 123 4567
            </div>
          </div>
          <br/><br/><br/>
        </div>
      </div>
    </div></div>
  );
};

export default ContactUs;
