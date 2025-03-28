package com.example.backend.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    
    @Column(nullable = false)
    private Long eventId;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private LocalDateTime bookingDateTime;
   
    @Column(nullable = false)
    private boolean bookingStatus = true;
    
    @Column(nullable = false)
    private Long numberOfBookedSeats = 1L;
    
    @OneToOne // Chan  ged from @Column to @OneToOne
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
    
    public Long getEventId() {
        return eventId;
    }
    
    public void setEventId(Long eventId) {
        this.eventId = eventId;
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


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }
}