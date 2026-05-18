import React, { useEffect, useState } from 'react';
import { formatDateISOToDDMMYYYY } from '../utils/dateFormat';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/applications');
      const data = await res.json();
      setApps(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
  try { window.location.reload(); } catch(e) { fetchApplications(); }
    } catch (err) {
      console.error(err);
      alert('Failed to delete application');
    }
  };

  if (loading) return <h3 style={{ textAlign: 'center' }}>Loading applications...</h3>;

  return (
    <div className="container" style={{ paddingTop: 18 }}>
      <div className="card fade-in">
        <h2>Applications</h2>
        {apps.length === 0 ? (
          <p className="muted">No applications yet.</p>
        ) : (
          <div style={{ marginTop: 12 }}>
            {apps.map((a) => (
              <div key={a._id} className="card" style={{ marginBottom: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{a.name}</strong>
                    <div className="small muted">{a.email} • {a.phone}</div>
                    <div className="small muted">Position: {a.position || '—'}</div>
                    <div className="small muted">Submitted: {formatDateISOToDDMMYYYY(a.createdAt)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {a.resumePath ? <a className="btn btn-ghost" href={`http://localhost:5000/${a.resumePath}`} target="_blank" rel="noreferrer">Resume</a> : null}
                    {a.coverLetterPath ? <a className="btn btn-ghost" href={`http://localhost:5000/${a.coverLetterPath}`} target="_blank" rel="noreferrer">Cover Letter</a> : null}
                    <button onClick={() => deleteApplication(a._id)} className="btn" style={{ background: '#d9534f', color: '#fff' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
