import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import AdminChatbot from './AdminChatbot';
import '../Admin.css';

/**
 * Admin page
 * - loads counts for cards
 * - shows chatbot toggle when localStorage.isAdmin === 'true'
 * - includes an ErrorBoundary and ChatbotWrapper (portal)
 */

const Admin = () => {
  const [counts, setCounts] = useState({ enquiries: null, quotations: null, applications: null });

  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const [enqRes, appsRes] = await Promise.all([
          fetch(`/api/enquiries`),
          fetch(`/api/applications`),
        ]);
        const enqJson = await enqRes.json().catch(() => []);
        const appsJson = await appsRes.json().catch(() => []);

        const enquiries = Array.isArray(enqJson) ? enqJson.length : (enqJson.count || 0);
        const quotations = Array.isArray(enqJson)
          ? enqJson.filter(e => (e.message || '').toLowerCase().includes('quotation request')).length
          : 0;
        const applications = Array.isArray(appsJson) ? appsJson.length : (appsJson.count || 0);

        if (mounted) setCounts({ enquiries, quotations, applications });
      } catch (e) {
        if (mounted) setCounts({ enquiries: null, quotations: null, applications: null });
      }
    };
    fetchCounts();
    return () => { mounted = false; };
  }, []);

  const safeCount = (v) => (v === null ? 0 : v);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Access tools to manage enquiries, applications, and employees efficiently from one central hub.</p>
      </div>

      <div className="admin-grid">
        <Link to="/enquiry-details" className="admin-card">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {counts.enquiries !== null && <span className="badge">{safeCount(counts.enquiries)}</span>}
          </div>
          <h3 className="card-title">Enquiries</h3>
          <span className="card-desc">View and manage incoming enquiries.</span>
        </Link>

        <Link to="/quotations" className="admin-card">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {counts.quotations !== null && <span className="badge">{safeCount(counts.quotations)}</span>}
          </div>
          <h3 className="card-title">Quotations</h3>
          <span className="card-desc">Review quotation requests submitted by clients.</span>
        </Link>

        <Link to="/applications" className="admin-card">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
            {counts.applications !== null && <span className="badge">{safeCount(counts.applications)}</span>}
          </div>
          <h3 className="card-title">Applications</h3>
          <span className="card-desc">Manage job applications and CV downloads.</span>
        </Link>

        <Link to="/leaves" className="admin-card">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h3 className="card-title">Leave Approvals</h3>
          <span className="card-desc">Review and approve employee leave requests.</span>
        </Link>

        <Link to="/salary" className="admin-card">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="card-title">Salary Slip</h3>
          <span className="card-desc">Generate salary slips for employees.</span>
        </Link>

        <Link to="/admin/login-activities" className="admin-card">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h3 className="card-title">Login Activities</h3>
          <span className="card-desc">View recent employee dashboard visits.</span>
        </Link>

        <Link to="/employee-list" className="admin-card">
          <div className="icon-wrapper">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 className="card-title">Employee List</h3>
          <span className="card-desc">View and manage employee details.</span>
        </Link>
      </div>

      {(() => {
        try {
          return localStorage.getItem('isAdmin') === 'true' ? (
            <ChatbotWrapper />
          ) : null;
        } catch { return null; }
      })()}
    </div>
  );
};

/* ErrorBoundary kept here so we only have three files */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 12, color: '#9b1c1c', background: '#fff4f4', borderRadius: 8 }}>
          <strong>Chatbot error:</strong> {String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

/* ChatbotWrapper renders the floating toggle + panel and portals to document.body */
const ChatbotWrapper = () => {
  const [open, setOpen] = useState(false);
  if (typeof document === 'undefined') return null;

  const content = (
    <>
      <button
        className="chatbot-toggle"
        title="Open Admin Chatbot"
        onClick={() => setOpen((s) => !s)}
        aria-label={open ? 'Close admin chatbot' : 'Open admin chatbot'}
      >
        {open ? '✕' : '🤖'}
      </button>
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Admin Chatbot">
          <div className="chatbot-panel-header">
            <span>Admin Assistant</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">✕</button>
          </div>
          <div className="chatbot-panel-body">
            <ErrorBoundary>
              <AdminChatbot />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </>
  );

  try {
    if (typeof document !== 'undefined' && document.body) return createPortal(content, document.body);
  } catch (e) {
    console.warn('Portal failed, rendering inline fallback', e);
  }
  return content;
};

export default Admin;
