import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const NAV_ITEMS = [
  { path: "/organizer",                    icon: "🏠", label: "Home"            },
  { path: "/organizer/add-event",          icon: "✦",  label: "Add Event"       },
  { path: "/organizer/booking-monitor",    icon: "📊", label: "Booking Monitor" },
  { path: "/organizer/manage-events",      icon: "🎟", label: "Manage Events"   },
  { path: "/organizer/reviews",            icon: "⭐", label: "Reviews"         },
  { path: "/organizer/reminders",          icon: "📧", label: "Send Reminder"   },
];

const lowestPrice = (e) => {
  const prices = [e.vipPrice, e.premiumPrice, e.regularPrice].filter(v => v && v > 0);
  return prices.length ? Math.min(...prices) : null;
};

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
};

function Layout() {
  const [events, setEvents]           = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading]         = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  let storedUser = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined") storedUser = JSON.parse(raw);
  } catch {}

  const role  = localStorage.getItem("role");
  const email = storedUser?.email;

  const [organizer, setOrganizer] = useState({ id:null, name:"", email:"", phone:"", companyName:"" });

  useEffect(() => {
    if (!storedUser || role !== "ORGANIZER") navigate("/login");
  }, []);

  useEffect(() => {
    if (!email) return;
    axios.get(`http://localhost:8080/api/organizer/profile?email=${email}`)
      .then(r => setOrganizer(r.data)).catch(console.error)
      .finally(() => setLoading(false));
  }, [email]);

  useEffect(() => {
    if (!email) return;
    axios.get(`http://localhost:8080/api/organizer/events?email=${email}`)
      .then(r => setEvents(r.data)).catch(console.error);
  }, [email]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.put("http://localhost:8080/api/organizer/profile", organizer);
      setOrganizer(r.data); setShowProfile(false); alert("Profile updated!");
    } catch { alert("Update failed"); }
  };

  if (loading) return (
    <div className="org-loader">
      <div className="org-loader-dot" /><div className="org-loader-dot" /><div className="org-loader-dot" />
    </div>
  );

  const isHome = location.pathname === "/organizer";

  return (
    <div className="org-shell">

      {/* ── Header ── */}
      <header className="org-header">
        <div className="org-brand">EVENTMATE <span>AI</span></div>
        <button className="org-profile-pill" onClick={() => setShowProfile(true)}>
          {organizer.name || "Organizer"}
        </button>
      </header>

      <div className="org-body">

        {/* ── Sidebar ── */}
        <aside className="org-sidebar">
          <p className="org-sidebar-label">Menu</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              className={`org-nav-btn ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="org-nav-icon">{item.icon}</span>
              <span className="org-nav-label">{item.label}</span>
            </button>
          ))}
          <button className="org-nav-btn org-logout" onClick={() => { localStorage.clear(); navigate("/login"); }}>
            <span className="org-nav-icon">🚪</span>
            <span className="org-nav-label">Logout</span>
          </button>
        </aside>

        {/* ── Main ── */}
        <main className="org-main">

          {isHome && (
            <div className="org-home-wrap">
              <div className="org-page-title">
                <h2>Welcome back, <span className="gold-name">{organizer.name}</span></h2>
                <p className="org-page-sub">Here's an overview of your events</p>
              </div>

              {events.length > 0 ? (
                <>
                  {/* Event cards grid */}
                  <h3 className="org-section-title">Your Events</h3>
                  <div className="org-events-grid">
                    {events.map(ev => {
                      const status = new Date(ev.eventDate) > new Date() ? "Upcoming" : "Completed";
                      const price  = lowestPrice(ev);
                      return (
                        <div key={ev.id} className="org-ev-card">
                          <div className="org-ev-img-wrap">
                            <img src={`http://localhost:8080/uploads/${ev.imageName}`}
                              alt={ev.eventName} className="org-ev-img"
                              onError={e => { e.target.style.display="none"; }} />
                            <span className={`org-ev-status ${status}`}>{status}</span>
                          </div>
                          <div className="org-ev-body">
                            <h4 className="org-ev-name">{ev.eventName}</h4>
                            <div className="org-ev-row">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              {formatDate(ev.eventDate)}
                            </div>
                            <div className="org-ev-row">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {ev.venue}
                            </div>
                            <div className="org-ev-footer">
                              {price !== null && <span className="org-ev-price">₹{price}</span>}
                              <button className="org-ev-btn"
                                onClick={() => navigate(`/organizer/manage-events/edit/${ev.id}`)}>
                                Edit →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="org-empty">
                  <div className="org-empty-icon">🎪</div>
                  <h3>No events yet</h3>
                  <p>Create your first event to get started</p>
                  <button className="org-manage-btn" onClick={() => navigate("/organizer/add-event")}>
                    + Add Your First Event
                  </button>
                </div>
              )}
            </div>
          )}

          {!isHome && (
            <div className="org-content-card">
              <Outlet context={{ organizer, setOrganizer }} />
            </div>
          )}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="org-modal-overlay">
          <div className="org-modal">
            <h3>Organizer Profile</h3>
            <form onSubmit={handleUpdate}>
              <input className="org-input" type="text" value={organizer.name} onChange={e => setOrganizer({...organizer, name: e.target.value})} placeholder="Name" required />
              <input className="org-input" type="email" value={organizer.email} readOnly />
              <input className="org-input" type="text" value={organizer.phone} onChange={e => setOrganizer({...organizer, phone: e.target.value})} placeholder="Phone" required />
              <input className="org-input" type="text" value={organizer.companyName} onChange={e => setOrganizer({...organizer, companyName: e.target.value})} placeholder="Company" required />
              <div className="org-modal-btns">
                <button type="submit" className="org-save-btn">Save Changes</button>
                <button type="button" className="org-cancel-btn" onClick={() => setShowProfile(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
