
// --- Quotation.js ---
import React, { useState } from 'react';
import './Quotation.css';

const Quotation = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Custom Software Development',
    details: '',
    budget: '',
    deadline: '',
  });

  const [status, setStatus] = useState(null);

  const services = [
    'Custom Software Development',
    'Cloud & DevOps',
    'Web Development',
    'Mobile App Development',
    'Data Analytics',
  ];

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const baseUrl = (window && window.__BACKEND_URL__) || 'http://localhost:5000';

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(`${baseUrl}/api/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone_number: form.phone,
          message: `Quotation request for ${form.service} - Company: ${form.company}\nBudget: ${form.budget}\nDeadline: ${form.deadline}\nDetails: ${form.details}`,
        }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus({ state: 'error', message: (payload && payload.error) || 'Failed to submit' });
        return;
      }

      setStatus({ state: 'submitted', message: (payload && payload.message) || 'Quotation request sent.' });
      setForm({ name: '', email: '', phone: '', company: '', service: services[0], details: '', budget: '', deadline: '' });
    } catch (err) {
      setStatus({ state: 'error', message: 'Network error. Is the backend running?' });
    }
  };

  return (
    <div className="quotation-page container">
      <div className="quotation-container card fade-in-top">
        <h2>Request a Quotation</h2>
        <p>Tell us about your project and we'll provide a tailored quotation.</p>
        <form className="quotation-form" onSubmit={onSubmit}>
          <div className="row">
            <label>Name</label>
            <input name="name" value={form.name} onChange={onChange} required />
          </div>

          <div className="row">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </div>

          <div className="row">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} />
          </div>

          <div className="row">
            <label>Company</label>
            <input name="company" value={form.company} onChange={onChange} />
          </div>

          <div className="row">
            <label>Service</label>
            <select name="service" value={form.service} onChange={onChange}>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="row">
            <label>Estimated Budget</label>
            <input name="budget" value={form.budget} onChange={onChange} placeholder="e.g., ₹50000" />
          </div>

          <div className="row">
            <label>Desired Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={onChange} />
          </div>

          <div className="row">
            <label>Project Details</label>
            <textarea name="details" value={form.details} onChange={onChange} rows={6} />
          </div>

          <div className="row actions">
            <button type="submit" disabled={status && (status === 'submitting' || status.state === 'submitting')}>
              {(status === 'submitting' || (status && status.state === 'submitting')) ? 'Sending...' : 'Request Quotation'}
            </button>

            {((status === 'submitted') || (status && status.state === 'submitted')) && (
              <span className="success">{(status && status.message) || "Quotation request sent. We'll contact you soon."}</span>
            )}

            {((status === 'error') || (status && status.state === 'error')) && (
              <span className="error">{(status && status.message) || 'Failed to send. Try again later.'}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quotation;
