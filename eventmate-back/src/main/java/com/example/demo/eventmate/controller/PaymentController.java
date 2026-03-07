package com.example.demo.eventmate.controller;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.eventmate.model.Payment;
import com.example.demo.eventmate.model.Booking;
import com.example.demo.eventmate.repository.PaymentRepository;
import com.example.demo.eventmate.repository.BookingRepository;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // ================= PROCESS PAYMENT =================
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> request) {

        try {

            double amount = Double.parseDouble(request.get("amount").toString());
            Long bookingId = Long.valueOf(request.get("bookingId").toString());
            Long userId = Long.valueOf(request.get("userId").toString());

            Booking booking = bookingRepository.findById(bookingId).orElse(null);

            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

            if ("Cancelled".equals(booking.getBookingStatus())) {
                return ResponseEntity.badRequest()
                        .body("Cannot process payment for cancelled booking");
            }

            String transactionId = "TXN" + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();

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
                    "message", "Payment started. Await QR confirmation."
            ));

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body("Payment failed: " + e.getMessage());
        }
    }

    // ================= QR CONFIRM PAYMENT =================
    @PutMapping("/confirm/{bookingId}")
    public ResponseEntity<?> confirmPayment(@PathVariable Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking == null) {
            return ResponseEntity.badRequest()
                    .body("Booking not found");
        }

        if ("Cancelled".equals(booking.getBookingStatus())) {
            return ResponseEntity.badRequest()
                    .body("Cannot confirm payment for cancelled booking");
        }

        booking.setPaymentStatus("Confirmed");

        bookingRepository.save(booking);

        Payment payment = paymentRepository.findByBookingId(bookingId);

        if (payment != null) {

            payment.setPaymentStatus("Confirmed");

            paymentRepository.save(payment);
        }

        return ResponseEntity.ok(Map.of(
                "status", "CONFIRMED",
                "message", "Payment confirmed via QR"
        ));
    }
}