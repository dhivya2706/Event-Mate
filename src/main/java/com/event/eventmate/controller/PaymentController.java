package com.event.eventmate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;

import com.event.eventmate.model.Payment;
import com.event.eventmate.repository.PaymentRepository;
import com.event.eventmate.service.QRCodeService;

import java.time.LocalDate;
import java.util.UUID;

@Controller
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

   
    @GetMapping("/event")
    public String showEventPage() {
        return "event";
    }

  
    @GetMapping("/payment")
    public String showPaymentPage(@RequestParam int seats, Model model) {

        double pricePerSeat = 500;
        double totalAmount = seats * pricePerSeat;

        model.addAttribute("seats", seats);
        model.addAttribute("price", pricePerSeat);
        model.addAttribute("amount", totalAmount);

        return "payment";
    }

   
    @PostMapping("/payment")
    public String processPayment(
            @RequestParam String paymentMethod,
            @RequestParam double amount,
            @RequestParam int seats,
            @RequestParam(required = false) String cardNumber,
            @RequestParam(required = false) String expiry,
            @RequestParam(required = false) String paypalEmail,
            Model model) {

        String transactionId = "TXN" + UUID.randomUUID().toString().substring(0, 8);
        String date = LocalDate.now().toString();

        Payment payment = new Payment();
        payment.setPaymentMethod(paymentMethod);
        payment.setAmount(amount);
        payment.setTransactionId(transactionId);
        payment.setPaymentDate(date);

       
        payment.setCardNumber(cardNumber);
        payment.setExpiry(expiry);
        payment.setPaypalEmail(paypalEmail);

        paymentRepository.save(payment);

       
        try {
            String qrText = "Transaction ID: " + transactionId +
                    "\nAmount: ₹" + amount +
                    "\nSeats: " + seats +
                    "\nDate: " + date;

            String qrPath = QRCodeService.generateQRCode(qrText, transactionId);
            model.addAttribute("qrImage", qrPath);

        } catch (Exception e) {
            e.printStackTrace();
        }

       
        String maskedCard = null;
        if (cardNumber != null && cardNumber.length() >= 4) {
            maskedCard = "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
        }

        model.addAttribute("method", paymentMethod);
        model.addAttribute("amount", amount);
        model.addAttribute("txn", transactionId);
        model.addAttribute("date", date);
        model.addAttribute("maskedCard", maskedCard);
        model.addAttribute("paypalEmail", paypalEmail);

        return "payment_success";
    }
}
