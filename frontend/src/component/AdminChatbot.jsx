import React, { useEffect, useRef, useState } from 'react';

/**
 * AdminChatbot (panel-friendly)
 * - Removed the visible header text ("Admin Chatbot")
 * - Component is no longer fixed-positioned so it fits inside the ChatbotWrapper / Admin Assistant panel
 * - Input box stays inside this component (so it appears within the Admin Assistant panel)
 */
export default function AdminChatbot() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState(null);
  const chatContainerRef = useRef(null);

  const append = (msg) => setMessages((m) => [...m, msg]);

  useEffect(() => {
    try {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch {}
  }, [messages]);

  const getAdminToken = async (forceRefresh = false) => {
    try {
      const cached = !forceRefresh && localStorage.getItem('adminToken');
      if (cached) return cached;
      const base = window.__BACKEND_URL__ || 'http://localhost:5000';
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@abcit.com', password: 'admin123' }),
      });
      if (!res.ok) {
        let text = res.statusText;
        try { const t = await res.text(); if (t) text = t; } catch {}
        setLastError(`Admin login failed: ${text}`);
        append({ from: 'bot', text: `⚠️ Admin login failed: ${text}` });
        return null;
      }
      const j = await res.json().catch(() => null);
      if (j && j.token) {
        try { localStorage.setItem('adminToken', j.token); } catch {}
        return j.token;
      }
      setLastError('Admin login returned unexpected response');
      append({ from: 'bot', text: '⚠️ Admin login returned unexpected response' });
      return null;
    } catch (e) {
      setLastError('Admin login request failed');
      append({ from: 'bot', text: '⚠️ Admin login request failed' });
      return null;
    }
  };

  const callAutoApprove = async (email) => {
    setLoading(true);
    try {
      const base = window.__BACKEND_URL__ || 'http://localhost:5000';
      let token = await getAdminToken();

      const doRequest = async (tokenToUse) => {
        const headers = { 'Content-Type': 'application/json' };
        if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;
        const body = email ? { email } : {};
        return await fetch(`${base}/api/leaves/auto-approve`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
      };

      let res = await doRequest(token);

      if (res.status === 401) {
        try { localStorage.removeItem('adminToken'); } catch {}
        token = await getAdminToken(true);
        res = await doRequest(token);
      }

      let json;
      try { json = await res.json(); } catch { json = null; }

      if (!res.ok) {
        const msg = json && (json.error || json.message) ? (json.error || json.message) : res.statusText;
        append({ from: 'bot', text: `Error: ${msg}` });
      } else {
        const message = (json && (json.message || json.msg)) || 'Auto-approve completed';
        const matched = json && (json.matched || json.count || 0);
        const modified = json && (json.modified || json.updated || 0);
        append({ from: 'bot', text: `✅ ${message}. Matched: ${matched || 0}, Modified: ${modified || 0}` });
        try { window.dispatchEvent(new CustomEvent('leavesUpdated', { detail: { email } })); } catch {}
      }
    } catch (err) {
      console.error(err);
      append({ from: 'bot', text: 'Request failed.' });
    } finally {
      setLoading(false);
    }
  };

  const changeEmployeeStatus = async (email, status) => {
    append({ from: 'bot', text: `Looking up employee ${email}...` });
    try {
      const base = window.__BACKEND_URL__ || 'http://localhost:5000';
      let token = await getAdminToken();

      const doLookup = async (tokenToUse) => {
        const headers = { 'Content-Type': 'application/json' };
        if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;
        return await fetch(`${base}/api/employees?search=${encodeURIComponent(email)}`, { headers });
      };

      let res = await doLookup(token);
      if (res.status === 401) {
        try { localStorage.removeItem('adminToken'); } catch {}
        token = await getAdminToken(true);
        res = await doLookup(token);
      }

      if (!res.ok) {
        let errText = res.statusText;
        try { const errJson = await res.json(); if (errJson && (errJson.error || errJson.message)) errText = errJson.error || errJson.message; } catch {}
        throw new Error(`Failed to lookup employee: ${errText}`);
      }

      let list;
      try { list = await res.json(); } catch { list = null; }
      const candidates = Array.isArray(list) ? list : (list && Array.isArray(list.data) ? list.data : []);
      const found = Array.isArray(candidates) ? candidates.find(it => (it.email || '').toLowerCase() === email.toLowerCase()) : null;
      if (!found) {
        append({ from: 'bot', text: `❌ No employee found with email ${email}` });
        return;
      }

      const doUpdate = async (tokenToUse) => {
        const headers = { 'Content-Type': 'application/json' };
        if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;
        return await fetch(`${base}/api/employees/${found._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status }),
        });
      };

      let updRes = await doUpdate(token);
      if (updRes.status === 401) {
        try { localStorage.removeItem('adminToken'); } catch {}
        token = await getAdminToken(true);
        updRes = await doUpdate(token);
      }

      let updJson = null;
      try { updJson = await updRes.json(); } catch {}
      if (!updRes.ok) {
        const errMsg = updJson && (updJson.error || updJson.message) ? (updJson.error || updJson.message) : updRes.statusText;
        append({ from: 'bot', text: `Error updating employee: ${errMsg}` });
        return;
      }
      append({ from: 'bot', text: `✅ Updated ${found.email} → ${status}` });
      try { window.dispatchEvent(new CustomEvent('employeeStatusChanged', { detail: { email: found.email, status } })); } catch {}
    } catch (err) {
      console.error(err);
      append({ from: 'bot', text: 'Failed to change status.' });
    }
  };

  const handleSend = async () => {
    if (loading) return;
    const txt = input.trim();
    if (!txt) return;
    append({ from: 'user', text: txt });
    setInput('');

    const lower = txt.toLowerCase();
    if (lower === 'approve all' || lower === 'approve all leaves' || lower === 'auto approve all') {
      append({ from: 'bot', text: 'Approving all pending leaves...' });
      await callAutoApprove();
      return;
    }

    const m = lower.match(/approve .*for (\S+@\S+)/i) || lower.match(/approve .* (\S+@\S+)/i);
    if (m && m[1]) {
      const email = m[1];
      append({ from: 'bot', text: `Approving pending leaves for ${email}...` });
      await callAutoApprove(email);
      return;
    }

    const sm = lower.match(/(?:set status|set) .* for (\S+@\S+) to (active|inactive)/i)
            || lower.match(/(?:set status|set) (\S+@\S+) to (active|inactive)/i)
            || lower.match(/(\S+@\S+) (active|inactive)/i);
    if (sm && sm[1] && sm[2]) {
      const email = sm[1];
      const status = sm[2][0].toUpperCase() + sm[2].slice(1).toLowerCase();
      append({ from: 'bot', text: `Setting status for ${email} → ${status}...` });
      await changeEmployeeStatus(email, status);
      return;
    }

    append({ from: 'bot', text: "I didn't understand. Try: 'approve all', 'approve for alice@example.com', or 'set status for alice@example.com to inactive'" });
  };

  const manualSignIn = async () => {
    append({ from: 'bot', text: 'Signing in as admin...' });
    setLastError(null);
    const token = await getAdminToken();
    if (token) append({ from: 'bot', text: '✅ Signed in as admin.' });
    else append({ from: 'bot', text: '❌ Could not sign in as admin. Check backend logs.' });
  };

  // Container styles for panel embedding (not fixed)
  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    background: 'transparent',
  };

  const chatAreaStyle = {
    padding: 10,
    flex: 1,
    overflowY: 'auto',
    background: '#ffffff',
    borderRadius: 8,
  };

  const inputWrap = { display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #e6edf7', background: '#fff' };

  return (
    <div style={containerStyle} role="region" aria-label="Admin Assistant">
      {/* Header intentionally left blank (removed 'Admin Chatbot' text) */}
      <div style={{ height: 12 }} />

      {lastError && (
        <div style={{ padding: 10, background: '#fff4f4', color: '#9b1c1c', borderRadius: 6 }}>
          <strong>Error:</strong> {lastError}
        </div>
      )}

      <div ref={chatContainerRef} style={chatAreaStyle}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 8, textAlign: m.from === 'bot' ? 'left' : 'right' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: 8,
              maxWidth: '85%',
              background: m.from === 'bot' ? '#f1f5fb' : '#2a78d4',
              color: m.from === 'bot' ? '#111' : '#fff',
              wordBreak: 'break-word',
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input stays inside this component so it appears inside the Admin Assistant panel */}
      <div style={inputWrap}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: 'approve all' or 'approve for alice@example.com'"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e6edf7' }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#2a78d4', color: '#fff' }}
          aria-label="Send"
        >
          Send
        </button>
      </div>
    </div>
  );
}
