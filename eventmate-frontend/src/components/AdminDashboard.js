import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

const STAT_CONFIG = [
  { key: "users",      label: "Total Users",   icon: "👤", color: "#6366f1" },
  { key: "organizers", label: "Organizers",     icon: "🏢", color: "#c9a84c" },
  { key: "events",     label: "Events",         icon: "📅", color: "#22c55e" },
  { key: "bookings",   label: "Bookings",       icon: "🎟", color: "#f59e0b" },
];

const fmt = (d) => {
  if (!d) return "—";
  const str = String(d);
  if (str.includes("T")) return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  return str;
};

// ── Role badge
function RoleBadge({ role }) {
  const map = { USER: ["#6366f1","#a5b4fc"], ORGANIZER: ["#c9a84c","#e8c97a"], ADMIN: ["#22c55e","#86efac"] };
  const [bg, text] = map[role] || ["#374151","#9ca3af"];
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:`${bg}22`, color:text, border:`1px solid ${bg}44`, letterSpacing:"0.5px" }}>{role}</span>;
}

// ── Status badge
function StatusBadge({ val }) {
  if (!val) return <span style={{ color:"#4a5a70" }}>—</span>;
  const s = String(val).toUpperCase();
  if (s === "PAID" || s === "CONFIRMED") return <span className="paid-badge">{val}</span>;
  if (s === "PENDING") return <span className="pending-badge">{val}</span>;
  return <span style={{ color:"var(--text-muted)", fontSize:12 }}>{val}</span>;
}

