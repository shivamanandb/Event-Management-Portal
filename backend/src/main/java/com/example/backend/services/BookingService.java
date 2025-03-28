package com.example.backend.services;
import java.security.Principal;
import java.util.Set;

import com.example.backend.models.Booking;

public interface BookingService {
   
    public Booking saveBooking(Booking booking, String paymentReferenceId);

    public Set<Booking> getAllBookings(Long userId);

    public Booking cancelBooking(Long bookingId);


}