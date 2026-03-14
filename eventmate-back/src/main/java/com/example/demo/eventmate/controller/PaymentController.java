package com.example.demo.eventmate.controller;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.eventmate.model.Payment;
import com.example.demo.eventmate.model.Booking;
import com.example.demo.eventmate.repository.PaymentRepository;
import com.example.demo.eventmate.repository.BookingRepository;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ✅ Inject from application.properties
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // ================= CREATE RAZORPAY ORDER =================
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            double amount    = Double.parseDouble(request.get("amount").toString());
            Long bookingId   = Long.valueOf(request.get("bookingId").toString());
            Long userId      = Long.valueOf(request.get("userId").toString());

            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null)
                return ResponseEntity.badRequest().body("Booking not found");
            if ("Cancelled".equals(booking.getBookingStatus()))
                return ResponseEntity.badRequest().body("Cannot pay for cancelled booking");

            // Razorpay amount is in paise (₹1 = 100 paise)
            int amountInPaise = (int)(amount * 100);

            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",   amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt",  "booking_" + bookingId);
            orderRequest.put("notes", new JSONObject()
                .put("bookingId", bookingId)
                .put("userId",    userId)
            );

            Order order = client.orders.create(orderRequest);

            return ResponseEntity.ok(Map.of(
                "orderId",       order.get("id"),
                "amount",        amountInPaise,
                "currency",      "INR",
                "razorpayKeyId", razorpayKeyId
            ));

        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Razorpay order creation failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ================= VERIFY & CONFIRM PAYMENT =================
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> request) {
        try {
            String razorpayOrderId   = request.get("razorpayOrderId").toString();
            String razorpayPaymentId = request.get("razorpayPaymentId").toString();
            String razorpaySignature = request.get("razorpaySignature").toString();
            Long   bookingId         = Long.valueOf(request.get("bookingId").toString());
            Long   userId            = Long.valueOf(request.get("userId").toString());
            double amount            = Double.parseDouble(request.get("amount").toString());

            // ✅ Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id",   razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature",  razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (!isValid) {
                return ResponseEntity.badRequest().body("Payment verification failed! Invalid signature.");
            }

            // ✅ Update booking payment status
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking != null) {
                booking.setPaymentStatus("Confirmed");
                bookingRepository.save(booking);
            }

            // ✅ Save payment record
            Payment payment = new Payment();
            payment.setAmount(amount);
            payment.setTransactionId(razorpayPaymentId);
            payment.setPaymentMethod("RAZORPAY");
            payment.setPaymentStatus("Confirmed");
            payment.setPaymentDate(LocalDate.now());
            payment.setBookingId(bookingId);
            payment.setUserId(userId);
            paymentRepository.save(payment);

            return ResponseEntity.ok(Map.of(
                "status",        "SUCCESS",
                "transactionId", razorpayPaymentId,
                "message",       "Payment verified and confirmed!"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification error: " + e.getMessage());
        }
    }

    // ================= OLD PROCESS (kept for fallback) =================
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> request) {
        try {
            double amount  = Double.parseDouble(request.get("amount").toString());
            Long bookingId = Long.valueOf(request.get("bookingId").toString());
            Long userId    = Long.valueOf(request.get("userId").toString());

            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) return ResponseEntity.badRequest().body("Booking not found");
            if ("Cancelled".equals(booking.getBookingStatus()))
                return ResponseEntity.badRequest().body("Cannot process cancelled booking");

            String transactionId = "TXN" + UUID.randomUUID().toString().replace("-","").substring(0,8).toUpperCase();

            Payment payment = new Payment();
            payment.setAmount(amount);
            payment.setTransactionId(transactionId);
            payment.setPaymentMethod("CARD");
            payment.setPaymentStatus("Pending");
            payment.setPaymentDate(LocalDate.now());
            payment.setBookingId(bookingId);
            payment.setUserId(userId);
            paymentRepository.save(payment);

            return ResponseEntity.ok(Map.of(
                "status", "PENDING",
                "transactionId", transactionId,
                "message", "Payment started."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment failed: " + e.getMessage());
        }
    }

    // ================= QR CONFIRM =================
    @PutMapping("/confirm/{bookingId}")
    public ResponseEntity<?> confirmPayment(@PathVariable Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return ResponseEntity.badRequest().body("Booking not found");
        if ("Cancelled".equals(booking.getBookingStatus()))
            return ResponseEntity.badRequest().body("Cannot confirm cancelled booking");

        booking.setPaymentStatus("Confirmed");
        bookingRepository.save(booking);

        Payment payment = paymentRepository.findByBookingId(bookingId);
        if (payment != null) { payment.setPaymentStatus("Confirmed"); paymentRepository.save(payment); }

        return ResponseEntity.ok(Map.of("status", "CONFIRMED", "message", "Payment confirmed"));
    }
}