// ── Users table
function UsersTable({ data, onDelete }) {
  return (
    <div className="bm-table-wrap">
      <table className="admin-table">
        <thead><tr>
          <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Action</th>
        </tr></thead>
        <tbody>
          {data.map(u => (
            <tr key={u.id}>
              <td style={{ color:"var(--text-muted)", width:50 }}>{u.id}</td>
              <td style={{ fontWeight:600 }}>{u.name || "—"}</td>
              <td style={{ color:"var(--text-muted)" }}>{u.email}</td>
              <td>{u.phone || "—"}</td>
              <td><RoleBadge role={u.role || "USER"} /></td>
              <td>
                <button className="delete-btn-admin" onClick={() => onDelete("users", u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Organizers table
function OrganizersTable({ data, onDelete }) {
  return (
    <div className="bm-table-wrap">
      <table className="admin-table">
        <thead><tr>
          <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Action</th>
        </tr></thead>
        <tbody>
          {data.map(o => (
            <tr key={o.id}>
              <td style={{ color:"var(--text-muted)", width:50 }}>{o.id}</td>
              <td style={{ fontWeight:600 }}>{o.name || "—"}</td>
              <td style={{ color:"var(--text-muted)" }}>{o.email}</td>
              <td>{o.phone || "—"}</td>
              <td>{o.companyName || "—"}</td>
              <td>
                <button className="delete-btn-admin" onClick={() => onDelete("organizers", o.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Events cards grid
function EventsGrid({ data, onDelete }) {
  const fmt2 = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
  const isUpcoming = (d) => d ? new Date(d) > new Date() : false;

  return (
    <div className="me-grid">
      {data.map(ev => (
        <div key={ev.id} className="me-card">
          <div className="me-img-wrap">
            <img src={`http://localhost:8080/uploads/${ev.imageName}`} alt={ev.eventName}
              className="me-img" onError={e => { e.target.style.display="none"; }} />
            <div className="me-img-overlay" />
            <span className={`me-status ${isUpcoming(ev.eventDate) ? "Upcoming" : "Completed"}`}>
              {isUpcoming(ev.eventDate) ? "Upcoming" : "Completed"}
            </span>
          </div>
          <div className="me-body">
            <h3 className="me-title">{ev.eventName}</h3>
            <div className="me-meta">
              <span className="me-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {ev.venue}
              </span>
              <span className="me-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {fmt2(ev.eventDate)}
              </span>
            </div>
            <div className="me-tiers">
              {ev.vipSeats > 0 && <span className="me-tier vip">VIP ₹{ev.vipPrice}</span>}
              {ev.premiumSeats > 0 && <span className="me-tier premium">Premium ₹{ev.premiumPrice}</span>}
              {ev.regularSeats > 0 && <span className="me-tier regular">Regular ₹{ev.regularPrice}</span>}
            </div>
            <div className="me-actions">
              <button className="me-delete-btn" style={{ flex:1 }} onClick={() => onDelete("events", ev.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Bookings table — clean columns only
function BookingsTable({ data }) {
  return (
    <div className="bm-table-wrap">
      <table className="admin-table">
        <thead><tr>
          <th>#</th>
          <th>User</th>
          <th>Seat Category</th>
          <th>Seats</th>
          <th>Total</th>
          <th>Date</th>
          <th>Payment</th>
          <th>Status</th>
          <th>Seat Nos.</th>
        </tr></thead>
        <tbody>
          {data.map(b => (
            <tr key={b.id}>
              <td style={{ color:"var(--text-muted)", width:50 }}>{b.id}</td>
              <td>
                <div style={{ fontWeight:600, fontSize:13 }}>{b.username || "—"}</div>
                <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{b.userEmail}</div>
              </td>
              <td>
                <span style={{
                  padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
                  background: b.seatCategory === "VIP" ? "rgba(201,168,76,.15)" : b.seatCategory === "PREMIUM" ? "rgba(99,102,241,.15)" : "rgba(34,197,94,.12)",
                  color: b.seatCategory === "VIP" ? "#e8c97a" : b.seatCategory === "PREMIUM" ? "#a5b4fc" : "#86efac",
                  border: `1px solid ${b.seatCategory === "VIP" ? "rgba(201,168,76,.3)" : b.seatCategory === "PREMIUM" ? "rgba(99,102,241,.3)" : "rgba(34,197,94,.25)"}`,
                }}>
                  {b.seatCategory}
                </span>
              </td>
              <td style={{ textAlign:"center" }}>{b.seatsBooked}</td>
              <td style={{ fontFamily:"'Playfair Display',serif", color:"var(--gold)", fontWeight:700 }}>₹{b.totalAmount}</td>
              <td style={{ color:"var(--text-muted)", fontSize:12 }}>{fmt(b.bookingDate)}</td>
              <td><StatusBadge val={b.paymentStatus} /></td>
              <td><StatusBadge val={b.bookingStatus} /></td>
              <td style={{ color:"var(--text-muted)", fontSize:11 }}>{b.seatNumbers || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [counts, setCounts] = useState({ users:0, organizers:0, events:0, bookings:0 });
  const [data,   setData]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCounts(); }, []);

  const fetchCounts = async () => {
    try { const r = await axios.get("http://localhost:8080/api/admin/counts"); setCounts(r.data); }
    catch (e) { console.error(e); }
  };

  const fetchData = async (type) => {
    try {
      setLoading(true); setActive(type);
      const r = await axios.get(`http://localhost:8080/api/admin/${type}`);
      setData(r.data);
    } catch (e) { console.error(e); setData([]); }
    finally { setLoading(false); }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Delete this ${type.slice(0,-1)}?`)) return;
    try { await axios.delete(`http://localhost:8080/api/admin/${type}/${id}`); fetchData(type); fetchCounts(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="admin-wrapper">

      {/* Header */}
      <header className="admin-header">
        <div className="org-brand">EVENTMATE <span>AI</span></div>
        <div className="profile-pill">ADMIN</div>
      </header>

      <div className="admin-body">

        {/* Sidebar */}
        <aside className="admin-sidebar">
          <p className="menu-title">Menu</p>
          {[
            { id:"dashboard", icon:"🏠", label:"Dashboard"  },
            { id:"users",     icon:"👤", label:"Users"       },
            { id:"organizers",icon:"🏢", label:"Organizers"  },
            { id:"events",    icon:"📅", label:"Events"      },
            { id:"bookings",  icon:"🎟", label:"Bookings"    },
          ].map(item => (
            <button key={item.id}
              className={`sidebar-btn ${active === item.id ? "active" : ""}`}
              onClick={() => item.id === "dashboard" ? setActive("dashboard") : fetchData(item.id)}>
              <span className="org-nav-icon">{item.icon}</span>
              <span className="org-nav-label">{item.label}</span>
            </button>
          ))}
          <button className="logout-admin"
            onClick={() => { localStorage.clear(); window.location.href="/login"; }}>
            <span className="org-nav-icon">🚪</span>
            <span className="org-nav-label">Logout</span>
          </button>
        </aside>

        {/* Content */}
        <main className="admin-main">
          <div className="admin-content">

            {/* DASHBOARD */}
            {active === "dashboard" && (
              <>
                <div className="org-page-title" style={{ marginBottom:24 }}>
                  <h2>Admin Dashboard</h2>
                  <p className="org-page-sub">Platform overview and management</p>
                </div>
                <div className="stat-cards">
                  {STAT_CONFIG.map(s => (
                    <div key={s.key} className="stat-card" style={{ borderLeftColor: s.color, cursor:"pointer" }}
                      onClick={() => fetchData(s.key)}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <h3 style={{ color: s.color }}>{counts[s.key]}</h3>
                          <p>{s.label}</p>
                        </div>
                        <span style={{ fontSize:26, opacity:.6 }}>{s.icon}</span>
                      </div>
                      <div style={{ marginTop:10, fontSize:11, color:"#4a5a70", letterSpacing:"1px" }}>
                        CLICK TO VIEW →
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"24px", background:"rgba(255,255,255,.02)", borderRadius:8, border:"1px solid rgba(201,168,76,.1)", marginTop:8 }}>
                  <p style={{ fontSize:14, color:"var(--text-muted)", textAlign:"center" }}>
                    Select a category above to view and manage data
                  </p>
                </div>
              </>
            )}

            {/* DATA VIEWS */}
            {active !== "dashboard" && (
              <>
                <div className="org-page-title" style={{ marginBottom:20 }}>
                  <h2 style={{ textTransform:"capitalize" }}>{active}</h2>
                  <p className="org-page-sub">{data.length} records found</p>
                </div>

                {loading ? (
                  <div style={{ display:"flex", justifyContent:"center", padding:"60px", gap:10 }}>
                    <div className="org-loader-dot" /><div className="org-loader-dot" /><div className="org-loader-dot" />
                  </div>
                ) : data.length === 0 ? (
                  <div className="org-empty"><div className="org-empty-icon">📭</div><p>No data available</p></div>
                ) : (
                  <>
                    {active === "users"      && <UsersTable      data={data} onDelete={deleteItem} />}
                    {active === "organizers" && <OrganizersTable data={data} onDelete={deleteItem} />}
                    {active === "events"     && <EventsGrid      data={data} onDelete={deleteItem} />}
                    {active === "bookings"   && <BookingsTable   data={data} />}
                  </>
                )}
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
