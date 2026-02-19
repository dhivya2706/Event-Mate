package com.event.eventmate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;

import com.event.eventmate.model.Payment;
import com.event.eventmate.repository.PaymentRepository;

import java.time.LocalDate;
import java.util.UUID;

@Controller
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    // EVENT PAGE
    @GetMapping("/event")
    public String showEventPage() {
        return "event";
    }

    // PAYMENT PAGE (NOW RECEIVES SEATS)
    @GetMapping("/payment")
    public String showPaymentPage(@RequestParam int seats, Model model) {

        double pricePerSeat = 500;
        double totalAmount = seats * pricePerSeat;

        model.addAttribute("seats", seats);
        model.addAttribute("price", pricePerSeat);
        model.addAttribute("amount", totalAmount);

        return "payment";
    }

    // PROCESS PAYMENT
    @PostMapping("/payment")
    public String processPayment(@RequestParam String paymentMethod,
                                 @RequestParam double amount,
                                 @RequestParam int seats,
                                 Model model) {

        String transactionId = "TXN" + UUID.randomUUID().toString().substring(0,8);
        String date = LocalDate.now().toString();

        Payment payment = new Payment();
        payment.setPaymentMethod(paymentMethod);
        payment.setAmount(amount);
        payment.setTransactionId(transactionId);
        payment.setPaymentDate(date);

        paymentRepository.save(payment);

        model.addAttribute("method", paymentMethod);
        model.addAttribute("amount", amount);
        model.addAttribute("txn", transactionId);
        model.addAttribute("date", date);

        return "payment_success";
    }
}
