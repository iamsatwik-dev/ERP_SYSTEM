import React, { useEffect, useState } from "react";
import { formatDateISOToDDMMYYYY } from "../utils/dateFormat";


const EnquiryDetail = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Fetch enquiries
  const fetchEnquiries = async (query = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/enquiries${query}`);
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch enquiries error:", err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark enquiry as resolved
  const markResolved = async (id) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" }),
      });
      fetchEnquiries();
    } catch (err) {
      console.error("Mark resolved error:", err);
    }
  };

  // Filters
  const handleFilter = () => {
    if (fromDate && toDate) {
      fetchEnquiries(`?from=${fromDate}&to=${toDate}`);
    }
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    fetchEnquiries(`?from=${today}&to=${today}`);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    fetchEnquiries();
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading enquiries...</h2>;
  }

  const total = enquiries.length;
  const pending = enquiries.filter(e => e.status !== "Resolved").length;
  const resolved = enquiries.filter(e => e.status === "Resolved").length;

  return (
    <div className="container">
      <div className="card fade-in" style={{ padding: 20 }}>
        <h2>📋 Enquiry Dashboard</h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          <button className="btn btn-primary" onClick={handleFilter}>Apply</button>
          <button className="btn" onClick={handleToday} style={{ background: "green", color: "#fff" }}>Today</button>
          <button className="btn" onClick={handleClear} style={{ background: "gray", color: "#fff" }}>Clear</button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <StatCard label="Total" value={total} />
          <StatCard label="Pending" value={pending} />
          <StatCard label="Resolved" value={resolved} />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f1f1f1" }}>
              <tr>
                {["#", "Name", "Email", "Phone", "Message", "Status", "Date", "Action"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e, i) => (
                <tr key={e._id || i}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{e.name}</td>
                  <td style={tdStyle}>{e.email}</td>
                  <td style={tdStyle}>{e.phone_number}</td>
                  <td style={tdStyle}>{e.message}</td>
                  <td style={tdStyle}>
                    <span style={{ color: e.status === "Resolved" ? "green" : "orange", fontWeight: 600 }}>
                      {e.status || "Pending"}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatDateISOToDDMMYYYY(e.createdAt)}</td>
                  <td style={tdStyle}>
                    {e.status !== "Resolved" && (
                      <button
                        className="btn"
                        style={{ background: "#28a745", color: "#fff" }}
                        onClick={() => markResolved(e._id)}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>
                    No enquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Small stat card component
const StatCard = ({ label, value }) => (
  <div className="card" style={{ padding: 12, flex: 1 }}>
    <strong style={{ fontSize: 18 }}>{value}</strong>
    <div className="muted">{label}</div>
  </div>
);

const thStyle = { padding: 10, border: "1px solid #e6e6e6" };
const tdStyle = { padding: 10, border: "1px solid #e6e6e6" };

export default EnquiryDetail;
