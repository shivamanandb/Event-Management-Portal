package com.example.backend.models;

import java.util.HashSet;
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
@Table(name = "organizer_details")
public class OrganizerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "organizerDetails", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Event> events = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "organizerDetails")
    @JsonIgnore
    private Set<EventDetails> event_details;

    @Column(nullable = false)
    private String organizationName;

    private String description;

    // Constructors
    public OrganizerDetails() {}

    public OrganizerDetails(Long id, User user, String organizationName, String description, Set<Event> events) {
        this.id = id;
        this.user = user;
        this.organizationName = organizationName;
        this.description = description;
        this.events = events;
    }

    // Getters and Setters
    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public User getUser() { 
        return user; 
    }

    public void setUser(User user) { 
        this.user = user; 
    }

    public String getOrganizationName() { 
        return organizationName; 
    }

    public void setOrganizationName(String organizationName) { 
        this.organizationName = organizationName; 
    }

    public String getDescription() { 
        return description; 
    }

    public Set<EventDetails> getEvent_details() {
        return event_details;
    }

    public void setEvent_details(Set<EventDetails> event_details) {
        this.event_details = event_details;
    }

    public void setDescription(String description) { 
        this.description = description; 
    }

    public Set<Event> getEvents() { 
        return events; 
    }

    public void setEvents(Set<Event> events) { 
        this.events = events; 
    }
}
