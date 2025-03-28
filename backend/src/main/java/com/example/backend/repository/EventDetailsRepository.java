package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.EventDetails;

public interface EventDetailsRepository extends JpaRepository<EventDetails, Long> {
    
        // public List<EventDetails> findByEvent(Long eventId);

}
