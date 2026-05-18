import React, { useEffect, useState } from 'react';
// import '../Admin.css'; // Commented out to rely on inline styles for this demo

const LoginActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true); // Start true
  const [error, setError] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);

  // Sample data to show if API fails
  const MOCK_DATA = [
    { _id: '1', timestamp: '2025-12-03T09:45:12.000Z', email: 'sarah.jones@example.com' },
    { _id: '2', timestamp: '2025-12-03T09:30:05.000Z', email: 'michael.smith@example.com' },
    { _id: '3', timestamp: '2025-12-03T08:15:22.000Z', email: 'david.lee@example.com' },
    { _id: '4', timestamp: '2025-12-02T17:55:10.000Z', email: 'emily.wang@example.com' },
    { _id: '5', timestamp: '2025-12-02T16:20:00.000Z', email: 'admin@test.com' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const base = window.__BACKEND_URL__ || 'http://localhost:5000';
        // fast fail timeout to show mock data quickly if backend isn't running
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); 

        const res = await fetch(`${base}/api/login-activities?limit=500`, { 
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setActivities(data);
        
      } catch (e) {
        console.warn("Backend fetch failed, using mock data for display.", e);
        setActivities(MOCK_DATA); // Fallback to mock data
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Simple formatting helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Employee Login Activities</h2>
        <p style={styles.muted}>Recent employee dashboard views (timestamp, email).</p>
        
        {usingMockData && (
          <div style={styles.warningBanner}>
            Note: Connection to backend failed. Showing <strong>demo data</strong>.
          </div>
        )}
      </div>

      <div style={styles.card}>
        {loading && <div style={styles.muted}>Loading activities...</div>}

        {!loading && activities.length === 0 && (
          <div style={styles.muted}>No login activities found.</div>
        )}

        {!loading && activities.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, index) => (
                  <tr 
                    key={a._id || index} 
                    style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                  >
                    <td style={styles.td}>
                      {formatDate(a.timestamp || a.createdAt)}
                    </td>
                    <td style={styles.td}>{a.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal CSS styles for immediate visualization
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '20px',
  },
  muted: {
    color: '#6c757d',
    fontSize: '0.9rem',
    marginTop: '5px',
  },
  warningBanner: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
    border: '1px solid #ffeeba',
    fontSize: '0.9rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeaderRow: {
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left',
  },
  th: {
    padding: '12px',
    fontWeight: '600',
    color: '#495057',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
    color: '#212529',
  },
  trEven: {
    backgroundColor: '#ffffff',
  },
  trOdd: {
    backgroundColor: '#f8f9fa',
  }
};

export default LoginActivities;
