// EmployeeSalarySlipPage.js
import React, { useEffect, useState } from "react";

const EmployeeSalarySlipPage = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [requestedMonth, setRequestedMonth] = useState("");
  const [requestedYear, setRequestedYear] = useState(new Date().getFullYear());

  const employeeEmail = (() => {
    try {
      return localStorage.getItem("employeeEmail") || "";
    } catch {
      return "";
    }
  })();

  const employeeName = (() => {
    try {
      return localStorage.getItem("employeeName") || "Employee";
    } catch {
      return "Employee";
    }
  })();

  useEffect(() => {
    fetchSlips();
  }, []);

  async function fetchSlips() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/salary-slips?email=${encodeURIComponent(employeeEmail)}`
      );
      if (!res.ok) throw new Error("Failed to load salary slips");
      const data = await res.json();
      setSlips(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadSlip(slip) {
    setErrorMsg('');
    setStatusMsg('Preparing download...');
    try {

      let pdfUrl = `/api/salary-slips/${slip._id}/pdf`;


      const res = await fetch(pdfUrl);
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${slip.employeeName || 'salary'}_${slip.month}_${slip.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      setStatusMsg('Downloaded successfully ✅');
    } catch (err) {
      console.error(err);
      setErrorMsg(`Download failed ❌ — ${err.message}`);
    }
  }


  async function requestSlip() {
    if (!requestedMonth || !requestedYear) {
      setErrorMsg("Please select both month and year.");
      return;
    }
    try {
      const res = await fetch(`/api/salary-slip-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName,
          employeeEmail,
          month: requestedMonth,
          year: requestedYear,
        }),
      });
      if (!res.ok) throw new Error("Failed to request salary slip");
      setStatusMsg("Request sent successfully ✅");
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  return (
    <div className="salary-page">
      <header className="salary-header">
        <h2>My salary slips</h2>
        <button className="btn" onClick={fetchSlips}>
          Refresh
        </button>
      </header>

      {errorMsg && <div className="alert error">{errorMsg}</div>}
      {statusMsg && <div className="alert success">{statusMsg}</div>}

      {/* Request New Slip */}
      


      {/*  Table */}
      <div className="table-wrap" style={{ marginTop: 24 }}>
        <h3>Available Slips</h3>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : slips.length === 0 ? (
          <p className="muted">No salary slips found.</p>
        ) : (
          <table className="salary-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Month</th>
                <th>Year</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slips.map((s) => (
                <tr key={s._id}>
                  <td>{s.employeeName || '-'}</td>
                  <td>{capitalize(s.month)}</td>
                  <td>{s.year}</td>
                  <td>₹{Number(s.netPay).toLocaleString("en-IN")}</td>
                  <td className={`status ${s.status || "available"}`}>
                    {capitalize(s.status || "Available")}
                  </td>
                  <td>
                    <button className="btn small" onClick={() => downloadSlip(s)}>
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inline CSS */}
      <style>{`
        :root {
          --bg: #f6f9fb;
          --card: #fff;
          --accent: #2563eb;
          --danger: #ef4444;
          --ok: #16a34a;
          --border: #e6eef8;
          --muted: #6b7280;
        }
        .salary-page { padding: 24px; background: var(--bg); min-height: 90vh; }
        .salary-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .btn { background: var(--accent); color:white; border:none; border-radius:8px; padding:8px 12px; cursor:pointer; }
        .btn.small { padding:6px 8px; font-size:0.9rem; border-radius:6px; }
        .alert { padding:10px 12px; border-radius:8px; margin-bottom:10px; }
        .alert.error { background:#fee2e2; color:var(--danger); }
        .alert.success { background:#dcfce7; color:var(--ok); }
        .request-card { background:var(--card); padding:16px; border-radius:10px; border:1px solid var(--border); box-shadow:0 4px 12px rgba(0,0,0,0.05); }
        .request-grid { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        .request-grid select, .request-grid input { padding:8px 10px; border:1px solid var(--border); border-radius:6px; font-size:0.95rem; }
        .table-wrap { background:var(--card); padding:16px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border:1px solid var(--border); overflow:auto; }
        table { width:100%; border-collapse:collapse; margin-top:10px; }
        th, td { padding:10px; border-bottom:1px solid #f1f5f9; text-align:left; }
        th { background:#f8fafc; font-weight:600; color:#1e293b; }
        .status.available { background:#f0fdf4; color:#065f46; padding:4px 6px; border-radius:6px; }
        .status.pending { background:#fff7ed; color:#92400e; padding:4px 6px; border-radius:6px; }
        .muted { color:var(--muted); }
      `}</style>
    </div>
  );
};

export default EmployeeSalarySlipPage;
