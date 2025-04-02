package com.example.backend.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.EnrolledPeopleDTO;
import com.example.backend.models.Event;
import com.example.backend.services.EventService;

@RestController
@CrossOrigin("*")
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // create Event
    @PostMapping("/create-event")
    public Event createEvent(@RequestBody Event event, Principal principal){
        return this.eventService.createEvent(event, principal);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return this.eventService.getAllEvents();
    }
    
    @GetMapping("/category/{category}")
    public List<Event> getEventsByCategory(@PathVariable("category") String category){

        return this.eventService.getEventsByCategory(category);
    }

    @PutMapping("/update/{id}")
    public Event updateEvent(@PathVariable("id") Long id, @RequestBody Event event){

        return this.eventService.updateEvent(id, event);
    }

    @GetMapping("/organizer/{userId}")
    public List<Event> getOrganizerEvents(@PathVariable("userId") Long userId, Principal principal) throws Exception{
        System.out.println("userId :" + userId);
        return this.eventService.getOrganizerEvents(userId, principal);
    }

    @GetMapping("/getEnrolledPeople/{eventId}")
    public Set<EnrolledPeopleDTO> getEnrolledPeople(@PathVariable("eventId") Long eventId){

        return this.eventService.getEnrolledPeople(eventId);
    }
    

    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok("Event cancelled successfully");
    }
}       
