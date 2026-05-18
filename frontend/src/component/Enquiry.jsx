// ✅ Enquiry.js — User Enquiry Form
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Enquiry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone_number: "",
  });

  useEffect(() => {
    try {
      if (localStorage.getItem("isAdmin") === "true") {
        navigate("/enquiry-details");
      }
    } catch {}
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Enquiry submitted successfully!");
        setFormData({ name: "", email: "", message: "", phone_number: "" });

        try {
          window.location.href = "/enquiry-details";
        } catch (e) {
          setTimeout(() => navigate("/enquiry-details"), 1000);
        }
      } else {
        alert("Failed to submit enquiry.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting enquiry.");
    }
  };

  return (
    <div className="enquiry-container container">
      {/* ✨ TOP TO BOTTOM ANIMATION ADDED HERE */}
      <div className="card fade-in-top" style={styles.container}>
        <h2 style={styles.heading}>Enquiry Form</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="tel"
            name="phone_number"
            placeholder="Enter your phone number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            required
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  heading: { textAlign: "center", marginBottom: "20px", color: "#333" },
  form: { display: "flex", flexDirection: "column" },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "none",
    minHeight: "80px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Enquiry;
