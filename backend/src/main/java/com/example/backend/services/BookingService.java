package com.example.backend.services;
import java.util.Set;

import com.example.backend.models.Booking;
import com.example.backend.models.BookingDetailsDTO;

public interface BookingService {
   
    public Booking saveBooking(BookingDetailsDTO booking, String paymentReferenceId);

    public Set<Booking> getAllBookings(Long userId);

    public Booking cancelBooking(Long bookingId);


}