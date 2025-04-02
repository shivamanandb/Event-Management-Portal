package com.example.backend.services;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import com.example.backend.models.EnrolledPeopleDTO;
import com.example.backend.models.Event;
// import com.example.backend.models.EventDetails;

public interface EventService {

    // creating Event
    public Event createEvent(Event event, Principal principal);

    // get all event details
    public List<Event> getAllEvents();

    // get events by category
    public List<Event> getEventsByCategory(String category);

    public Event updateEvent(Long id, Event event);

    public void deleteEvent(Long id);

    public List<Event> getOrganizerEvents(Long userId, Principal principal) throws Exception;

    public Set<EnrolledPeopleDTO> getEnrolledPeople(Long eventId);


}
