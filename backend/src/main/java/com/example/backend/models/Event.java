package com.example.backend.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime eventDateTime;

    @Column(nullable = false)
    private LocalDateTime eventEndDateTime;

    public LocalDateTime getEventEndDateTime() {
        return eventEndDateTime;
    }

    public void setEventEndDateTime(LocalDateTime eventEndDateTime) {
        this.eventEndDateTime = eventEndDateTime;
    }

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Long totalSeats;
    
    @Column(nullable = false)
    private Long remainingSeat;

    private Long price;

    @Column(nullable = false)
    private boolean eventStatus = true;

    @ManyToOne
    @JoinColumn(nullable = false)
    private OrganizerDetails organizerDetails;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Booking> bookings;

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "event", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<EventDetails> event_details;

    @Column(nullable = true)
    private String thumbnail;

    @Column(nullable = false)
    private String location;

    public String getLocation() {
        return location;
    }



    public void setLocation(String location) {
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public OrganizerDetails getOrganizerDetails() {
        return organizerDetails;
    }

    public void setOrganizerDetails(OrganizerDetails organizerDetails) {
        this.organizerDetails = organizerDetails;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }

    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Long totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Long getRemainingSeat() {
        return remainingSeat;
    }

    public void setRemainingSeat(Long remainingSeat) {
        this.remainingSeat = remainingSeat;
    }

    public boolean isEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(boolean eventStatus) {
        this.eventStatus = eventStatus;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public Set<EventDetails> getEvent_details() {
        return event_details;
    }

    public void setEvent_details(Set<EventDetails> event_details) {
        this.event_details = event_details;
    }

}