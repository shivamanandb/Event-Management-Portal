package com.example.backend.controllers;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTOs.BookingDetailsDTO;
import com.example.backend.models.Booking;
import com.example.backend.services.BookingService;

@RestController
@RequestMapping("/bookings")
public class BookingController {
   
    @Autowired
    private BookingService bookingService;  

    @PreAuthorize("hasAuthority('ATTENDEE')")
    @PostMapping("/create-booking/{paymentReferenceId}")
    public ResponseEntity<Booking> createBooking(
            @PathVariable("paymentReferenceId") String paymentReferenceId,
            @RequestBody BookingDetailsDTO bookingData) {
        System.out.println("Booking dto eventId" + bookingData.getEventId());
        Booking currBooking = this.bookingService.saveBooking(bookingData, paymentReferenceId);
        
        return ResponseEntity.ok(currBooking);
    }

    @PreAuthorize("hasAuthority('ATTENDEE')")
    @GetMapping("/all/{id}")
    public Set<Booking> getAllBookings(@PathVariable("id") Long userId){ 
        System.out.println("userId : dd: " + userId);
        return this.bookingService.getAllBookings(userId);
    }

    @PreAuthorize("hasAuthority('ATTENDEE')")
    @PutMapping("/cancel/{bookingId}")
    public Booking cancelBooking(@PathVariable("bookingId") Long bookingId){
        return this.bookingService.cancelBooking(bookingId);
    }
}