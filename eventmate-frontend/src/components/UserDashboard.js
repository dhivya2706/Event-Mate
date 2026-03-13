import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import ChatBot from "./ChatBot";
import Booking from "./Booking";

// ── helpers ──────────────────────────────────────────────────────────────────
const CAT_COLORS = {
  Concert: "#a855f7", Music: "#a855f7",
  Sports: "#22c55e", Sport: "#22c55e",
  Comedy: "#f59e0b",
  Workshop: "#06b6d4",
  Corporate: "#6366f1",
  Fashion: "#ec4899",
  Birthday: "#f97316",
  Marriage: "#c9a84c",
};

const getCategory = (name = "") => {
  for (const key of Object.keys(CAT_COLORS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return key;
  }
  return null;
};

const lowestPrice = (e) => {
  const prices = [e.vipPrice, e.premiumPrice, e.regularPrice].filter(v => v && v > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
};

const totalSeats = (e) =>
  (e.vipSeats || 0) + (e.premiumSeats || 0) + (e.regularSeats || 0);

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short", year: "numeric" });
};

const formatDateShort = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// ── StarRating display ────────────────────────────────────────────────────────
function Stars({ rating = 4.5, count }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star-icon ${i <= full ? "full" : i === full + 1 && half ? "half" : "empty"}`}>★</span>
      ))}
      {count !== undefined && <span className="star-count">({count} reviews)</span>}
    </span>
  );
}

// ── EventCard — EventHub style ────────────────────────────────────────────────
function EventCard({ event, onClick }) {
  const cat = getCategory(event.eventName);
  const color = cat ? CAT_COLORS[cat] : "#7a8a9e";
  const imgSrc = `http://localhost:8080/uploads/${event.imageName}`;
  const seats = totalSeats(event);
  const price = lowestPrice(event);
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="ec-card" onClick={() => onClick(event)}>
      {/* Image area */}
      <div className="ec-img-wrap">
        {imgOk
          ? <img src={imgSrc} alt={event.eventName} className="ec-img" onError={() => setImgOk(false)} />
          : <div className="ec-img-fallback" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}>
              <span style={{ color, fontSize: 36, opacity: 0.5 }}>◈</span>
            </div>
        }
        {/* Category badge bottom-left */}
        {cat && (
          <span className="ec-cat-badge">{cat}</span>
        )}
      </div>

      {/* Info area — white-card style */}
      <div className="ec-info">
        <h3 className="ec-title">{event.eventName}</h3>
        <div className="ec-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>{formatDateShort(event.eventDate)}</span>
        </div>
        <div className="ec-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{event.venue}</span>
        </div>
        <div className="ec-bottom">
          {seats > 0 ? (
            <div className="ec-seats-left">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <span>{seats} left</span>
            </div>
          ) : <div />}
          {price !== null ? <span className="ec-price">₹{price}</span> : null}
        </div>
      </div>
    </div>
  );
}

