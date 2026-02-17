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

public Long getTotalBookings() {
    return bookingRepository.count();
}

public Double getTotalRevenue() {
    Double revenue = bookingRepository.sumAllRevenue();
    return revenue != null ? revenue : 0.0;
}

}
