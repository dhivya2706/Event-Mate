package com.eventmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmate.entity.Booking;
import com.eventmate.service.BookingService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
public List<Booking> getAllBookings() {
    return bookingService.getAllBookings();
}

@GetMapping("/total")
public Long getTotalBookings() {
    return bookingService.getTotalBookings();
}

@GetMapping("/revenue")
public Double getTotalRevenue() {
    return bookingService.getTotalRevenue();
}

}
