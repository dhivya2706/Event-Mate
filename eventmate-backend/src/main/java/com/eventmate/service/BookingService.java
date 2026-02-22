package com.eventmate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmate.entity.Booking;
import com.eventmate.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking save(Booking booking){
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByOrganizer(Long organizerId){
        return bookingRepository.findBookingsByOrganizer(organizerId);
    }

    public List<Booking> getOrganizerBookings(String email){
        return bookingRepository.findBookingsByOrganizerEmail(email);
    }
    public Long getTotalBookings() {
        return bookingRepository.count();
    }

    public Double getTotalRevenue() {
        Double revenue = bookingRepository.sumAllRevenue();
        return revenue != null ? revenue : 0.0;
    }

    public Long getConfirmedBookings() {
        return bookingRepository.countConfirmed();
    }

    public Long getPendingBookings() {
        return bookingRepository.countPending();
    }   

    public Long getCancelledBookings() {
        return bookingRepository.countCancelled();
    }
    public Long getTotalBookingsByOrganizer(String email){
        return bookingRepository.countByOrganizerEmail(email);
    }

    public Double getRevenueByOrganizer(String email){
        Double r = bookingRepository.sumRevenueByOrganizerEmail(email);
        return r != null ? r : 0.0;
    }

    public Long getConfirmedByOrganizer(String email){
        return bookingRepository.countConfirmedByOrganizer(email);
    }

    public Long getPendingByOrganizer(String email){
        return bookingRepository.countPendingByOrganizer(email);
    }

    public Long getCancelledByOrganizer(String email){
        return bookingRepository.countCancelledByOrganizer(email);
    }

}
