import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OrganizerReminderPage.css";

function OrganizerReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [sending,   setSending]   = useState(null);

  useEffect(() => { loadReminders(); }, []);

  const loadReminders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/organizer/reminders");
      setReminders(res.data);
    } catch (err) { console.error(err); }
  };

  const sendReminder = async (id) => {
    setSending(id);
    try {
      await axios.post(`http://localhost:8080/api/organizer/sendReminder/${id}`);
      setReminders(prev => prev.filter(r => r.bookingId !== id));
    } catch (err) { console.error(err); }
    finally { setSending(null); }
  };

  const fmtDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }
    catch { return String(d); }
  };

  return (
    <div>
      {/* Page header */}
      <div className="org-page-title" style={{ marginBottom:24 }}>
        <h2>Send Reminders</h2>
        <p className="org-page-sub">
          {reminders.length > 0
            ? `${reminders.length} attendee${reminders.length > 1 ? "s" : ""} awaiting reminder`
            : "All reminders sent"}
        </p>
      </div>

      {reminders.length === 0 ? (
        <div className="org-empty">
          <div className="org-empty-icon">✉️</div>
          <h3>All caught up!</h3>
          <p>No pending reminders to send.</p>
        </div>
      ) : (
        <div className="rm-grid">
          {reminders.map(r => (
            <div key={r.bookingId} className="rm-card">
              {/* User + event info */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:"var(--text-primary)", marginBottom:8 }}>
                  {r.userName}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  <span style={{ fontSize:12, color:"var(--text-muted)", display:"flex", alignItems:"center", gap:6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" opacity=".7"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {r.userEmail}
                  </span>
                  <span style={{ fontSize:12, color:"var(--text-muted)", display:"flex", alignItems:"center", gap:6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" opacity=".7"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                    {r.eventName}
                  </span>
                  <span style={{ fontSize:12, color:"var(--text-muted)", display:"flex", alignItems:"center", gap:6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" opacity=".7"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {fmtDate(r.eventDate)}
                  </span>
                </div>
              </div>

              {/* Send button */}
              <button
                className="rm-send-btn"
                onClick={() => sendReminder(r.bookingId)}
                disabled={sending === r.bookingId}
              >
                {sending === r.bookingId ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation:"spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" opacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                    Sending...
                  </span>
                ) : (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    SEND REMINDER
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizerReminderPage;
