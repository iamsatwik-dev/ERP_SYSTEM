// EmployeeListPage.js
import React, { useEffect, useState } from "react";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    empId: "",
    email: "",
    password: "",
    designation: "",
    joinDate: "",
    status: "Active",
  });

  // Check if user is admin
  const isAdmin = (() => {
    try {
      return localStorage.getItem("isAdmin") === "true";
    } catch {
      return false;
    }
  })();

  // Fetch employees when page loads
  useEffect(() => {
    if (!isAdmin) {
      setErrorMsg("Access denied: Admins only.");
      return;
    }
    fetchEmployees();
    // Listen for status updates dispatched by admin chatbot or other components
    const onStatusChanged = (e) => {
      try {
        const detail = e.detail || {};
        const email = (detail.email || '').toLowerCase();
        const status = detail.status;
        if (!email || !status) return;
        let found = false;
        setEmployees((prev) => prev.map(p => {
          if ((p.email || '').toLowerCase() === email) {
            found = true;
            return { ...p, status };
          }
          return p;
        }));
        // if employee not in current list, refetch to ensure visibility
        if (!found) fetchEmployees();
      } catch (err) { console.error('Failed to handle employeeStatusChanged', err); }
    };
    window.addEventListener('employeeStatusChanged', onStatusChanged);
    return () => window.removeEventListener('employeeStatusChanged', onStatusChanged);
  }, []);

  // Fetch employees from backend
  async function fetchEmployees() {
    setLoading(true);
    try {
      const base = window.__BACKEND_URL__ || "http://localhost:5000";
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const token = await getAdminToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${base}/api/employees${q}`, { headers });
      if (!res.ok) {
        let body = null;
        try { body = await res.json(); } catch(_) { try { body = await res.text(); } catch(_) { body = null; } }
        const msg = body && body.error ? body.error : (typeof body === 'string' ? body : `status ${res.status}`);
        throw new Error(`Failed to load employees: ${msg}`);
      }

      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Add a new employee (instantly shows on frontend)
  async function addEmployee() {
      if (!form.name || !form.email || !form.empId) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    // validate password if provided
    if (form.password && form.password.length > 0 && form.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    try {
      const base = window.__BACKEND_URL__ || "http://localhost:5000";
      const token = await getAdminToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      // Include password only when provided
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      const res = await fetch(`${base}/api/employees`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add employee");
      const saved = await res.json();

      // Create a new employee entry for frontend display
      const newEmployee = {
        _id: saved._id || Date.now().toString(),
        ...form,
      };

      setEmployees((prev) => [newEmployee, ...prev]); // show immediately
      setForm({
        name: "",
        empId: "",
        email: "",
        password: "",
        designation: "",
        joinDate: "",
        status: "Active",
      });
      setErrorMsg("");
      alert("✅ Employee added successfully!");
      setShowModal(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  // Helper: obtain admin token (auto-login)
  async function getAdminToken() {
    try {
      // prefer explicit admin token, fallback to any stored token
      const cached = localStorage.getItem("adminToken") || localStorage.getItem('token');
      if (cached) return cached;

      const base = window.__BACKEND_URL__ || "http://localhost:5000";
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@abcit.com",
          password: "admin123",
        }),
      });

      if (!res.ok) return null;
      const j = await res.json();
      if (j && j.token) {
        try {
          localStorage.setItem("adminToken", j.token);
        } catch {}
        return j.token;
      }
      return null;
    } catch {
      return null;
    }
  }

  return (
    <div className="emp-page">
      <header className="emp-header">
        <h2>Employees List</h2>
        <div className="header-right">
          <input
            className="search-input"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchEmployees()}
          />
          <button className="btn add-btn" onClick={() => setShowModal(true)}>
            ➕ Add Employee
          </button>
        </div>
      </header>

      {errorMsg && <div className="alert error">{errorMsg}</div>}

      <div className="table-wrap">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : employees.length === 0 ? (
          <p className="muted">No employees found.</p>
        ) : (
          <table className="emp-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e._id}>
                  <td>{e.empId}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.designation || "-"}</td>
                  <td>
                    {e.joinDate
                      ? new Date(e.joinDate).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td>
                    {isAdmin ? (
                      <select
                        value={e.status || 'Active'}
                        onChange={async (ev) => {
                          const newStatus = ev.target.value;
                          // optimistic update
                          setEmployees((prev) => prev.map(p => p._id === e._id ? { ...p, status: newStatus } : p));
                          try {
                            const base = window.__BACKEND_URL__ || 'http://localhost:5000';
                            const token = await getAdminToken();
                            const headers = { 'Content-Type': 'application/json' };
                            if (token) headers.Authorization = `Bearer ${token}`;
                            const res = await fetch(`${base}/api/employees/${e._id}`, {
                              method: 'PUT',
                              headers,
                              body: JSON.stringify({ status: newStatus }),
                            });
                            if (!res.ok) throw new Error('Failed to update status');
                            const json = await res.json();
                            // ensure server value is used
                            setEmployees((prev) => prev.map(p => p._id === e._id ? { ...p, status: json.employee?.status || newStatus } : p));
                          } catch (err) {
                            // rollback on error
                            setEmployees((prev) => prev.map(p => p._id === e._id ? { ...p, status: e.status } : p));
                            setErrorMsg(err.message || 'Failed to update status');
                          }
                        }}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    ) : (
                      <span className={`status ${e.status?.toLowerCase()}`}>
                        {e.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {isAdmin && (
                      <button
                        className="btn"
                        style={{ padding: '6px 8px', fontSize: 13 }}
                        onClick={async () => {
                          const pwd = prompt(`Enter new password for ${e.email}:`);
                          if (!pwd) return;
                          if (pwd.length < 6) { alert('Password must be at least 6 characters'); return; }
                          try {
                            const base = window.__BACKEND_URL__ || 'http://localhost:5000';
                            const token = await getAdminToken();
                            const headers = { 'Content-Type': 'application/json' };
                            if (token) headers.Authorization = `Bearer ${token}`;
                            const res = await fetch(`${base}/api/employees/${e._id}`, {
                              method: 'PUT', headers, body: JSON.stringify({ password: pwd })
                            });
                            if (!res.ok) {
                              const body = await res.json().catch(() => ({}));
                              alert(body.error || 'Failed to update password');
                              return;
                            }
                            alert('Password updated');
                          } catch (err) {
                            console.error(err);
                            alert('Failed to update password');
                          }
                        }}
                      >
                        Change Password
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Employee</h3>
            <div className="modal-grid">
              {[
                ["Name", "name"],
                ["Employee ID", "empId"],
                ["Email", "email"],
                ["Password", "password"],
                ["Designation", "designation"],
                ["Join Date", "joinDate"],
              ].map(([label, key]) => (
                <label key={key}>
                  {label}
                  <input
                    type={key === "joinDate" ? "date" : (key === 'password' ? 'password' : 'text')}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    autoComplete={key === 'password' ? 'new-password' : undefined}
                  />
                </label>
              ))}
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={addEmployee}>
                Save
              </button>
              <button
                className="btn cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
        .emp-page { padding: 24px; background: var(--bg); min-height: 90vh; }
        .emp-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .header-right { display:flex; align-items:center; gap:10px; }
        .search-input { padding:8px 10px; border:1px solid var(--border); border-radius:8px; }
        .btn { background: var(--accent); color:white; border:none; border-radius:8px; padding:8px 12px; cursor:pointer; }
        .btn.add-btn { font-weight:600; display:flex; align-items:center; gap:4px; }
        .alert.error { background:#fee2e2; color:var(--danger); padding:10px; border-radius:8px; margin-bottom:10px; }
        .table-wrap { background: var(--card); padding:16px; border-radius:10px; border:1px solid var(--border); box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:auto; }
        table { width:100%; border-collapse:collapse; margin-top:10px; }
        th, td { padding:10px; border-bottom:1px solid #f1f5f9; text-align:left; }
        th { background:#f8fafc; font-weight:600; color:#1e293b; }
        .status.active { background:#f0fdf4; color:#065f46; padding:4px 6px; border-radius:6px; }
        .status.inactive { background:#fff7ed; color:#92400e; padding:4px 6px; border-radius:6px; }
        .muted { color:var(--muted); }
        .modal-overlay {
          position:fixed; inset:0; background:rgba(0,0,0,0.5);
          display:flex; justify-content:center; align-items:center;
        }
        .modal {
          background:white; padding:24px; border-radius:10px; width:400px;
          box-shadow:0 8px 20px rgba(0,0,0,0.15);
        }
        .modal h3 { margin-bottom:12px; }
        .modal-grid { display:grid; gap:10px; }
        .modal-grid label { display:flex; flex-direction:column; font-weight:600; color:#1e293b; font-size:0.95rem; }
        .modal-grid input, .modal-grid select {
          margin-top:6px; padding:8px 10px; border:1px solid var(--border);
          border-radius:6px; font-size:0.95rem;
        }
        .modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }
        .btn.cancel { background:#9ca3af; }
      `}</style>
    </div>
  );
};

export default EmployeeListPage;
