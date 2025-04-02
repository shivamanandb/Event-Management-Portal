package com.example.backend.models;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class MyOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   
    private String bookingOrderId;
    private String paymentReferenceId;
    private String paymentStatus;
    private Integer amount;
    private String paymentReceipt;
   
    @OneToOne(mappedBy = "myOrder", cascade = CascadeType.ALL) 
    @JsonBackReference  // Indicates the back reference side
    private Booking booking;

    public MyOrder(Long id, String bookingOrderId, String paymentReferenceId, String paymentStatus, Integer amount,
            String paymentReceipt) { 
        this.id = id;
        this.bookingOrderId = bookingOrderId;
        this.paymentReferenceId = paymentReferenceId;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.paymentReceipt = paymentReceipt;
    }
   
    public MyOrder() {
    }
   
    public Long getId() {
        return id;
    }
   
    public void setId(Long id) {
        this.id = id;
    }
   
    public String getBookingOrderId() {
        return bookingOrderId;
    }
   
    public void setBookingOrderId(String bookingOrderId) {
        this.bookingOrderId = bookingOrderId;
    }
   
    public String getPaymentReferenceId() {
        return paymentReferenceId;
    }
   
    public void setPaymentReferenceId(String paymentReferenceId) {
        this.paymentReferenceId = paymentReferenceId;
    }
   
    public String getPaymentStatus() {
        return paymentStatus;
    }
   
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
   
    public Integer getAmount() {
        return amount;
    }
   
    public void setAmount(Integer amount) {
        this.amount = amount;
    }
   
    public String getPaymentReceipt() {
        return paymentReceipt;
    }
   
    public void setPaymentReceipt(String paymentReceipt) {
        this.paymentReceipt = paymentReceipt;
    }
   
    public Booking getBooking() {
        return booking;
    }
   
    public void setBooking(Booking booking) {
        this.booking = booking;
    }
}