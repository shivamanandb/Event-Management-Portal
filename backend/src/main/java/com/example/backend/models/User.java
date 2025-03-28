package com.example.backend.models;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phoneNo;

    @Column(nullable = false)
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<EventDetails> event_details;

    @Transient
    private String organizationName;

    @Transient
    private String description;

    // Constructor
    public User() {}


    // Getters and Setters
    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getEmail() { 
        return email; 
    }

    public void setEmail(String email) { 
        this.email = email; 
    }

    public UserRole getRole() {
        return role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPassword() { 
        return password; 
    }

    public void setPassword(String password) {
        this.password = password; 
    }

    public String getName() { 
        return name; 
    }
    public void setName(String name) { 
        this.name = name; 
    }

    public String getPhoneNo() { 
        return phoneNo; 
    }

    public void setPhoneNo(String phoneNo) { 
        this.phoneNo = phoneNo; 
    }

    public boolean isActive() { 
        return active; 
    }

    public void setActive(boolean active) { 
        this.active = active; 
    }

    public String getUsername() {
        return email;
    }

    public void setUsername(String username) {
        this.email = username;
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


    public void setDescription(String description) {
        this.description = description;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        
        Authority authority = new Authority(this.role.name());
        return Collections.singletonList(authority);
    }


    public Set<EventDetails> getEvent_details() {
        return event_details;
    }


    public void setEvent_details(Set<EventDetails> event_details) {
        this.event_details = event_details;
    }
}

