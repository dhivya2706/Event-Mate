import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AdminDashboard.module.css";

function AdminDashboard({ onLogout, user }) {

  const [activePage, setActivePage] = useState("dashboard");
  const [activeTab,  setActiveTab]  = useState("all"); // "all" | "inactive"

  const [stats, setStats] = useState({ users:0, organisers:0, admins:0, events:0, bookings:0 });

  const [usersList,      setUsersList]      = useState([]);
  const [inactiveList,   setInactiveList]   = useState([]);
  const [events,         setEvents]         = useState([]);
  const [bookings,       setBookings]       = useState([]);
  const [reviews,        setReviews]        = useState([]);

  const [adminName,  setAdminName]  = useState(localStorage.getItem("adminName")  || "");
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem("adminEmail") || "");
  const adminId = localStorage.getItem("adminId") || user?.id;

  const [editName,     setEditName]     = useState("");
  const [editEmail,    setEditEmail]    = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editMode,     setEditMode]     = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [profileMsg,   setProfileMsg]   = useState("");

  // ================= FETCH =================
  const fetchStats = async () => {
    try { const r = await axios.get("http://localhost:8080/api/admin/stats"); setStats(r.data); }
    catch(e) { console.error(e); }
  };

  const fetchUsers = async (role) => {
    try {
      const [allRes, inactiveRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/admin/users?role=${role}`),
        axios.get(`http://localhost:8080/api/admin/users/inactive?role=${role}`)
      ]);
      setUsersList(allRes.data);
      setInactiveList(inactiveRes.data);
    } catch(e) { console.error(e); }
  };

  const fetchEvents   = async () => {
    try { const r = await axios.get("http://localhost:8080/api/admin/events");   setEvents(r.data);   setStats(p=>({...p,events:r.data.length})); } catch(e){}
  };
  const fetchBookings = async () => {
    try { const r = await axios.get("http://localhost:8080/api/admin/bookings"); setBookings(r.data); setStats(p=>({...p,bookings:r.data.length})); } catch(e){}
  };
  const fetchReviews  = async () => {
    try { const r = await axios.get("http://localhost:8080/api/admin/feedback"); setReviews(r.data); } catch(e){}
  };

  // ================= DELETE SINGLE =================
  const deleteUser = async (id, name, roleLabel) => {
    if (!window.confirm(`Delete ${roleLabel} "${name}"?\nThis cannot be undone.`)) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
      const role = roleLabel === "User" ? "USER" : "ORGANISER";
      fetchUsers(role);
      fetchStats();
    } catch(e) { alert("Failed to delete. Try again."); }
  };

  // ✅ ================= DELETE ALL INACTIVE =================
  const deleteAllInactive = async (role) => {
    const roleLabel = role === "USER" ? "Users" : "Organizers";
    if (!window.confirm(`Delete ALL ${inactiveList.length} inactive ${roleLabel} (no login for 10+ days)?\n\nThis CANNOT be undone.`)) return;
    try {
      const res = await axios.delete(`http://localhost:8080/api/admin/users/inactive?role=${role}`);
      alert(`✅ ${res.data.message}`);
      fetchUsers(role);
      fetchStats();
    } catch(e) { alert("Bulk delete failed. Try again."); }
  };

  // ================= APPROVE / DECLINE =================
  const approveEvent = async (id) => { await axios.put(`http://localhost:8080/api/admin/events/${id}/approve`); fetchEvents(); };
  const declineEvent = async (id) => { await axios.put(`http://localhost:8080/api/admin/events/${id}/decline`); fetchEvents(); };

  // ================= SAVE PROFILE =================
  const handleProfileSave = async () => {
    setSaving(true); setProfileMsg("");
    try {
      if (!adminId) { setProfileMsg("❌ Admin ID not found."); setSaving(false); return; }
      const body = {};
      if (editName.trim())     body.name     = editName.trim();
      if (editEmail.trim())    body.email    = editEmail.trim();
      if (editPassword.trim()) body.password = editPassword.trim();
      await axios.put(`http://localhost:8080/api/admin/profile/${adminId}`, body);
      if (editName.trim())  { localStorage.setItem("adminName",  editName.trim());  setAdminName(editName.trim()); }
      if (editEmail.trim()) { localStorage.setItem("adminEmail", editEmail.trim()); setAdminEmail(editEmail.trim()); }
      setProfileMsg("✅ Profile updated!"); setEditMode(false); setEditPassword("");
    } catch(e) { setProfileMsg("❌ Failed to update."); }
    setSaving(false);
  };

  const openEdit = () => { setEditName(adminName); setEditEmail(adminEmail); setEditPassword(""); setProfileMsg(""); setEditMode(true); };

  // ================= LIFECYCLE =================
  useEffect(() => { fetchStats(); fetchEvents(); fetchBookings(); fetchReviews(); }, []);

  useEffect(() => {
    setActiveTab("all"); // reset tab on page change
    if      (activePage === "users")      fetchUsers("USER");
    else if (activePage === "organisers") fetchUsers("ORGANISER");
    else if (activePage === "events")     fetchEvents();
    else if (activePage === "bookings")   fetchBookings();
    else if (activePage === "reviews")    fetchReviews();
  }, [activePage]);

  // ================= USERS TABLE =================
  const renderUsersTable = (role) => {
    const roleLabel  = role === "USER" ? "User" : "Organizer";
    const displayList = activeTab === "inactive" ? inactiveList : usersList;

    const formatDate = (dateStr) => {
      if (!dateStr) return <span style={{color:"#ef4444",fontWeight:600}}>Never logged in</span>;
      return new Date(dateStr).toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"});
    };

    const getDaysAgo = (dateStr) => {
      if (!dateStr) return null;
      const days = Math.floor((new Date() - new Date(dateStr)) / (1000*60*60*24));
      return days;
    };

    return (
      <div className={`${styles.userTable} ${styles.fadeIn}`}>

        {/* Header + Tabs */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"12px"}}>
          <h3 style={{margin:0}}>
            {role==="USER"?"👥":"🎯"} {roleLabel}s
            <span style={{marginLeft:"10px",backgroundColor:"#eef2ff",color:"#4f46e5",borderRadius:"20px",padding:"2px 12px",fontSize:"0.8rem",fontWeight:700}}>
              {usersList.length} total
            </span>
          </h3>

          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            {/* Tab Buttons */}
            <button
              onClick={() => setActiveTab("all")}
              style={{
                padding:"7px 18px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:600, fontSize:"0.85rem",
                backgroundColor: activeTab==="all" ? "#4f46e5" : "#f3f4f6",
                color:           activeTab==="all" ? "#fff"     : "#374151"
              }}
            >
              All ({usersList.length})
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              style={{
                padding:"7px 18px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:600, fontSize:"0.85rem",
                backgroundColor: activeTab==="inactive" ? "#ef4444" : "#fee2e2",
                color:           activeTab==="inactive" ? "#fff"     : "#dc2626"
              }}
            >
              ⚠️ Inactive 10+ days ({inactiveList.length})
            </button>

            {/* Bulk Delete — only visible in inactive tab */}
            {activeTab === "inactive" && inactiveList.length > 0 && (
              <button
                onClick={() => deleteAllInactive(role)}
                style={{
                  padding:"7px 18px", borderRadius:"8px", border:"none", cursor:"pointer",
                  fontWeight:700, fontSize:"0.85rem",
                  backgroundColor:"#7f1d1d", color:"#fff"
                }}
              >
                🗑️ Delete All Inactive
              </button>
            )}
          </div>
        </div>

        {/* Inactive warning banner */}
        {activeTab === "inactive" && inactiveList.length > 0 && (
          <div style={{
            backgroundColor:"#fef3c7", border:"1px solid #fbbf24",
            borderRadius:"10px", padding:"12px 16px",
            marginBottom:"16px", fontSize:"0.88rem", color:"#92400e"
          }}>
            ⚠️ <strong>{inactiveList.length} {roleLabel}(s)</strong> have not logged in for <strong>10+ days</strong>. You can delete them individually or use "Delete All Inactive".
          </div>
        )}

        {activeTab === "inactive" && inactiveList.length === 0 && (
          <div style={{textAlign:"center",padding:"40px",color:"#10b981"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"8px"}}>✅</div>
            <p style={{fontWeight:600}}>All {roleLabel}s are active! No one has been inactive for 10+ days.</p>
          </div>
        )}

        {displayList.length === 0 && activeTab === "all" && (
          <div style={{textAlign:"center",padding:"40px",color:"#9ca3af"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"8px"}}>🙅</div>
            <p>No {roleLabel.toLowerCase()}s registered yet.</p>
          </div>
        )}

        {displayList.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
                {activeTab === "inactive" && <th>Days Inactive</th>}
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((u, index) => {
                const days = getDaysAgo(u.lastLogin);
                const isInactive = !u.lastLogin || days > 10;
                return (
                  <tr key={u.id} className={styles.fadeRow} style={{ backgroundColor: isInactive && activeTab==="all" ? "#fff7f7" : undefined }}>
                    <td style={{color:"#9ca3af",width:"40px"}}>{index+1}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <div style={{width:"34px",height:"34px",borderRadius:"50%",backgroundColor: isInactive?"#fee2e2":"#eef2ff",color:isInactive?"#dc2626":"#4f46e5",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"0.9rem"}}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{fontWeight:600,color:"#111827"}}>{u.name}</span>
                        {isInactive && <span style={{backgroundColor:"#fee2e2",color:"#dc2626",fontSize:"0.7rem",padding:"1px 8px",borderRadius:"20px",fontWeight:700}}>INACTIVE</span>}
                      </div>
                    </td>
                    <td style={{color:"#6b7280"}}>{u.email}</td>
                    <td style={{fontSize:"0.85rem"}}>
                      {u.lastLogin
                        ? <span style={{color: days>10?"#dc2626":"#10b981", fontWeight:600}}>{formatDate(u.lastLogin)}</span>
                        : <span style={{color:"#ef4444",fontWeight:600}}>Never</span>
                      }
                    </td>
                    {activeTab === "inactive" && (
                      <td>
                        <span style={{backgroundColor:"#fee2e2",color:"#dc2626",padding:"3px 10px",borderRadius:"20px",fontWeight:700,fontSize:"0.85rem"}}>
                          {u.daysSinceLogin >= 0 ? `${u.daysSinceLogin} days` : "Never logged in"}
                        </span>
                      </td>
                    )}
                    <td style={{color:"#9ca3af",fontSize:"0.85rem"}}>{formatDate(u.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => deleteUser(u.id, u.name, roleLabel)}
                        style={{backgroundColor:"#fee2e2",color:"#dc2626",border:"1px solid #fca5a5",padding:"6px 14px",borderRadius:"8px",cursor:"pointer",fontWeight:600,fontSize:"0.85rem"}}
                        onMouseOver={e=>{e.target.style.backgroundColor="#dc2626";e.target.style.color="#fff";}}
                        onMouseOut={e =>{e.target.style.backgroundColor="#fee2e2";e.target.style.color="#dc2626";}}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  // ================= DASHBOARD HOME =================
  const renderDashboardHome = () => {
    const totalRevenue   = bookings.reduce((s,b)=>s+Number(b.totalAmount||0),0);
    const pendingEvents  = events.filter(e=>!e.status||e.status==="PENDING").length;
    const approvedEvents = events.filter(e=>e.status==="APPROVED").length;
    const avgRating = reviews.length>0 ? (reviews.reduce((s,r)=>s+Number(r.rating||0),0)/reviews.length).toFixed(1) : "—";
    const recentBookings = [...bookings].sort((a,b)=>new Date(b.bookingDate)-new Date(a.bookingDate)).slice(0,5);
    const hour = new Date().getHours();
    const greeting = hour<12?"Good Morning":hour<17?"Good Afternoon":"Good Evening";

    return (
      <div className={styles.fadeIn}>
        {/* Welcome Banner */}
        <div style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",borderRadius:"16px",padding:"24px 28px",color:"#fff",marginBottom:"24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 style={{margin:0,fontSize:"1.5rem",fontWeight:700}}>{greeting}, {adminName||"Admin"} 👋</h2>
            <p style={{margin:"6px 0 0",opacity:0.85,fontSize:"0.95rem"}}>Here's what's happening with EventMate today.</p>
          </div>
          <div style={{fontSize:"3rem"}}>🎟️</div>
        </div>

        {/* KPI Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"16px",marginBottom:"24px"}}>
          {[
            {label:"Total Users",    value:stats.users,      icon:"👥",color:"#6366f1"},
            {label:"Organizers",     value:stats.organisers, icon:"🎯",color:"#8b5cf6"},
            {label:"Total Events",   value:stats.events,     icon:"🎪",color:"#0ea5e9"},
            {label:"Total Bookings", value:stats.bookings,   icon:"🎟️",color:"#10b981"},
            {label:"Total Revenue",  value:`₹${totalRevenue.toLocaleString()}`,icon:"💰",color:"#f59e0b"},
            {label:"Avg Rating",     value:`⭐ ${avgRating}`,icon:"📊",color:"#ef4444"},
          ].map((c,i)=>(
            <div key={i} style={{backgroundColor:"#fff",borderRadius:"14px",padding:"18px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)",borderLeft:`4px solid ${c.color}`,display:"flex",flexDirection:"column",gap:"6px"}}>
              <div style={{fontSize:"1.5rem"}}>{c.icon}</div>
              <div style={{fontSize:"1.4rem",fontWeight:700,color:"#111827"}}>{c.value}</div>
              <div style={{fontSize:"0.8rem",color:"#6b7280"}}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Event Status + Recent Bookings */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:"20px",marginBottom:"24px"}}>
          <div style={{backgroundColor:"#fff",borderRadius:"14px",padding:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
            <h4 style={{margin:"0 0 16px",color:"#111827",fontWeight:700}}>📋 Event Status</h4>
            {[
              {label:"Approved",count:approvedEvents,color:"#10b981",bg:"#d1fae5"},
              {label:"Pending", count:pendingEvents, color:"#f59e0b",bg:"#fef3c7"},
              {label:"Declined",count:events.filter(e=>e.status==="DECLINED").length,color:"#ef4444",bg:"#fee2e2"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                <span style={{color:"#374151",fontWeight:500}}>{item.label}</span>
                <span style={{backgroundColor:item.bg,color:item.color,padding:"3px 14px",borderRadius:"20px",fontWeight:700,fontSize:"0.9rem"}}>{item.count}</span>
              </div>
            ))}
            <div style={{marginTop:"16px"}}>
              <div style={{fontSize:"0.8rem",color:"#6b7280",marginBottom:"4px"}}>Approval Rate</div>
              <div style={{backgroundColor:"#e5e7eb",borderRadius:"10px",height:"8px"}}>
                <div style={{height:"8px",borderRadius:"10px",backgroundColor:"#10b981",width:events.length>0?`${(approvedEvents/events.length)*100}%`:"0%",transition:"width 1s ease"}}/>
              </div>
              <div style={{fontSize:"0.78rem",color:"#6b7280",marginTop:"4px"}}>{events.length>0?Math.round((approvedEvents/events.length)*100):0}% approved</div>
            </div>
          </div>

          <div style={{backgroundColor:"#fff",borderRadius:"14px",padding:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
            <h4 style={{margin:"0 0 16px",color:"#111827",fontWeight:700}}>🕐 Recent Bookings</h4>
            {recentBookings.length===0
              ? <p style={{color:"#9ca3af",textAlign:"center",padding:"20px 0"}}>No bookings yet</p>
              : <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.88rem"}}>
                  <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
                    {["ID","User","Seats","Amount","Date"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 8px",color:"#6b7280",fontWeight:600}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {recentBookings.map(b=>(
                      <tr key={b.id} style={{borderBottom:"1px solid #f9fafb"}}>
                        <td style={{padding:"8px"}}>{b.id}</td>
                        <td style={{padding:"8px"}}>{b.userId}</td>
                        <td style={{padding:"8px"}}>{b.seatsBooked}</td>
                        <td style={{padding:"8px",color:"#10b981",fontWeight:600}}>₹{b.totalAmount}</td>
                        <td style={{padding:"8px",color:"#9ca3af",fontSize:"0.8rem"}}>{new Date(b.bookingDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        </div>

        {/* Recent Events */}
        <div style={{backgroundColor:"#fff",borderRadius:"14px",padding:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
            <h4 style={{margin:0,color:"#111827",fontWeight:700}}>🎪 Recent Events</h4>
            <span onClick={()=>setActivePage("events")} style={{color:"#4f46e5",cursor:"pointer",fontSize:"0.85rem",fontWeight:600}}>View All →</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"12px"}}>
            {events.slice(0,4).map(e=>(
              <div key={e.eventId} style={{border:"1px solid #e5e7eb",borderRadius:"10px",padding:"14px",backgroundColor:"#fafafa"}}>
                <div style={{fontWeight:700,color:"#111827",marginBottom:"4px"}}>{e.title}</div>
                <div style={{fontSize:"0.82rem",color:"#6b7280"}}>📍 {e.venue}</div>
                <div style={{marginTop:"8px"}}>
                  <span style={{fontSize:"0.75rem",fontWeight:700,padding:"2px 10px",borderRadius:"20px",
                    backgroundColor:e.status==="APPROVED"?"#d1fae5":e.status==="DECLINED"?"#fee2e2":"#fef3c7",
                    color:e.status==="APPROVED"?"#065f46":e.status==="DECLINED"?"#991b1b":"#92400e"
                  }}>{e.status||"PENDING"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ================= RENDER CONTENT =================
  const renderContent = () => {
    if (activePage === "dashboard")  return renderDashboardHome();
    if (activePage === "users")      return renderUsersTable("USER");
    if (activePage === "organisers") return renderUsersTable("ORGANISER");

    if (activePage === "profile") {
      const initial = adminName ? adminName.charAt(0).toUpperCase() : "A";
      return (
        <div className={styles.fadeIn}>
          <div className={styles.profileCard}>
            <div style={{width:"70px",height:"70px",borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.25)",color:"#fff",fontSize:"2rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px",border:"3px solid rgba(255,255,255,0.5)"}}>
              {initial}
            </div>
            {!editMode ? (
              <div>
                {[{label:"Name",val:adminName||"—"},{label:"Email",val:adminEmail||"—"},{label:"Role",val:"ADMIN"}].map((r,i)=>(
                  <div key={i} style={{marginBottom:"12px"}}>
                    <div style={{fontSize:"0.8rem",opacity:0.75,marginBottom:"2px"}}>{r.label}</div>
                    <div style={{fontSize:"1rem",fontWeight:700}}>{r.val}</div>
                  </div>
                ))}
                <button onClick={openEdit} style={{padding:"10px 24px",backgroundColor:"#fff",color:"#4f46e5",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:700}}>✏️ Edit Profile</button>
              </div>
            ) : (
              <div>
                {[
                  {label:"Name",        val:editName,     setter:setEditName,     type:"text",     ph:"Enter name"},
                  {label:"Email",       val:editEmail,    setter:setEditEmail,    type:"email",    ph:"Enter email"},
                  {label:"New Password",val:editPassword, setter:setEditPassword, type:"password", ph:"Leave blank to keep current"},
                ].map((f,i)=>(
                  <div key={i} style={{marginBottom:"12px"}}>
                    <label style={{display:"block",fontSize:"0.8rem",opacity:0.85,marginBottom:"4px"}}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e=>f.setter(e.target.value)} placeholder={f.ph}
                      style={{width:"100%",padding:"9px 12px",borderRadius:"8px",border:"none",fontSize:"0.9rem",outline:"none",color:"#111827",boxSizing:"border-box"}}/>
                  </div>
                ))}
                <div style={{display:"flex",gap:"10px",marginTop:"16px"}}>
                  <button onClick={handleProfileSave} disabled={saving} style={{padding:"9px 22px",backgroundColor:"#fff",color:"#16a34a",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:700}}>{saving?"Saving...":"💾 Save"}</button>
                  <button onClick={()=>{setEditMode(false);setProfileMsg("");}} style={{padding:"9px 22px",backgroundColor:"rgba(255,255,255,0.2)",color:"#fff",border:"1px solid rgba(255,255,255,0.4)",borderRadius:"8px",cursor:"pointer",fontWeight:600}}>Cancel</button>
                </div>
                {profileMsg && <p style={{marginTop:"12px",fontWeight:600,color:"#fff",backgroundColor:"rgba(0,0,0,0.15)",padding:"8px 12px",borderRadius:"8px"}}>{profileMsg}</p>}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activePage === "events") {
      return (
        <div className={`${styles.userTable} ${styles.fadeIn}`}>
          <h3>🎪 Events</h3>
          <table>
            <thead><tr><th>Title</th><th>Venue</th><th>Date</th><th>Capacity</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {events.map(e=>(
                <tr key={e.eventId} className={styles.fadeRow}>
                  <td>{e.title}</td><td>{e.venue}</td>
                  <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                  <td>{e.capacity}</td><td>₹{e.price}</td>
                  <td>
                    {(e.status==="PENDING"||!e.status)&&<span style={{color:"#f59e0b",fontWeight:"bold"}}>Pending</span>}
                    {e.status==="APPROVED"&&<span style={{color:"#16a34a",fontWeight:"bold"}}>Approved</span>}
                    {e.status==="DECLINED"&&<span style={{color:"#dc2626",fontWeight:"bold"}}>Declined</span>}
                  </td>
                  <td>
                    {(e.status==="PENDING"||!e.status)&&<>
                      <button style={{background:"#16a34a",color:"#fff",marginRight:"6px",padding:"5px 12px",borderRadius:"6px",border:"none",cursor:"pointer"}} onClick={()=>approveEvent(e.eventId)}>✔ Approve</button>
                      <button style={{background:"#dc2626",color:"#fff",padding:"5px 12px",borderRadius:"6px",border:"none",cursor:"pointer"}} onClick={()=>declineEvent(e.eventId)}>✘ Decline</button>
                    </>}
                    {e.status==="APPROVED"&&<span style={{color:"#16a34a"}}>✔ Approved</span>}
                    {e.status==="DECLINED"&&<span style={{color:"#dc2626"}}>✖ Declined</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activePage === "bookings") {
      return (
        <div className={`${styles.userTable} ${styles.fadeIn}`}>
          <h3>🎟️ Bookings</h3>
          <table>
            <thead><tr><th>ID</th><th>User</th><th>Event</th><th>Seats</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {bookings.map(b=>(
                <tr key={b.id} className={styles.fadeRow}>
                  <td>{b.id}</td><td>{b.userId}</td>
                  <td style={{fontSize:"0.75rem",color:"#6b7280"}}>{b.eventId}</td>
                  <td>{b.seatsBooked}</td><td style={{color:"#10b981",fontWeight:600}}>₹{b.totalAmount}</td>
                  <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activePage === "reviews") {
      return (
        <div className={`${styles.userTable} ${styles.fadeIn}`}>
          <h3>⭐ Reviews</h3>
          <table>
            <thead><tr><th>ID</th><th>User</th><th>Event</th><th>Rating</th><th>Comment</th></tr></thead>
            <tbody>
              {reviews.map(r=>(
                <tr key={r.id} className={styles.fadeRow}>
                  <td>{r.id}</td><td>{r.userId}</td><td>{r.eventId}</td>
                  <td className={styles.ratingStar}>{"⭐".repeat(r.rating)}</td>
                  <td>{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const navItems = [
    {key:"dashboard",  label:"🏠 Dashboard"},
    {key:"users",      label:"👥 Users"},
    {key:"organisers", label:"🎯 Organizers"},
    {key:"events",     label:"🎪 Events"},
    {key:"bookings",   label:"🎟️ Bookings"},
    {key:"reviews",    label:"⭐ Reviews"},
    {key:"profile",    label:"👤 Profile"},
  ];

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>EventMate</h2>
        <ul>
          {navItems.map(item=>(
            <li key={item.key} onClick={()=>setActivePage(item.key)} style={{
              padding:"14px", margin:"6px 0", borderRadius:"8px", cursor:"pointer", transition:"all 0.2s ease",
              backgroundColor: activePage===item.key?"rgba(255,255,255,0.25)":"transparent",
              borderLeft: activePage===item.key?"4px solid #fff":"4px solid transparent",
              fontWeight: activePage===item.key?700:400,
              transform: activePage===item.key?"translateX(4px)":"none",
            }}>
              {item.label}
              {/* ✅ Badge on sidebar for inactive count */}
              {item.key==="users" && inactiveList.length>0 && activePage!=="users" && (
                <span style={{marginLeft:"8px",backgroundColor:"#ef4444",color:"#fff",borderRadius:"20px",padding:"1px 8px",fontSize:"0.7rem",fontWeight:700}}>
                  {inactiveList.length}
                </span>
              )}
            </li>
          ))}
          <li className={styles.logout} onClick={onLogout} style={{marginTop:"20px"}}>🚪 Logout</li>
        </ul>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <h2>Admin Dashboard</h2>
          <div className={styles.admin}>👤 {adminName||"Admin"}</div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>Users<br/><strong>{stats.users}</strong></div>
          <div className={styles.statCard}>Organizers<br/><strong>{stats.organisers}</strong></div>
          <div className={styles.statCard}>Events<br/><strong>{stats.events}</strong></div>
          <div className={styles.statCard}>Bookings<br/><strong>{stats.bookings}</strong></div>
        </div>
        <div className={styles.contentBox}>{renderContent()}</div>
      </main>
    </div>
  );
}

export default AdminDashboard;