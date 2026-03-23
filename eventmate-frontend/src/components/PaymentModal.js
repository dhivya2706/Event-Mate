import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";

/* ─── QR via free public API (no npm install needed) ─────────── */
const makeQRUrl = (text) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=160x160&bgcolor=0f1624&color=c9a84c&qzone=1&data=${encodeURIComponent(text)}`;

const buildQRData = (t) =>
  `EVENTMATE|ID:${t.id}|${t.eventName}|${t.userName}|SEATS:${t.seatsBooked}x${t.seatCategory}|NOS:${t.seatNumbers||"N/A"}|INR${t.totalAmount}|${t.paymentStatus}`;

const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { weekday:"long", day:"2-digit", month:"long", year:"numeric" }); }
  catch { return String(d); }
};

/* ══════════════════════════════════════════════════════════════ */
const PaymentModal = ({ bookingData, onClose }) => {
  const hasOpened = useRef(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticket,     setTicket]     = useState(null);

  useEffect(() => {
    if (bookingData && !hasOpened.current) {
      hasOpened.current = true;
      handlePayment();
    }
  }, [bookingData]);

  /* ── Load Razorpay checkout script ── */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload  = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ── Main payment flow — exact same as reference working code ── */
  const handlePayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { alert("Razorpay SDK failed to load."); return; }

      const res = await fetch("http://localhost:8080/api/payment/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ bookingId: bookingData.bookingId }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();

      const options = {
        key:         data.key,
        amount:      data.amount,
        currency:    "INR",
        name:        "EventMate AI",
        description: "Event Booking Payment",
        order_id:    data.orderId,
        handler: async function (response) {
          try {
            const confirmRes = await fetch("http://localhost:8080/api/payment/confirm", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId:   response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            if (!confirmRes.ok) throw new Error("Payment confirmation failed");

            /* Fetch ticket data and show beautiful ticket */
            const ticketRes  = await fetch(`http://localhost:8080/api/bookings/${bookingData.bookingId}`);
            const ticketData = await ticketRes.json();
            setTicket(ticketData);
            setShowTicket(true);
          } catch (error) {
            console.error("Confirm error:", error);
            alert("Payment verification failed!");
          }
        },
        modal: { ondismiss: function () { alert("Payment cancelled."); onClose(); } },
        theme: { color: "#c9a84c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () { alert("Payment Failed"); onClose(); });
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong! Please check your backend is running and Razorpay keys are valid in application.properties.");
      onClose();
    }
  };

  /* ── Download ticket as PDF ── */
  const downloadTicket = async () => {
    const qrImg = document.getElementById("ticketQR");
    if (qrImg && !qrImg.complete) {
      await new Promise(r => { qrImg.onload = r; qrImg.onerror = r; });
    }
    html2pdf().set({
      margin:      0,
      filename:    `EventMate_Ticket_${ticket.id}.pdf`,
      image:       { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, allowTaint: true, backgroundColor: "#0f1624" },
      jsPDF:       { unit: "px", format: [520, 720], orientation: "portrait" },
    }).from(document.getElementById("ticketCard")).save();
  };

  /* ══ TICKET UI ═══════════════════════════════════════════════ */
  if (showTicket && ticket) {
    const qrUrl = makeQRUrl(buildQRData(ticket));
    const cat   = String(ticket.seatCategory || "").toUpperCase();
    const catStyle =
      cat === "VIP"     ? { bg:"rgba(201,168,76,.15)", text:"#e8c97a", border:"rgba(201,168,76,.3)"  } :
      cat === "PREMIUM" ? { bg:"rgba(99,102,241,.15)",  text:"#a5b4fc", border:"rgba(99,102,241,.3)" } :
                          { bg:"rgba(34,197,94,.12)",   text:"#86efac", border:"rgba(34,197,94,.25)" };

    return (
      <div style={S.overlay}>
        <div style={S.scrollWrap}>

          {/* ── TICKET CARD (captured for PDF) ── */}
          <div id="ticketCard" style={S.ticket}>

            {/* Gold top bar */}
            <div style={S.topBar} />

            {/* Header row */}
            <div style={S.header}>
              <div>
                <div style={S.brand}>EVENTMATE</div>
                <div style={S.brandSub}>AI EVENT PLATFORM</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={S.smallLabel}>BOOKING ID</div>
                <div style={S.bookingId}>#{String(ticket.id).padStart(6,"0")}</div>
              </div>
            </div>

            {/* Event name + category badge */}
            <div style={S.eventBanner}>
              <div style={S.eventName}>{ticket.eventName}</div>
              <span style={{ ...S.catBadge, background:catStyle.bg, color:catStyle.text, border:`1px solid ${catStyle.border}` }}>
                {ticket.seatCategory}
              </span>
            </div>

            {/* Dashed divider */}
            <div style={S.dashedLine} />

            {/* Body: info + QR */}
            <div style={S.body}>

              {/* Left column */}
              <div style={S.infoCol}>
                {[
                  ["ATTENDEE",     ticket.userName],
                  ["VENUE",        ticket.venue],
                  ["DATE",         fmtDate(ticket.bookingDate)],
                  ["SEATS BOOKED", String(ticket.seatsBooked)],
                  ["SEAT NUMBERS", ticket.seatNumbers || "N/A"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    <div style={S.infoLabel}>{label}</div>
                    <div style={S.infoVal}>{val || "—"}</div>
                  </div>
                ))}
                {/* Amount */}
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  <div style={S.infoLabel}>AMOUNT PAID</div>
                  <div style={{ ...S.infoVal, color:"#c9a84c", fontSize:22, fontFamily:"'Playfair Display',serif", fontWeight:700 }}>
                    ₹{ticket.totalAmount}
                  </div>
                </div>
              </div>

              {/* Right: QR code */}
              <div style={S.qrCol}>
                <div style={S.qrBox}>
                  <img
                    id="ticketQR"
                    src={qrUrl}
                    alt="QR"
                    crossOrigin="anonymous"
                    width={140} height={140}
                    style={{ display:"block", borderRadius:4 }}
                  />
                </div>
                <div style={S.qrHint}>Scan to verify</div>
                <div style={{
                  padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700,
                  letterSpacing:1, textTransform:"uppercase", border:"1px solid", textAlign:"center",
                  background:  ticket.paymentStatus==="PAID" ? "rgba(34,197,94,.15)"  : "rgba(245,158,11,.12)",
                  color:       ticket.paymentStatus==="PAID" ? "#4ade80"              : "#fbbf24",
                  borderColor: ticket.paymentStatus==="PAID" ? "rgba(34,197,94,.3)"  : "rgba(245,158,11,.25)",
                }}>
                  {ticket.paymentStatus === "PAID" ? "✓ PAID" : ticket.paymentStatus}
                </div>
              </div>
            </div>

            {/* Bottom divider + footer */}
            <div style={S.dashedLine} />
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 28px 18px" }}>
              <span style={S.footerText}>Valid for one-time entry only</span>
              <span style={S.footerText}>EventMate AI · Powered by Technology</span>
            </div>
          </div>

          {/* Buttons (outside ticket — won't appear in PDF) */}
          <div style={S.btnRow}>
            <button onClick={downloadTicket} style={S.dlBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink:0 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
            <button onClick={onClose} style={S.closeBtn}>Close</button>
          </div>

        </div>
      </div>
    );
  }

  /* ══ LOADING SCREEN ══════════════════════════════════════════ */
  return (
    <div style={S.overlay}>
      <div style={S.loadingBox}>
        <div style={S.spinner} />
        <h3 style={{ color:"#f0ece0", fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:8 }}>
          Redirecting to Payment Gateway
        </h3>
        <p style={{ color:"#7a8a9e", fontSize:13 }}>Please do not refresh this page.</p>
      </div>
    </div>
  );
};

