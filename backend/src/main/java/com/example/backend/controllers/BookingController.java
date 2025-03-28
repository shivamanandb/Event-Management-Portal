package com.example.backend.controllers;

import java.security.Principal;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.Booking;
import com.example.backend.services.BookingService;

@RestController
@CrossOrigin("*")
@RequestMapping("/bookings")
public class BookingController {
   
    @Autowired
    private BookingService bookingService;  

    @PostMapping("/create-booking/{paymentReferenceId}")
    public ResponseEntity<Booking> createBooking(
            @PathVariable("paymentReferenceId") String paymentReferenceId,
            @RequestBody Booking booking) {
        
        // System.out.println("Payment reference id: " + paymentReferenceId);
        Booking currBooking = this.bookingService.saveBooking(booking, paymentReferenceId);
        
        return ResponseEntity.ok(currBooking);
    }

    @GetMapping("/all/{id}")
    public Set<Booking> getAllBookings(@PathVariable("id") Long userId){ 

        return this.bookingService.getAllBookings(userId);
    }

    @PutMapping("/cancel/{bookingId}")
    public Booking cancelBooking(@PathVariable("bookingId") Long bookingId){
        System.out.println("Hekllllo");
        return this.bookingService.cancelBooking(bookingId);
    }
}