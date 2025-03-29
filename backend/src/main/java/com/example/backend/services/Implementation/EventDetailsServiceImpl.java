package com.example.backend.services.Implementation;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.Booking;
import com.example.backend.models.Event;
import com.example.backend.models.EventDetails;
import com.example.backend.models.EventDetailsDTO;
import com.example.backend.models.OrganizerDetails;
import com.example.backend.models.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.EventDetailsRepository;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.EventDetailsService;

@Service
public class EventDetailsServiceImpl implements EventDetailsService {

    @Autowired
    private EventDetailsRepository eventDetailsRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private OrganizerDetailsRepository organizerDetailsRepository;

    @Override
    public EventDetails saveEventDetails(EventDetailsDTO eventDetailsDTO) {
        
        Event event = this.eventRepository.findById(eventDetailsDTO.getEventId()).get();

        EventDetails currEventDetails = new EventDetails();
        User user = this.userRepository.findById(eventDetailsDTO.getUserId())
                                       .orElseThrow(() -> new RuntimeException("User not found"));
        currEventDetails.setEvent(event);
        currEventDetails.setOrganizerDetails(event.getOrganizerDetails());
        currEventDetails.setUser(user);

        return this.eventDetailsRepository.save(currEventDetails);
        
    }
    

    @Override
    public List<EventDetailsDTO> getEnrolledPeopleDetails(Long eventId, Principal principal) {
        
        User user = this.userRepository.findByEmail(principal.getName());

        OrganizerDetails organizerDetails = this.organizerDetailsRepository.findByUser(user);
        List<Booking> bookings = this.bookingRepository.findBookingsByOrganizerAndEvent(organizerDetails.getId(), eventId);

        List<EventDetailsDTO> eventDetailsDTOs = new ArrayList<>();

        bookings.forEach((booking)->{

            User bookedUser = this.userRepository.findById(booking.getUserId()).get();
            Event event = this.eventRepository.findById(booking.getEventId()).get();
            
            EventDetailsDTO eventDetailsDTO = new EventDetailsDTO();

            eventDetailsDTO.setName(bookedUser.getName());
            eventDetailsDTO.setPhone(bookedUser.getPhoneNo());
            eventDetailsDTO.setBookingStatus(booking.isBookingStatus());
            eventDetailsDTO.setPaymentReferenceId(booking.getMyOrder().getPaymentReferenceId());
            eventDetailsDTO.setEventDateTime(event.getEventDateTime());
            eventDetailsDTO.setNumberOfBookedSeats(booking.getNumberOfBookedSeats());

            eventDetailsDTOs.add(eventDetailsDTO);
        });
        return eventDetailsDTOs;
    }
}
