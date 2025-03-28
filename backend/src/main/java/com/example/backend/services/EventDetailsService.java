package com.example.backend.services;

import java.security.Principal;
import java.util.List;

import com.example.backend.models.EventDetails;
import com.example.backend.models.EventDetailsDTO;

public interface EventDetailsService {

    EventDetails saveEventDetails(EventDetailsDTO eventDetailsDTO);

    public List<EventDetailsDTO> getEnrolledPeopleDetails(Long eventId, Principal principal);    
}
