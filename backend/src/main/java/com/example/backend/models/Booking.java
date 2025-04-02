package com.example.backend.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    private Event event;
    
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;
    
    @Column(nullable = false)
    private LocalDateTime bookingDateTime;
   
    @Column(nullable = false)
    private boolean bookingStatus = true;
    
    @Column(nullable = false)
    private Long numberOfBookedSeats = 1L;
    
    @OneToOne // Changed from @Column to @OneToOne
    @JoinColumn(name = "order_id")
    @JsonManagedReference  // Indicates this side can be serialized
    private MyOrder myOrder;
    
    // Default constructor
    public Booking() {
    }
    
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
   
    
    public LocalDateTime getBookingDateTime() {
        return bookingDateTime;
    }
    
    public void setBookingDateTime(LocalDateTime bookingDateTime) {
        this.bookingDateTime = bookingDateTime;
    }
    
    public boolean isBookingStatus() {
        return bookingStatus;
    }
    
    public void setBookingStatus(boolean bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
    
    public Long getNumberOfBookedSeats() {
        return numberOfBookedSeats;
    }
    
    public void setNumberOfBookedSeats(Long numberOfBookedSeats) {
        this.numberOfBookedSeats = numberOfBookedSeats;
    }
    
    public MyOrder getMyOrder() {
        return myOrder;
    }
    
    // Fixed method name for consistency
    public void setMyOrder(MyOrder myOrder) {
        this.myOrder = myOrder;
    }


    public Event getEvent() {
        return event;
    }


    public void setEvent(Event event) {
        this.event = event;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }

    
}