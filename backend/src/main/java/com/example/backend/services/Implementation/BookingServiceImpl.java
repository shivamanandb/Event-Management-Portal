package com.example.backend.services.Implementation;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.DTOs.BookingDetailsDTO;
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
    public Booking saveBooking(BookingDetailsDTO booking, String paymentReferenceId) {
        
        MyOrder myOrder = this.myOrderRepository.findByPaymentReferenceId(paymentReferenceId);
        User user = this.userRepository.findById(booking.getUserId())
                                       .orElseThrow(() -> new RuntimeException("User not found with ID: " + booking.getUserId()));

        Event event = this.eventRepository.findById(booking.getEventId())
                          .orElseThrow(()-> new RuntimeException("Event not found with ID: " + booking.getEventId()));
        Booking currBooking = new Booking();
        currBooking.setUser(user);;
        currBooking.setBookingDateTime(LocalDateTime.now());
        currBooking.setNumberOfBookedSeats(booking.getNumberOfBookedSeats());
        currBooking.setEvent(event);
        currBooking.setMyOrder(myOrder);

        return this.bookingRepository.save(currBooking);
    }

    @Override
    public Set<Booking> getAllBookings(Long userId) {
        
        Set<Booking> bookings = this.bookingRepository.findByUserId(userId);

        // At client side, there is no need of user details
        bookings.forEach(booking ->{
            booking.setUser(null);
        });
        
        return bookings;
    }

    @Override
    public Booking cancelBooking(Long bookingId) {
        
        Booking booking = this.bookingRepository.findById(bookingId).get();
        booking.setBookingStatus(false);

        Event event = this.eventRepository.findById(booking.getEvent().getId())
                          .orElseThrow(()-> new RuntimeException("Event not found for cancelling an order"));
        event.setRemainingSeat(event.getRemainingSeat() + booking.getNumberOfBookedSeats());
        booking = this.bookingRepository.save(booking);
        this.eventRepository.save(event);

        // At client side, there is no need of user details
        booking.setUser(null);

        return booking;
    }   
}
