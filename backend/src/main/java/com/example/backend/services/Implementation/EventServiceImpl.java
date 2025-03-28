package com.example.backend.services.Implementation;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.controllers.UserController;
import com.example.backend.models.Event;
import com.example.backend.models.EventDetails;
import com.example.backend.models.OrganizerDetails;
import com.example.backend.models.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.EventService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private  BookingRepository bookingRepository;

    private  UserController userController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizerDetailsRepository organizerDetailsRepository;

    @Autowired
    private EventRepository eventRepository;

    EventServiceImpl(UserController userController, BookingRepository bookingRepository) {
        this.userController = userController;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Event createEvent(Event event, Principal principal) {
        
        try {
            // Get current user
            String email = getCurrentUserEmail(principal); 
            User user = this.userRepository.findByEmail(email);

            System.out.println("user : "+ user.getRole());

            // check user is Organizer
            if(!user.getRole().toString().equals("ORGANIZER")){
                throw new Exception("Only organizer can create events.");
            }

            // fetch Organizer Details
            OrganizerDetails organizerDetails = this.organizerDetailsRepository.findByUser(user);
            // set values
            OrganizerDetails currentOrganizer = new OrganizerDetails();
            currentOrganizer.setId(organizerDetails.getId());
            currentOrganizer.setUser(null);
            currentOrganizer.setOrganizationName(organizerDetails.getOrganizationName());
            currentOrganizer.setDescription(organizerDetails.getDescription());
            event.setOrganizerDetails(currentOrganizer);
            
        } catch(Exception e){
            System.out.println("Error :" + e);
        }
        return this.eventRepository.save(event);

    }
    
    // help method
    private String getCurrentUserEmail(Principal principal) {
        return principal.getName();
    }

    @Override
    public List<Event> getAllEvents() {
        List<Event> events = this.eventRepository.findAll();
        events.forEach(event -> {
            if (event.getOrganizerDetails() != null) {

                // Create a copy with minimal organizer details or set to null
                OrganizerDetails minimalDetails = new OrganizerDetails();
                minimalDetails.setId(event.getOrganizerDetails().getId());
                minimalDetails.setOrganizationName(event.getOrganizerDetails().getOrganizationName());
                minimalDetails.setDescription(event.getOrganizerDetails().getDescription());
                minimalDetails.setUser(null);
                
                event.setOrganizerDetails(minimalDetails);
            }
        });
        return events;
    }
    
    @Override
    public List<Event> getEventsByCategory(String category){

        return this.eventRepository.findByCategory(category);
    }

    @Override
    public Event updateEvent(Long id, Event event) {

        Event eventData = this.eventRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));
            
        try {
            
            // Update the event fields
            eventData.setId(event.getId());
            eventData.setTitle(event.getTitle());
            eventData.setDescription(event.getDescription());
            eventData.setEventDateTime(event.getEventDateTime());
            eventData.setLocation(event.getLocation());
            eventData.setEventDateTime(event.getEventDateTime());
            eventData.setEventEndDateTime(event.getEventEndDateTime());
            eventData.setCategory(event.getCategory());
            eventData.setTotalSeats(event.getTotalSeats());
            eventData.setRemainingSeat(event.getRemainingSeat());
            eventData.setEventStatus(event.isEventStatus());
            eventData.setThumbnail(event.getThumbnail());
            eventData.setPrice(event.getPrice());

        // Save the updated event       
        }catch(Exception e){
            System.out.println("Error in updating data");
        }
         Event events = this.eventRepository.save(eventData);

         // set organizerDetails to null, so that duplicate data could not send to client
         events.setOrganizerDetails(null);
         return events;
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        try {
            this.eventRepository.deleteById(id);
            this.bookingRepository.deleteByEventId(id);
        } catch(Exception e){
            System.out.println("Error while deleting event : " + e.getMessage());
        }
    }

    @Override
    public List<Event> getOrganizerEvents(Long userId, Principal principal) throws Exception {
        
        User loggedInUser = this.userRepository.findByEmail(principal.getName());

        User user = this.userRepository.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if(!loggedInUser.equals(user)){
            throw new Exception("Unauthorized User Action");
        }
        OrganizerDetails organizerDetails = this.organizerDetailsRepository.findByUser(user);
        List<Event> organizerEvents = this.eventRepository.findByOrganizerDetails(organizerDetails);
        
        organizerEvents.forEach((organizerEvent) -> { 
            organizerEvent.setOrganizerDetails(null);
        });
        
        return organizerEvents;
    }
}
