import React, { useEffect, useState } from "react";

function StarRating({ rating }) {
  const r = Math.min(Math.max(Number(rating) || 0, 0), 5);
  return (
    <span style={{ color: "#f59e0b", fontSize: "1rem" }}>
      {"★".repeat(r)}{"☆".repeat(5 - r)}
    </span>
  );
}

function FeedbackDetails({ goBack, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    // ✅ Only fetch feedback for this organizer's events
    const organizerId = user?.id;
    const url = organizerId
      ? `http://localhost:8080/api/organizer/feedback?organizerId=${organizerId}`
      : `http://localhost:8080/api/organizer/feedback`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch feedback");
        return res.json();
      })
      .then((data) => {
        setFeedbacks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  const filtered = feedbacks.filter((fb) => {
    const matchesSearch =
      String(fb.bookingId || "").includes(searchTerm) ||
      String(fb.userId || "").includes(searchTerm) ||
      String(fb.eventId || "").includes(searchTerm) ||
      (fb.comment && fb.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRating =
      filterRating === "all" || String(fb.rating) === filterRating;
    return matchesSearch && matchesRating;
  });

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, fb) => sum + (Number(fb.rating) || 0), 0) /
          feedbacks.length
        ).toFixed(1)
      : "—";

  return (
    <div style={styles.page}>

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={goBack} style={styles.backBtn}>← Back</button>
        <h2 style={styles.title}>📋 My Event Feedback</h2>
        <span style={styles.badge}>{feedbacks.length} Total</span>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{feedbacks.length}</div>
          <div style={styles.summaryLabel}>Total Feedbacks</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryValue, color: "#f59e0b" }}>⭐ {avgRating}</div>
          <div style={styles.summaryLabel}>Average Rating</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryValue, color: "#10b981" }}>
            {feedbacks.filter((fb) => Number(fb.rating) >= 4).length}
          </div>
          <div style={styles.summaryLabel}>Positive (4–5★)</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryValue, color: "#ef4444" }}>
            {feedbacks.filter((fb) => Number(fb.rating) <= 2).length}
          </div>
          <div style={styles.summaryLabel}>Needs Attention (1–2★)</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search by Booking ID, User ID, Event ID, or Comment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={styles.select}
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
          <option value="2">⭐⭐ 2 Stars</option>
          <option value="1">⭐ 1 Star</option>
        </select>
      </div>

      {loading && (
        <div style={styles.center}>
          <div style={styles.spinner} />
          <p style={{ color: "#6b7280", marginTop: "12px" }}>Loading feedback...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}. Make sure the backend is running at <strong>localhost:8080</strong>.
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.center}>
          <p style={{ color: "#9ca3af", fontSize: "1.1rem" }}>No feedback found for your events.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Booking ID</th>
                <th style={styles.th}>User ID</th>
                <th style={styles.th}>Event ID</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Comment</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fb, index) => (
                <tr
                  key={fb.id || index}
                  style={{
                    ...styles.tr,
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                  }}
                >
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{fb.bookingId}</td>
                  <td style={styles.td}>{fb.userId}</td>
                  <td style={{ ...styles.td, fontSize: "0.78rem", color: "#6b7280", wordBreak: "break-all", maxWidth: "160px" }}>
                    {fb.eventId}
                  </td>
                  <td style={styles.td}>
                    <StarRating rating={fb.rating} />
                    <span style={{ marginLeft: "6px", color: "#374151", fontWeight: 600 }}>
                      ({fb.rating})
                    </span>
                  </td>
                  <td style={{ ...styles.td, maxWidth: "220px", color: "#4b5563" }}>
                    {fb.comment || <span style={{ color: "#d1d5db" }}>No comment</span>}
                  </td>
                  <td style={{ ...styles.td, whiteSpace: "nowrap", color: "#6b7280", fontSize: "0.85rem" }}>
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
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "28px 32px", fontFamily: "'Segoe UI', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  backBtn: { padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500, color: "#374151" },
  title: { margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#111827", flex: 1 },
  badge: { backgroundColor: "#6366f1", color: "#fff", borderRadius: "20px", padding: "4px 14px", fontSize: "0.85rem", fontWeight: 600 },
  summaryRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  summaryCard: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  summaryValue: { fontSize: "1.8rem", fontWeight: 700, color: "#1f2937" },
  summaryLabel: { fontSize: "0.8rem", color: "#6b7280", marginTop: "4px" },
  filterRow: { display: "flex", gap: "12px", marginBottom: "20px" },
  searchInput: { flex: 1, padding: "10px 16px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.9rem", outline: "none", backgroundColor: "#fff" },
  select: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.9rem", backgroundColor: "#fff", cursor: "pointer" },
  tableWrapper: { backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" },
  thead: { backgroundColor: "#6366f1", color: "#ffffff" },
  th: { padding: "14px 16px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "13px 16px", color: "#1f2937", verticalAlign: "top" },
  center: { textAlign: "center", padding: "60px 0" },
  errorBox: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: "10px", padding: "16px 20px", fontSize: "0.9rem" },
  spinner: { width: "36px", height: "36px", border: "4px solid #e5e7eb", borderTop: "4px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" },
};

export default FeedbackDetails;