package com.event.eventmate.model;

import jakarta.persistence.*;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentMethod;
    private double amount;
    private String transactionId;
    private String paymentDate;

  
    private String cardNumber;
    private String expiry;
    private String paypalEmail;

   

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaymentMethod() { 
        return paymentMethod; 
    }

    public void setPaymentMethod(String paymentMethod) { 
        this.paymentMethod = paymentMethod; 
    }

    public double getAmount() { 
        return amount; 
    }

    public void setAmount(double amount) { 
        this.amount = amount; 
    }

    public String getTransactionId() { 
        return transactionId; 
    }

    public void setTransactionId(String transactionId) { 
        this.transactionId = transactionId; 
    }

    public String getPaymentDate() { 
        return paymentDate; 
    }

    public void setPaymentDate(String paymentDate) { 
        this.paymentDate = paymentDate; 
    }

   
    public String getCardNumber() { 
        return cardNumber; 
    }

    public void setCardNumber(String cardNumber) { 
        this.cardNumber = cardNumber; 
    }

  
    public String getExpiry() { 
        return expiry; 
    }

    public void setExpiry(String expiry) { 
        this.expiry = expiry; 
    }


    public String getPaypalEmail() { 
        return paypalEmail; 
    }

    public void setPaypalEmail(String paypalEmail) { 
        this.paypalEmail = paypalEmail; 
    }
}
