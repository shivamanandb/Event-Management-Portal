package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Event;
// import com.example.backend.models.EventDetails;
import com.example.backend.models.OrganizerDetails;

public interface EventRepository extends JpaRepository <Event, Long> {
    
    public List<Event> findByCategory(String category);

    public List<Event> findByOrganizerDetails(OrganizerDetails organizerDetails);

}