// ── EventDetailModal — EventHub detail page style ─────────────────────────────
function EventDetailModal({ event, onClose, onBook }) {
  const [imgOk, setImgOk] = useState(true);
  const [bookedCount, setBookedCount] = useState(0);

  useEffect(() => {
    if (!event) return;
    setBookedCount(0);
    fetch(`http://localhost:8080/api/bookings/event/${event.id}`)
      .then(r => r.json())
      .then(data => {
        const paid = Array.isArray(data)
          ? data.filter(b => b.paymentStatus === "PAID")
              .reduce((sum, b) => sum + (b.seatNumbers ? b.seatNumbers.split(",").length : 0), 0)
          : 0;
        setBookedCount(paid);
      })
      .catch(() => setBookedCount(0));
  }, [event]);

  if (!event) return null;

  const cat = getCategory(event.eventName);
  const color = cat ? CAT_COLORS[cat] : "#c9a84c";
  const imgSrc = `http://localhost:8080/uploads/${event.imageName}`;
  const totalAvail = totalSeats(event);
  const price = lowestPrice(event);
  const grandTotal = totalAvail + bookedCount;
  const pct = grandTotal > 0 ? Math.round((bookedCount / grandTotal) * 100) : 0;

  return (
    <div className="edm-overlay" onClick={onClose}>
      <div className="edm-page" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="edm-close-btn" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* LEFT — event info */}
        <div className="edm-left">
          {/* Hero image */}
          <div className="edm-hero">
            {imgOk
              ? <img src={imgSrc} alt={event.eventName} className="edm-hero-img" onError={() => setImgOk(false)} />
              : <div className="edm-hero-fallback" style={{ background: `linear-gradient(135deg, ${color}44, ${color}11)` }} />
            }
            {cat && <span className="edm-cat-badge">{cat}</span>}
          </div>

          {/* Event title */}
          <div className="edm-content">
            <h1 className="edm-title">{event.eventName}</h1>
            <p className="edm-organizer">Managed by EventMate AI</p>

            {/* Info boxes — 2×2 grid */}
            <div className="edm-info-grid">
              <div className="edm-info-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div>
                  <div className="edm-info-val">{formatDate(event.eventDate)}</div>
                  <div className="edm-info-label">Date</div>
                </div>
              </div>
              <div className="edm-info-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <div className="edm-info-val">18:00</div>
                  <div className="edm-info-label">Time</div>
                </div>
              </div>
              <div className="edm-info-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <div className="edm-info-val">{event.venue}</div>
                  <div className="edm-info-label">Venue</div>
                </div>
              </div>
              <div className="edm-info-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <div>
                  <div className="edm-info-val">{totalAvail} spots left</div>
                  <div className="edm-info-label">{pct}% booked</div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="edm-about">
              <h3 className="edm-about-title">About this event</h3>
              <p className="edm-about-text">
                Join us for an incredible experience at <strong>{event.eventName}</strong> — a spectacular gathering
                that promises energy, excitement and unforgettable memories.
                Whether you're coming alone or with friends, this is one event you don't want to miss.
              </p>
            </div>

            {/* Seat tiers */}
            <div className="edm-about">
              <h3 className="edm-about-title">Available Tiers</h3>
              <div className="edm-tier-grid">
                {event.vipSeats > 0 && (
                  <div className="edm-tier-box" style={{ borderColor: "#c9a84c44" }}>
                    <span className="edm-tier-label" style={{ color: "#c9a84c" }}>VIP</span>
                    <span className="edm-tier-seats">{event.vipSeats} seats</span>
                    <span className="edm-tier-p">₹{event.vipPrice}</span>
                  </div>
                )}
                {event.premiumSeats > 0 && (
                  <div className="edm-tier-box" style={{ borderColor: "#6366f144" }}>
                    <span className="edm-tier-label" style={{ color: "#6366f1" }}>Premium</span>
                    <span className="edm-tier-seats">{event.premiumSeats} seats</span>
                    <span className="edm-tier-p">₹{event.premiumPrice}</span>
                  </div>
                )}
                {event.regularSeats > 0 && (
                  <div className="edm-tier-box" style={{ borderColor: "#22c55e44" }}>
                    <span className="edm-tier-label" style={{ color: "#22c55e" }}>Regular</span>
                    <span className="edm-tier-seats">{event.regularSeats} seats</span>
                    <span className="edm-tier-p">₹{event.regularPrice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — booking panel */}
        <div className="edm-right">
          <div className="edm-booking-card">
            <div className="edm-price-row">
              {price !== null
                ? <><span className="edm-big-price">₹{price}</span><span className="edm-per-ticket">per ticket</span></>
                : <span className="edm-big-price" style={{fontSize:22}}>Select seats to view pricing</span>
              }
            </div>

            <Stars rating={4.5} count={Math.max(8, bookedCount)} />

            <div className="edm-progress-section">
              <div className="edm-progress-label">
                <span>{bookedCount} booked</span>
                <span>{grandTotal} total</span>
              </div>
              <div className="edm-progress-bar">
                <div className="edm-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <button className="edm-book-btn" onClick={() => { onBook(event); onClose(); }}>
              Book Now
            </button>

            <button className="edm-share-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share Event
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedEmail = localStorage.getItem("email");
  const storedUsername = localStorage.getItem("username");

  const [username, setUsername] = useState(
    location.state?.username || storedUsername || (storedEmail ? storedEmail.split("@")[0] : "User")
  );
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [events, setEvents] = useState([]);
  const [feedbackEvents, setFeedbackEvents] = useState([]);
  const [selectedFeedbackEvent, setSelectedFeedbackEvent] = useState(null);
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");
  const [showChatBot, setShowChatBot] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!storedEmail) navigate("/", { replace: true });
  }, [navigate, storedEmail]);

  useEffect(() => {
    fetch("http://localhost:8080/api/events/all")
      .then(r => r.json()).then(setEvents).catch(console.error);
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const iv = setInterval(() => setCurrentIndex(p => p === events.length - 1 ? 0 : p + 1), 3500);
    return () => clearInterval(iv);
  }, [events]);

  useEffect(() => {
    if (!storedEmail) return;
    fetch(`http://localhost:8080/api/user/profile?email=${storedEmail}`)
      .then(r => r.json()).then(data => {
        setUser(data);
        if (data.name) { setUsername(data.name); localStorage.setItem("username", data.name); }
      }).catch(console.error);
  }, [storedEmail]);

  useEffect(() => {
    if (!storedEmail || activePage !== "feedback") return;
    fetch(`http://localhost:8080/api/bookings/completed?email=${storedEmail}`)
      .then(r => r.json()).then(data => setFeedbackEvents(Array.isArray(data) ? data : data.data || []))
      .catch(() => setFeedbackEvents([]));
  }, [storedEmail, activePage]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/user/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user)
      });
      const data = await res.json();
      setUser(data); setUsername(data.name);
      localStorage.setItem("username", data.name);
      alert("Profile updated!"); setShowProfile(false);
    } catch { alert("Update failed"); }
  };

  const goToBooking = (event) => { setSelectedEventData(event); setActivePage("bookings"); };

  const submitFeedback = async () => {
    if (!selectedFeedbackEvent) return;
    try {
      const res = await fetch("http://localhost:8080/api/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: selectedFeedbackEvent.event?.id, userEmail: storedEmail, rating: Number(rating), description })
      });
      if (!res.ok) throw new Error();
      alert("Feedback submitted!");
      setSelectedFeedbackEvent(null); setDescription(""); setRating(5);
      setFeedbackEvents(prev => prev.filter(e => e.id !== selectedFeedbackEvent.id));
    } catch { alert("Failed to submit feedback"); }
  };

  const displayedEvents = selectedDate ? events.filter(e => e.eventDate === selectedDate) : events;
  const searched = searchQuery
    ? displayedEvents.filter(e =>
        e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
    : displayedEvents;

  return (
    <div className="user-dashboard">
      <div className="app-shell">

        {/* ── Header ── */}
        <header className="app-header">
          <div className="brand">EVENTMATE <span>AI</span></div>
          <div className="header-right">
            <button className="profile-pill" onClick={() => setShowProfile(true)}>{username}</button>
          </div>
        </header>

        <div className="app-main">

          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <h3>Menu</h3>
            {[["home","🏠","Home"],["events","📅","Browse Events"],["bookings","🎫","My Bookings"],["feedback","⭐","Feedback"]].map(([pg,ic,lb]) => (
              <button key={pg} className={`nav-btn ${activePage === pg ? "active" : ""}`} onClick={() => setActivePage(pg)}>{ic} {lb}</button>
            ))}
            <button className="nav-btn" onClick={() => setShowChatBot(p => !p)}>🤖 AI Assistant</button>
            <button className="nav-btn logout-side" onClick={() => { localStorage.clear(); navigate("/", { replace: true }); }}>🚪 Logout</button>
          </aside>

          {/* ── Content ── */}
          <section className="main-content">

            {/* HOME */}
            {activePage === "home" && (
              <div className="content-card">
                <h2>Welcome to EventMate AI</h2>

                {events.length > 0 && (
                  <div className="slider-container">
                    <img
                      src={`http://localhost:8080/uploads/${events[currentIndex].imageName}`}
                      alt={events[currentIndex].eventName}
                      className="slider-image"
                      onError={e => { e.target.style.display = "none"; }}
                    />
                    <div className="slider-overlay">
                      <h1>{events[currentIndex].eventName}</h1>
                      <p>{events[currentIndex].venue}</p>
                      <p>VIP: {events[currentIndex].vipSeats} | ₹{events[currentIndex].vipPrice}</p>
                      <p>Premium: {events[currentIndex].premiumSeats} | ₹{events[currentIndex].premiumPrice}</p>
                      <p>Regular: {events[currentIndex].regularSeats} | ₹{events[currentIndex].regularPrice}</p>
                      <button className="live-btn" onClick={() => setDetailEvent(events[currentIndex])}>View Details</button>
                    </div>
                    <div className="slider-dots">
                      {events.map((_,i) => (
                        <span key={i} className={`slider-dot ${i === currentIndex ? "active" : ""}`} onClick={() => setCurrentIndex(i)} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="section-header">
                  <h3 className="section-subheading">Upcoming Events</h3>
                </div>
                <div className="events-grid">
                  {events.slice(0,6).map(ev => <EventCard key={ev.id} event={ev} onClick={setDetailEvent} />)}
                </div>
              </div>
            )}

            {/* BROWSE */}
            {activePage === "events" && (
              <div className="content-card">
                <div className="browse-header">
                  <h2>Discover Events</h2>
                  <p className="browse-sub">Find events that match your interests</p>
                </div>

                <div className="browse-filters">
                  <div className="search-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <input type="text" placeholder="Search events, venues..." value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)} className="search-input" />
                  </div>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="date-input" />
                </div>

                <p className="results-count">{searched.length} event{searched.length !== 1 ? "s" : ""} found</p>

                <div className="events-grid">
                  {searched.length === 0
                    ? <p className="no-events">No events found.</p>
                    : searched.map(ev => <EventCard key={ev.id} event={ev} onClick={setDetailEvent} />)
                  }
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activePage === "bookings" && (
              selectedEventData
                ? <Booking selectedEventData={selectedEventData} />
                : <div className="content-card empty-state">
                    <div className="empty-icon">🎫</div>
                    <h3>No Event Selected</h3>
                    <p>Browse events and click "Book Now" to make a booking.</p>
                    <button className="live-btn" style={{ marginTop: 20 }} onClick={() => setActivePage("events")}>Browse Events</button>
                  </div>
            )}

            {/* FEEDBACK */}
            {activePage === "feedback" && (
              <div className="content-card">
                <div className="fb-header">
                  <div>
                    <h2>Share Your Experience</h2>
                    <p className="fb-sub">Your feedback helps improve future events</p>
                  </div>
                  <div className="fb-badge">
                    <span>⭐</span>
                    <span>{feedbackEvents.length} pending</span>
                  </div>
                </div>

                {!feedbackEvents.length
                  ? (
                    <div className="empty-state">
                      <div className="fb-empty-icon">🎉</div>
                      <h3>All caught up!</h3>
                      <p>You've reviewed all your attended events. Thank you for your feedback!</p>
                    </div>
                  )
                  : (
                    <div className="fb-grid">
                      {feedbackEvents.map(ev => (
                        <div key={ev.id} className="fb-card">
                          {/* image strip */}
                          <div className="fb-img-strip">
                            <img
                              src={`http://localhost:8080/uploads/${ev.event?.imageName}`}
                              alt={ev.event?.eventName}
                              className="fb-img"
                              onError={e => { e.target.style.display = "none"; }}
                            />
                            <div className="fb-img-overlay" />
                            <span className="fb-completed-tag">✓ Attended</span>
                          </div>
                          {/* card body */}
                          <div className="fb-card-body">
                            <h3 className="fb-event-name">{ev.event?.eventName}</h3>
                            <div className="fb-event-meta">
                              {ev.event?.venue && (
                                <span className="fb-meta-item">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                  {ev.event.venue}
                                </span>
                              )}
                              {ev.event?.eventDate && (
                                <span className="fb-meta-item">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                  {formatDateShort(ev.event.eventDate)}
                                </span>
                              )}
                            </div>
                            <p className="fb-prompt">How was your experience?</p>
                            <button className="fb-review-btn" onClick={() => setSelectedFeedbackEvent(ev)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                              Write a Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}

          </section>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>User Profile</h3>
              <form onSubmit={handleUpdate}>
                <input className="profile-input" type="text" value={user.name||""} onChange={e => setUser({...user,name:e.target.value})} placeholder="Name" required />
                <input className="profile-input" type="email" value={user.email||""} readOnly />
                <input className="profile-input" type="text" value={user.phone||""} onChange={e => setUser({...user,phone:e.target.value})} placeholder="Phone" required />
                <div className="modal-buttons">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowProfile(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {selectedFeedbackEvent && (
          <div className="modal-overlay">
            <div className="modal fb-modal">
              <div className="fb-modal-icon">⭐</div>
              <h3>{selectedFeedbackEvent.event?.eventName}</h3>
              <p className="fb-modal-sub">Tell us what you thought about this event</p>

              <div className="fb-star-section">
                <p className="fb-star-label">Rate your experience</p>
                <div className="star-row">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`star ${s <= rating ? "active" : ""}`} onClick={() => setRating(s)}>★</span>
                  ))}
                </div>
                <p className="fb-rating-text">{["","Poor","Fair","Good","Great","Excellent!"][rating]}</p>
              </div>

              <textarea className="feedback-textarea" placeholder="Share your experience — what did you love? What could be better?" value={description} onChange={e => setDescription(e.target.value)} />

              <div className="modal-buttons">
                <button className="save-btn" onClick={submitFeedback}>Submit Review</button>
                <button className="cancel-btn" onClick={() => setSelectedFeedbackEvent(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Event Detail */}
        <EventDetailModal event={detailEvent} onClose={() => setDetailEvent(null)} onBook={goToBooking} />

        {showChatBot && <ChatBot />}
      </div>
    </div>
  );
}

export default UserDashboard;
