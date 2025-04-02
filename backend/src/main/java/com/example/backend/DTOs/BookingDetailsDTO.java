package com.example.backend.DTOs;

public class BookingDetailsDTO {
    
    private Long eventId;
    private Long userId;
    private Long numberOfBookedSeats = 1L;

    public Long getEventId() {
        return eventId;
    }
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getNumberOfBookedSeats() {
        return numberOfBookedSeats;
    }
    public void setNumberOfBookedSeats(Long numberOfBookedSeats) {
        this.numberOfBookedSeats = numberOfBookedSeats;
    }
}
