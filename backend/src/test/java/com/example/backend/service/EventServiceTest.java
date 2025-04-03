package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.backend.models.Event;
import com.example.backend.models.OrganizerDetails;
import com.example.backend.models.User;
import com.example.backend.models.UserRole;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.EventService;
import com.example.backend.services.Implementation.EventServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.Principal;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @InjectMocks
    EventServiceImpl eventService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizerDetailsRepository organizerDetailsRepository;

    @Mock
    private EventRepository eventRepository;

    @Test
    void createEventTest() {

        // Create a Principal implementation instead of using mock
        Principal mockPrincipal = new Principal() {
            @Override
            public String getName() {
                return "xyz@gmail.com";
            }
        };

        // Arrange
        String email = "xyz@gmail.com";

        User organizer = new User();
        organizer.setEmail(email);
        organizer.setRole(UserRole.ORGANIZER);
        organizer.setName("xyz");

        OrganizerDetails organizerDetails = new OrganizerDetails();
        organizerDetails.setId(1L);
        organizerDetails.setOrganizationName("xyz organization");
        organizerDetails.setDescription("Test description");

        Event event = new Event();
        event.setTitle("Music Festival");

        // Mock behavior
        when(userRepository.findByEmail(email)).thenReturn(organizer);
        when(organizerDetailsRepository.findByUser(organizer)).thenReturn(organizerDetails);
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        // Act
        Event createdEvent = eventService.createEvent(event, mockPrincipal);

        // Assert
        assertNotNull(createdEvent);
        assertEquals("Music Festival", createdEvent.getTitle());
    }


    void getAllEventsTest
}
