package com.example.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.DTOs.BookingDetailsDTO;
import com.example.backend.models.Booking;
import com.example.backend.models.Event;
import com.example.backend.models.MyOrder;
import com.example.backend.models.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.MyOrderRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.Implementation.BookingServiceImpl;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock       
    private MyOrderRepository myOrderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User user;
    private Booking booking;
    private MyOrder myOrder;
    private BookingDetailsDTO bookingDetailsDTO;
    private Event event;
    private String paymentReferenceId;

    @BeforeEach
    void setUpMockData(){

        // set up mock data for the tests
        user = new User();
        user.setId(1L);
        user.setName("demo user");

        event = new Event();
        event.setId(1L);
        event.setTitle("demo event");
        event.setRemainingSeat(10L);

        myOrder = new MyOrder();
        myOrder.setId(1L);
        myOrder.setPaymentReferenceId("pay_123");

        booking = new Booking();
        booking.setId(1L);
        booking.setUser(user);
        booking.setEvent(event);
        booking.setMyOrder(myOrder);
        booking.setNumberOfBookedSeats(2L);
        booking.setBookingDateTime(LocalDateTime.now());
        booking.setBookingStatus(true);

        bookingDetailsDTO = new BookingDetailsDTO();
        bookingDetailsDTO.setUserId(1L);
        bookingDetailsDTO.setEventId(1L);
        bookingDetailsDTO.setNumberOfBookedSeats(2L);
        
        paymentReferenceId = "pay_123";
    }

    @Test
    void saveBookingShouldSavedBookingSuccessfully(){

        when(myOrderRepository.findByPaymentReferenceId(paymentReferenceId)).thenReturn(myOrder);
        when(userRepository.findById(bookingDetailsDTO.getUserId())).thenReturn(Optional.of(user));
        when(eventRepository.findById(bookingDetailsDTO.getEventId())).thenReturn(Optional.of(event));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        // Act
        Booking savedBooking = bookingService.saveBooking(bookingDetailsDTO, paymentReferenceId);

        // Assert
        assertNotNull(savedBooking);
        assertEquals(1L, savedBooking.getId());
        assertEquals(2L, savedBooking.getNumberOfBookedSeats());
        assertEquals(user, savedBooking.getUser());
        assertEquals(event, savedBooking.getEvent());
        assertEquals(myOrder, savedBooking.getMyOrder());
        assertTrue(savedBooking.isBookingStatus());

        verify(myOrderRepository).findByPaymentReferenceId(paymentReferenceId);
        verify(userRepository).findById(bookingDetailsDTO.getUserId());
        verify(eventRepository).findById(bookingDetailsDTO.getEventId());

    }

    @Test
    void getAllBookingSuccess(){

        Set<Booking> bookings = new HashSet<>();
        bookings.add(booking);

        when(bookingRepository.findByUserId(1L)).thenReturn(bookings);

        // Act
        Set<Booking> res = bookingService.getAllBookings(1L);

        // Assert
        assertNotNull(res);
        assertEquals(1, res.size());

        for (Booking b : res) {
            assertNull(b.getUser());
            assertEquals(event, b.getEvent());
        }

        verify(bookingRepository).findByUserId(1L);
    }

    @Test
    void testCancelBooking() {
        // Arrange
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(eventRepository.findById(event.getId())).thenReturn(Optional.of(event));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        // Initial remaining seats
        Long initialRemainingSeats = event.getRemainingSeat();

        // Act
        Booking cancelledBooking = bookingService.cancelBooking(1L);

        // Assert
        assertNotNull(cancelledBooking);
        assertFalse(cancelledBooking.isBookingStatus());
        assertNull(cancelledBooking.getUser());

        // Verify that the event's remaining seats were updated
        assertEquals(initialRemainingSeats + booking.getNumberOfBookedSeats(), event.getRemainingSeat());

        verify(bookingRepository).findById(1L);
        verify(eventRepository).findById(event.getId());
        verify(bookingRepository).save(booking);
        verify(eventRepository).save(event);
    }

}

