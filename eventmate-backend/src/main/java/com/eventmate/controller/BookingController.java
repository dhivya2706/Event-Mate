package com.eventmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventmate.entity.Booking;
import com.eventmate.entity.Event;
import com.eventmate.repository.EventRepository;
import com.eventmate.service.BookingService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;
  
    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/organizer")
    public List<Booking> getOrganizerBookingsByEmail(@RequestParam String email){
        return bookingService.getOrganizerBookings(email);
    }

    @PostMapping("/add")
    public Booking createBooking(
            @RequestParam Long eventId,
            @RequestBody Booking booking
    ){
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        booking.setEvent(event); 
        booking.setBookingDate(java.time.LocalDateTime.now());

        return bookingService.save(booking);
    }

    @GetMapping("/organizer/total")
    public Long total(@RequestParam String email){
        return bookingService.getTotalBookingsByOrganizer(email);
    }

    @GetMapping("/organizer/revenue")
    public Double revenue(@RequestParam String email){
        return bookingService.getRevenueByOrganizer(email);
    }

    @GetMapping("/organizer/confirmed")
    public Long confirmed(@RequestParam String email){
        return bookingService.getConfirmedByOrganizer(email);
    }

    @GetMapping("/organizer/pending")
    public Long pending(@RequestParam String email){
        return bookingService.getPendingByOrganizer(email);
    }

    @GetMapping("/organizer/cancelled")
    public Long cancelled(@RequestParam String email){
        return bookingService.getCancelledByOrganizer(email);
    }

    
}
