package com.example.backend.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.DTOs.EnrolledPeopleDTO;
import com.example.backend.models.Event;
import com.example.backend.services.EventService;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // create Event
    @PreAuthorize("hasAuthority('ORGANIZER')")
    @PostMapping("/create-event")
    public Event createEvent(@RequestBody Event event, Principal principal){
        return this.eventService.createEvent(event, principal);
    }

    @PreAuthorize("hasAuthority('ATTENDEE')")
    @GetMapping
    public List<Event> getAllEvents() {
        return this.eventService.getAllEvents();
    }
    
    @GetMapping("/category/{category}")
    public List<Event> getEventsByCategory(@PathVariable("category") String category){

        return this.eventService.getEventsByCategory(category);
    }


    @GetMapping("/{eventId}")
    public Event getEventById(@PathVariable("eventId") Long eventId){

        return this.eventService.getEventById(eventId);
    }

    @PreAuthorize("hasAuthority('ORGANIZER')")
    @PutMapping("/update/{id}")
    public Event updateEvent(@PathVariable("id") Long id, @RequestBody Event event){

        return this.eventService.updateEvent(id, event);
    }
                        
                      
    @PreAuthorize("hasAuthority('ORGANIZER')")
    @GetMapping("/organizer/{userId}")
    public List<Event> getOrganizerEvents(@PathVariable("userId") Long userId, Principal principal) throws Exception{
        System.out.println("userId :" + userId);
        return this.eventService.getOrganizerEvents(userId, principal);
    }

    @PreAuthorize("hasAuthority('ORGANIZER')")
    @GetMapping("/getEnrolledPeople/{eventId}")
    public Set<EnrolledPeopleDTO> getEnrolledPeople(@PathVariable("eventId") Long eventId){

        return this.eventService.getEnrolledPeople(eventId);
    }
    
    @PreAuthorize("hasAuthority('ORGANIZER')")
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok("Event cancelled successfully");
    }
}       
