// EmployeeDashboard.js
import React, { useEffect, useState } from 'react';

const EmployeeDashboard = () => {
  const [slips, setSlips] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const email = (() => {
    try {
      return localStorage.getItem('employeeEmail') || '';
    } catch {
      return '';
    }
  })();

  // --- LOGIC SECTION ---
  useEffect(() => {
    const fetchSlips = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/salary-slips?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Failed to fetch salary slips');
        const data = await res.json();
        setSlips(data);
      } catch (e) {
        console.error('Error fetching slips:', e);
        setStatus('Failed to fetch salary slips.');
      } finally {
        setLoading(false);
      }
    };
    fetchSlips();

    // Record Activity
    const recordActivity = async () => {
      try {
        if (!email) return;
        await fetch(`/api/login-activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
        });
      } catch (err) {
        console.error('Failed to record login activity', err);
      }
    };
    recordActivity();

    // Real-time listener
    const onCreated = (e) => {
      const slip = e.detail;
      if (slip?.email === email) setSlips((s) => [slip, ...s]);
    };
    window.addEventListener('salarySlipCreated', onCreated);
    return () => window.removeEventListener('salarySlipCreated', onCreated);
  }, [email]);

  const handleLogout = () => {
     localStorage.removeItem('employeeEmail');
     window.location.href = '/login'; 
  };

  // --- CSS STYLES (Embedded) ---
  const styles = `
    * {
      box-sizing: border-box;
    }
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Roboto', Helvetica, Arial, sans-serif;
    }
    .dashboard-container {
      min-height: 100vh;
      background-color: #f4f7fa;
      display: flex;
      flex-direction: column;
    }
    /* Navbar */
    .dashboard-navbar {
      background-color: #104c91;
      color: white;
      padding: 0 2rem;
      height: 70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.3rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .logo-box {
      background: white;
      color: #104c91;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 800;
      display: inline-block;
    }
    .logout-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.4);
      color: white;
      padding: 8px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logout-btn:hover {
      background: rgba(255,255,255,0.1);
      border-color: white;
    }

    /* Content Area */
    .dashboard-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 6rem; /* Space from top */
    }
    .dashboard-title {
      color: #111827;
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 3.5rem;
      text-align: center;
    }
    .dashboard-cards {
      display: flex;
      gap: 3rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    /* Cards */
    .menu-card {
      background: white;
      width: 340px;
      height: 300px;
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #f3f4f6;
    }
    .menu-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-color: #e5e7eb;
    }
    .card-icon-wrapper {
      margin-bottom: 1.5rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-icon-wrapper svg {
      width: 100%;
      height: 100%;
    }
    .card-title {
      color: #111827;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.75rem 0;
    }
    .card-desc {
      color: #4b5563;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        
        {/* Navbar */}
         

        {/* Main Content */}
        <div className="dashboard-content">
          <h1 className="dashboard-title">Employee Dashboard</h1>

          <div className="dashboard-cards">
            
            {/* Card 1: Salary Slips */}
            <div 
              className="menu-card" 
              onClick={() => { window.location.href = '/employee/salary'; }}
            >
              <div className="card-icon-wrapper">
                 <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="14" y="10" width="36" height="44" rx="4" fill="#EBF5FF" stroke="#104c91" strokeWidth="2"/>
                  <path d="M22 20H42" stroke="#104c91" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 28H42" stroke="#104c91" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 36H32" stroke="#104c91" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="44" cy="44" r="10" fill="#104c91"/>
                  <path d="M44 39V49M44 49V50" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M42 41C42 41 46 41 46 43C46 45 42 45 42 47C42 49 46 49 46 49" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="card-title">Salary Slips</h3>
              <p className="card-desc">View your salary slips and download PDFs.</p>
            </div>

            {/* Card 2: Request Leave */}
            <div 
              className="menu-card" 
              onClick={() => { window.location.href = '/request-leave'; }}
            >
              <div className="card-icon-wrapper">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <rect x="10" y="12" width="44" height="40" rx="4" fill="#EBF5FF" stroke="#104c91" strokeWidth="2"/>
                   <path d="M10 22H54" stroke="#104c91" strokeWidth="2"/>
                   <path d="M18 8V16" stroke="#104c91" strokeWidth="2" strokeLinecap="round"/>
                   <path d="M46 8V16" stroke="#104c91" strokeWidth="2" strokeLinecap="round"/>
                   <path d="M48 26L32 42L28 38" stroke="#104c91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="card-title">Request Leave</h3>
              <p className="card-desc">Apply for leave quickly.</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

// 🔹 Helper: Download a PDF file safely
async function downloadAndHandle(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch file');
  const type = res.headers.get('content-type');
  if (!type.includes('pdf')) throw new Error('Not a valid PDF file');
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

export default EmployeeDashboard;
