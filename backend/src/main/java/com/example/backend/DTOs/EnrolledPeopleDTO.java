package com.example.backend.DTOs;

import java.time.LocalDateTime;

public class EnrolledPeopleDTO {
    
    private String name;
    private String phone;
    private Boolean bookingStatus;
    private String paymentReferenceId;
    private LocalDateTime eventDateTime;
    private Long numberOfBookedSeats;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public Boolean getBookingStatus() {
        return bookingStatus;
    }
    public void setBookingStatus(Boolean bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
    public String getPaymentReferenceId() {
        return paymentReferenceId;
    }
    public void setPaymentReferenceId(String paymentReferenceId) {
        this.paymentReferenceId = paymentReferenceId;
    }
    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }
    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }
    public Long getNumberOfBookedSeats() {
        return numberOfBookedSeats;
    }
    public void setNumberOfBookedSeats(Long numberOfBookedSeats) {
        this.numberOfBookedSeats = numberOfBookedSeats;
    }

    
}
