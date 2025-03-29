package com.example.backend.models;

import java.time.LocalDateTime;

public class EventDetailsDTO {
    private Long userId;
    private Long eventId;
    private String name;
    private String phone;
    private Boolean bookingStatus;
    private Long numberOfBookedSeats;
    private String eventName;
    private String paymentReferenceId;

    public String getPaymentReferenceId() {
        return paymentReferenceId;
    }

    public void setPaymentReferenceId(String paymentReferenceId) {
        this.paymentReferenceId = paymentReferenceId;
    }

    public Long getNumberOfBookedSeats() {
        return numberOfBookedSeats;
    }

    public void setNumberOfBookedSeats(Long numberOfBookedSeats) {
        this.numberOfBookedSeats = numberOfBookedSeats;
    }

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

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    private LocalDateTime eventDateTime;

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }

    // Constructors
    public EventDetailsDTO() {}

    public EventDetailsDTO(Long userId, Long eventId) {
        this.userId = userId;
        this.eventId = eventId;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}