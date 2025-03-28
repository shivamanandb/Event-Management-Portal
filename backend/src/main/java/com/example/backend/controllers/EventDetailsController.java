package com.example.backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.EventDetails;
import com.example.backend.models.EventDetailsDTO;
import com.example.backend.repository.EventRepository;
import com.example.backend.services.EventDetailsService;
import com.example.backend.services.EventService;

@RestController
@CrossOrigin("*")
@RequestMapping("/eventDetails")
public class EventDetailsController {
    
    @Autowired
    private EventDetailsService eventDetailsService;

    @PostMapping("/save-event")
    public EventDetails saveEventDetails(@RequestBody EventDetailsDTO eventDetailsDTO){

        return this.eventDetailsService.saveEventDetails(eventDetailsDTO);
    }
    
    @GetMapping("/get-events/{id}")
    public List<EventDetailsDTO> getEnrolledPeopleDetails(@PathVariable("id") Long eventId, Principal principal){

        return this.eventDetailsService.getEnrolledPeopleDetails(eventId, principal);
    }
}
