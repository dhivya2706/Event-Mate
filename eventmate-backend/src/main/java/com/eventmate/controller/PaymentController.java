package com.eventmate.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eventmate.entity.Booking;
import com.eventmate.entity.Payment;
import com.eventmate.repository.BookingRepository;
import com.eventmate.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {

        try {

            if (!request.containsKey("bookingId")) {
                return ResponseEntity.badRequest().body("Booking ID is required");
            }

            Long bookingId = Long.parseLong(request.get("bookingId").toString());

            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
                return ResponseEntity.badRequest().body("Booking already paid");
            }

            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (booking.getTotalAmount() * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + bookingId);

            Order order = razorpay.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(booking.getTotalAmount());
            payment.setOrderId(order.get("id"));
            payment.setPaymentStatus("PENDING");
            payment.setPaymentMethod("RAZORPAY");

            paymentRepository.save(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("key", razorpayKeyId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Order creation failed");
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, String> request) {

        try {

            String orderId = request.get("orderId");
            String paymentId = request.get("paymentId");
            String signature = request.get("signature");

            System.out.println("OrderId: " + orderId);

            Payment payment = paymentRepository.findByOrderId(orderId)
                    .orElse(null);

            if (payment == null) {
                return ResponseEntity.badRequest()
                        .body("Order not found in database");
            }

            String generatedSignature = generateSignature(orderId, paymentId);

            if (!generatedSignature.equals(signature)) {
                return ResponseEntity.badRequest()
                        .body("Signature mismatch");
            }

            payment.setPaymentId(paymentId);
            payment.setPaymentStatus("PAID");
            payment.setPaymentDate(LocalDate.now());

            Booking booking = payment.getBooking();
            booking.setPaymentStatus("PAID");
            booking.setBookingStatus("Confirmed");

            paymentRepository.save(payment);
            bookingRepository.save(booking);

            return ResponseEntity.ok("Payment Successful");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Server error: " + e.getMessage());
        }
    }

    private String generateSignature(String orderId, String paymentId) throws Exception {

        String data = orderId + "|" + paymentId;

        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
        sha256Hmac.init(secretKey);

        byte[] hash = sha256Hmac.doFinal(data.getBytes());

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }

        return hexString.toString();
    }
}