/* ═══ STYLES ════════════════════════════════════════════════════ */
const S = {
  overlay: {
    position:"fixed", inset:0,
    background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:9999, fontFamily:"'DM Sans',sans-serif", padding:20,
  },
  scrollWrap: {
    display:"flex", flexDirection:"column", alignItems:"center",
    gap:16, maxHeight:"90vh", overflowY:"auto", overflowX:"hidden",
  },
  ticket: {
    background:"#0f1624",
    border:"1px solid rgba(201,168,76,0.2)",
    borderRadius:12,
    width:520,
    boxShadow:"0 50px 100px rgba(0,0,0,0.7)",
    overflow:"hidden",
    color:"#f0ece0",
  },
  topBar:   { height:4, background:"linear-gradient(90deg,#c9a84c,#e8c97a,#c9a84c)" },
  header:   { display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"22px 28px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)" },
  brand:    { fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:"#c9a84c", letterSpacing:4 },
  brandSub: { fontSize:9, color:"#3a4a60", letterSpacing:3, marginTop:3, textTransform:"uppercase" },
  smallLabel:{ fontSize:9, fontWeight:700, color:"#3a4a60", letterSpacing:2, textTransform:"uppercase", marginBottom:3 },
  bookingId: { fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#c9a84c" },
  eventBanner:{ padding:"18px 28px", background:"linear-gradient(135deg,rgba(201,168,76,0.07) 0%,transparent 100%)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 },
  eventName:  { fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:"#f0ece0", lineHeight:1.2, flex:1 },
  catBadge:   { padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", whiteSpace:"nowrap", flexShrink:0 },
  dashedLine: { margin:"0 28px", borderTop:"1px dashed rgba(201,168,76,0.18)" },
  body:       { display:"flex", gap:20, padding:"20px 28px", alignItems:"flex-start" },
  infoCol:    { flex:1, display:"flex", flexDirection:"column", gap:14 },
  infoLabel:  { fontSize:9, fontWeight:700, color:"#3a4a60", letterSpacing:2, textTransform:"uppercase" },
  infoVal:    { fontSize:14, fontWeight:500, color:"#f0ece0", lineHeight:1.4 },
  qrCol:      { display:"flex", flexDirection:"column", alignItems:"center", gap:8, flexShrink:0 },
  qrBox:      { width:152, height:152, border:"1px solid rgba(201,168,76,0.2)", borderRadius:8, background:"#101828", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:6 },
  qrHint:     { fontSize:10, color:"#3a4a60", letterSpacing:1.5, textTransform:"uppercase", textAlign:"center" },
  footerText: { fontSize:10, color:"#2a3a50", letterSpacing:0.5 },
  btnRow:     { display:"flex", gap:12, width:520 },
  dlBtn: {
    flex:1, padding:"14px 20px",
    background:"#c9a84c", color:"#070b17",
    border:"none", borderRadius:6,
    fontSize:12, fontWeight:800, letterSpacing:2, textTransform:"uppercase",
    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    fontFamily:"'DM Sans',sans-serif",
  },
  closeBtn: {
    flex:1, padding:"14px 20px",
    background:"transparent", color:"#7a8a9e",
    border:"1px solid rgba(201,168,76,0.15)", borderRadius:6,
    fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
  },
  loadingBox: {
    background:"#101828", border:"1px solid rgba(201,168,76,0.15)",
    borderRadius:8, padding:48, textAlign:"center", minWidth:320,
  },
  spinner: {
    width:40, height:40, borderRadius:"50%",
    border:"2px solid rgba(201,168,76,0.2)",
    borderTop:"2px solid #c9a84c",
    margin:"0 auto 20px",
    animation:"spin 1s linear infinite",
  },
};

export default PaymentModal;
