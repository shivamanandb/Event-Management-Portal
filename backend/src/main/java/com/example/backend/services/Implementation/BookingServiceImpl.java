package com.example.backend.services.Implementation;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.Booking;
import com.example.backend.models.Event;
import com.example.backend.models.MyOrder;
import com.example.backend.models.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.MyOrderRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.BookingService;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MyOrderRepository myOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Booking saveBooking(Booking booking, String paymentReferenceId) {
        
        MyOrder myOrder = this.myOrderRepository.findByPaymentReferenceId(paymentReferenceId);
        
        Booking currBooking = new Booking();
        currBooking.setUserId(booking.getUserId());
        currBooking.setBookingDateTime(LocalDateTime.now());
        currBooking.setNumberOfBookedSeats(booking.getNumberOfBookedSeats());
        currBooking.setEventId(booking.getEventId());
        currBooking.setMyOrder(myOrder);
        Booking response = this.bookingRepository.save(currBooking);

        return response;
    }

    @Override
    public Set<Booking> getAllBookings(Long userId) {
        
        Set<Booking> bookings = this.bookingRepository.findByUserId(userId);
        
        return bookings;
    }

    @Override
    public Booking cancelBooking(Long bookingId) {
        
        Booking booking = this.bookingRepository.findById(bookingId).get();
        booking.setBookingStatus(false);

        Event event = this.eventRepository.findById(booking.getEventId()).get();
        event.setRemainingSeat(event.getRemainingSeat() + booking.getNumberOfBookedSeats());
        booking = this.bookingRepository.save(booking);
        this.eventRepository.save(event);
        return booking;
    }   
}
