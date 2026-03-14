import React, { useEffect, useState } from "react";

/* ─── Star Rating ────────────────────────────────────────────────── */
function StarRating({ rating }) {
  const r = Math.min(Math.max(Number(rating) || 0, 0), 5);
  return (
    <span style={{ color: "#f59e0b", fontSize: "15px", letterSpacing: "1px" }}>
      {"★".repeat(r)}{"☆".repeat(5 - r)}
    </span>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
function FeedbackDetails() {
  const [feedbacks, setFeedbacks]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterRating, setFilterRating]   = useState("all");

  useEffect(() => {
    const organizerId =
      JSON.parse(localStorage.getItem("user") || "{}")?.id;

    const url = organizerId
      ? `http://localhost:8080/api/organizer/feedback?organizerId=${organizerId}`
      : `http://localhost:8080/api/organizer/feedback`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch feedback");
        return res.json();
      })
      .then((data) => setFeedbacks(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = feedbacks.filter((fb) => {
    const matchesSearch =
      String(fb.bookingId || "").includes(searchTerm) ||
      String(fb.userId    || "").includes(searchTerm) ||
      String(fb.eventId   || "").includes(searchTerm) ||
      (fb.comment && fb.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRating =
      filterRating === "all" || String(fb.rating) === filterRating;
    return matchesSearch && matchesRating;
  });

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((s, fb) => s + (Number(fb.rating) || 0), 0) / feedbacks.length).toFixed(1)
      : "—";

  const positiveCount = feedbacks.filter((fb) => Number(fb.rating) >= 4).length;
  const lowCount      = feedbacks.filter((fb) => Number(fb.rating) <= 2).length;

  /* ── stat card generator ── */
  const statCard = (accent) => ({
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(14px)",
    borderRadius: "14px",
    padding: "18px 20px",
    borderLeft: `4px solid ${accent}`,
    boxShadow: "0 4px 14px rgba(124,58,237,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  });

  return (
    <div style={S.page}>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fb-row:hover  { background: #faf5ff !important; }
        .fb-input:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12) !important;
        }
      `}</style>

      {/* ── Header ── */}
      <div style={S.header}>
        <div>
          <h2 style={S.title}>⭐ Reviews & Feedback</h2>
          <p style={S.sub}>What attendees say about your events</p>
        </div>
        <span style={S.totalBadge}>{feedbacks.length} total</span>
      </div>

      {/* ── Stat cards ── */}
      <div style={S.statsRow}>
        <div style={statCard("#7c3aed")}>
          <span style={{ ...S.statNum, color: "#7c3aed" }}>{feedbacks.length}</span>
          <span style={S.statLabel}>Total Reviews</span>
        </div>
        <div style={statCard("#f59e0b")}>
          <span style={{ ...S.statNum, color: "#f59e0b" }}>⭐ {avgRating}</span>
          <span style={S.statLabel}>Average Rating</span>
        </div>
        <div style={statCard("#16a34a")}>
          <span style={{ ...S.statNum, color: "#16a34a" }}>{positiveCount}</span>
          <span style={S.statLabel}>Positive (4–5 ★)</span>
        </div>
        <div style={statCard("#dc2626")}>
          <span style={{ ...S.statNum, color: "#dc2626" }}>{lowCount}</span>
          <span style={S.statLabel}>Needs Attention (1–2 ★)</span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={S.filterRow}>
        <input
          className="fb-input"
          style={S.searchInput}
          placeholder="🔍  Search by Booking ID, User, Event or Comment…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="fb-input"
          style={S.select}
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">★★★★★  5 Stars</option>
          <option value="4">★★★★☆  4 Stars</option>
          <option value="3">★★★☆☆  3 Stars</option>
          <option value="2">★★☆☆☆  2 Stars</option>
          <option value="1">★☆☆☆☆  1 Star</option>
        </select>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={S.center}>
          <div style={S.spinner} />
          <p style={{ color: "#7c3aed", fontWeight: 600, marginTop: "12px" }}>
            Loading feedback…
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={S.errorBox}>⚠️ {error}</div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && filtered.length === 0 && (
        <div style={S.center}>
          <span style={{ fontSize: "52px" }}>💬</span>
          <p style={{ color: "#9ca3af", fontWeight: 600, fontSize: "15px", margin: 0 }}>
            No feedback found for your events.
          </p>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && !error && filtered.length > 0 && (
        <div style={S.card}>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                  {["#","Booking ID","User ID","Event ID","Rating","Comment","Date"].map((h, i, arr) => (
                    <th key={i} style={{
                      ...S.th,
                      borderRadius:
                        i === 0             ? "10px 0 0 10px"
                        : i === arr.length - 1 ? "0 10px 10px 0"
                        : undefined,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((fb, i) => (
                  <tr
                    key={fb.id || i}
                    className="fb-row"
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #f0eeff" : "none",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* # */}
                    <td style={{ ...S.td, color: "#9ca3af", fontSize: "12px", fontWeight: 600 }}>
                      {i + 1}
                    </td>

                    {/* Booking ID */}
                    <td style={{ ...S.td, fontWeight: 700, color: "#111827" }}>
                      {fb.bookingId}
                    </td>

                    {/* User ID */}
                    <td style={S.td}>{fb.userId}</td>

                    {/* Event ID */}
                    <td style={{ ...S.td, fontSize: "11px", color: "#6b7280",
                                 wordBreak: "break-all", maxWidth: "140px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        background: "#ede9fe",
                        color: "#7c3aed",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}>
                        {fb.eventId}
                      </span>
                    </td>

                    {/* Rating */}
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <StarRating rating={fb.rating} />
                        <span style={{ color: "#374151", fontWeight: 700, fontSize: "12px" }}>
                          ({fb.rating})
                        </span>
                      </div>
                    </td>

                    {/* Comment */}
                    <td style={{ ...S.td, maxWidth: "220px", color: "#4b5563", lineHeight: 1.5 }}>
                      {fb.comment || (
                        <span style={{ color: "#d1d5db", fontStyle: "italic" }}>No comment</span>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ ...S.td, whiteSpace: "nowrap", color: "#6b7280", fontSize: "12px" }}>
                      {fb.createdAt
                        ? new Date(fb.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const S = {
  page: {
    padding: "4px 4px 32px",
    fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    animation: "fadeUp 0.4s ease both",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#111827",
    margin: "0 0 2px",
  },
  sub: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
    fontWeight: 500,
  },
  totalBadge: {
    padding: "6px 18px",
    borderRadius: "999px",
    background: "linear-gradient(135deg,#7c3aed,#6366f1)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "14px",
  },
  statNum: {
    fontSize: "24px",
    fontWeight: 800,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    letterSpacing: "0.3px",
  },
  filterRow: {
    display: "flex",
    gap: "12px",
  },
  searchInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    background: "rgba(255,255,255,0.8)",
    color: "#111827",
    fontFamily: "inherit",
    fontSize: "13px",
    outline: "none",
    transition: "all 0.25s ease",
  },
  select: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    background: "rgba(255,255,255,0.8)",
    color: "#374151",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: 600,
    outline: "none",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  card: {
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(16px)",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 6px 24px rgba(124,58,237,0.08), 0 0 0 1px rgba(124,58,237,0.07)",
    overflow: "hidden",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    fontFamily: "inherit",
  },
  th: {
    padding: "13px 16px",
    color: "#fff",
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "0.5px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 16px",
    color: "#374151",
    fontWeight: 500,
    verticalAlign: "top",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "56px 20px",
    color: "#9ca3af",
    fontWeight: 600,
    fontSize: "14px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #ede9fe",
    borderTop: "3px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorBox: {
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "16px 20px",
    fontSize: "13px",
    fontWeight: 600,
  },
};

export default FeedbackDetails;