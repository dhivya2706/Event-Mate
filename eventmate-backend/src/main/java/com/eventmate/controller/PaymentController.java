package com.eventmate.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmate.entity.Payment;
import com.eventmate.repository.PaymentRepository;
import com.eventmate.service.QRCodeService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/process")
    public Map<String, Object> processPayment(
            @RequestBody Map<String, Object> request) {

        System.out.println("REQUEST DATA = " + request);

        if (!request.containsKey("amount")
                || !request.containsKey("bookingId")
                || !request.containsKey("paymentMethod")) {

            throw new RuntimeException("Missing payment data");
        }

        double amount =
                Double.parseDouble(request.get("amount").toString());

        Integer bookingId =
                Integer.parseInt(request.get("bookingId").toString());

        String paymentMethod =
                request.get("paymentMethod").toString();

        String transactionId =
                "TXN" + UUID.randomUUID().toString().substring(0, 8);

        LocalDate date = LocalDate.now();
        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setTransactionId(transactionId);
        payment.setPaymentDate(date);
        payment.setPaymentMethod(paymentMethod);

        paymentRepository.save(payment);

        String qrPath = "";

        try {
            String qrText =
                    "Transaction ID: " + transactionId +
                    "\nAmount: ₹" + amount +
                    "\nBooking ID: " + bookingId +
                    "\nDate: " + date;

            qrPath = QRCodeService.generateQRCode(qrText, transactionId);

        } catch (Exception e) {
            e.printStackTrace();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("transactionId", transactionId);
        response.put("amount", amount);
        response.put("qrCode", qrPath);

        return response;
    }
}