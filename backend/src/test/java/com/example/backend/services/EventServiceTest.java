package com.example.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.backend.DTOs.EnrolledPeopleDTO;
import com.example.backend.models.*;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.Implementation.EventServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

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

    @Mock
    private BookingRepository bookingRepository;

    @Test
    void createEventShouldCreateEventSuccessfully() {

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

    @Test
    void getAllEventsShouldReturnEventsSuccessfully() {

        // create organizer
        OrganizerDetails organizerDetails = new OrganizerDetails();
        organizerDetails.setId(1L);
        organizerDetails.setOrganizationName("demo organizer");
        organizerDetails.setDescription("demo description");
        organizerDetails.setUser(null);

        // creating event with organizer details
        List<Event> eventList = new ArrayList<>();
        Event event = new Event();
        event.setId(1L);
        event.setTitle("demo title");
        event.setOrganizerDetails(organizerDetails);
        eventList.add(event);

        // mock the repository to return these events
        when(eventRepository.findAll()).thenReturn(eventList);

        // Act
        List<Event> returnEvents = eventService.getAllEvents();

        // Assert
        // verify to call findAll
        verify(eventRepository).findAll();

        // Check that we got the expected number of events
        assertEquals(1, returnEvents.size());

        // check event details
        Event returnEvent = returnEvents.get(0);
        assertEquals(1L, returnEvent.getId());
        assertEquals("demo title", returnEvent.getTitle());
        assertNull(returnEvent.getOrganizerDetails().getUser());
    }

    @Test
    void updateEventShouldReturnUpdatedEventSuccessfully() {

        // demo event id
        Long eventId = 1L;

        Event existingEventData = new Event();
        existingEventData.setId(eventId);
        existingEventData.setTitle("existing title");
        existingEventData.setDescription("existing description");
        existingEventData.setLocation("existing location");

        Event updatedEventData = new Event();
        updatedEventData.setId(eventId);
        updatedEventData.setTitle("New Title");
        updatedEventData.setDescription("New Description");
        updatedEventData.setLocation("New Location");
        updatedEventData.setEventDateTime(LocalDateTime.now());
        updatedEventData.setEventEndDateTime(LocalDateTime.now().plusHours(2));
        updatedEventData.setCategory("Conference");
        updatedEventData.setTotalSeats(100L);
        updatedEventData.setRemainingSeat(50L);
        updatedEventData.setEventStatus(true);
        updatedEventData.setThumbnail(null);
        updatedEventData.setPrice(500L);

        OrganizerDetails organizerDetails = new OrganizerDetails();
        existingEventData.setOrganizerDetails(organizerDetails);

        when(eventRepository.save(any(Event.class))).thenReturn(existingEventData);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(existingEventData));

        // Act
        Event result = eventService.updateEvent(eventId, updatedEventData);

        // Assert
        assertNotNull(result);
        assertEquals(eventId, result.getId());
        assertEquals("New Title", existingEventData.getTitle());
        assertEquals("New Description", existingEventData.getDescription());
        assertEquals("New Location", existingEventData.getLocation());
        assertEquals("Conference", existingEventData.getCategory());
        assertEquals(100L, existingEventData.getTotalSeats());
        assertEquals(50L, existingEventData.getRemainingSeat());
        assertTrue(existingEventData.isEventStatus());
        assertNull( existingEventData.getThumbnail());
        assertEquals(500L, existingEventData.getPrice());
        assertNull(result.getOrganizerDetails());

    }

    // Test for deleteEvent method
    @Test
    void deleteEventShouldDeleteEventAndRelatedData() {

        // Arrange
        Long eventId = 1L;
        Event event = new Event();
        event.setId(eventId);

        Booking booking1 = new Booking();
        MyOrder order1 = new MyOrder();
        booking1.setMyOrder(order1);

        Booking booking2 = new Booking();
        booking2.setMyOrder(null);

        Set<Booking> bookings = new HashSet<>(Arrays.asList(booking1, booking2));

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(bookingRepository.findBookingsByEvent(event)).thenReturn(bookings);

        // Act
        eventService.deleteEvent(eventId);

        // Assert
        verify(eventRepository).findById(eventId);
        verify(bookingRepository).findBookingsByEvent(event);
        verify(bookingRepository).delete(booking1);
        verify(bookingRepository).delete(booking2);
        verify(eventRepository).delete(event);
    }

    @Test
    void getEnrolledPeopleShouldReturnEnrolledPeople() {
        // Arrange
        Long eventId = 1L;

        Event event = new Event();
        event.setId(eventId);
        event.setEventDateTime(LocalDateTime.now());

        User user1 = new User();
        user1.setName("Naman Kumar");
        user1.setPhoneNo("9876543210");

        User user2 = new User();
        user2.setName("Aman Kumar");
        user2.setPhoneNo("9632587410");

        MyOrder order1 = new MyOrder();
        order1.setPaymentReferenceId("txn_1");

        MyOrder order2 = new MyOrder();
        order2.setPaymentReferenceId("txn_2");

        Booking booking1 = new Booking();
        booking1.setUser(user1);
        booking1.setEvent(event);
        booking1.setBookingStatus(true);
        booking1.setMyOrder(order1);
        booking1.setNumberOfBookedSeats(2L);

        Booking booking2 = new Booking();
        booking2.setUser(user2);
        booking2.setEvent(event);
        booking2.setBookingStatus(false);
        booking2.setMyOrder(order2);
        booking2.setNumberOfBookedSeats(1L);

        Set<Booking> bookings = new HashSet<>(Arrays.asList(booking1, booking2));

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(bookingRepository.findBookingsByEvent(event)).thenReturn(bookings);

        // Act
        Set<EnrolledPeopleDTO> result = eventService.getEnrolledPeople(eventId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        boolean isNaman = false;
        boolean isAman = false;

        for (EnrolledPeopleDTO dto : result) {
            if (dto.getName().equals("Naman Kumar")) {
                isNaman = true;
                assertEquals("9876543210", dto.getPhone());
                assertEquals(2L, dto.getNumberOfBookedSeats());
                assertTrue(dto.getBookingStatus());
                assertEquals("txn_1", dto.getPaymentReferenceId());
            }

            if (dto.getName().equals("Aman Kumar")) {
                isAman = true;
                assertEquals("9632587410", dto.getPhone());
                assertEquals(1L, dto.getNumberOfBookedSeats());
                assertFalse(dto.getBookingStatus());
                assertEquals("txn_2", dto.getPaymentReferenceId());
            }
        }

        assertTrue(isNaman);
        assertTrue(isAman);

        verify(eventRepository).findById(eventId);
        verify(bookingRepository).findBookingsByEvent(event);
    }

}

