package com.example.backend.services;

import static org.mockito.Mockito.*;

import com.example.backend.DTOs.BookingDetailsDTO;
import com.example.backend.models.*;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.Implementation.OrganizerDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class OrganizerDetailsServiceTest {

    @Mock
    private OrganizerDetailsRepository organizerDetailsRepository;

    @InjectMocks
    private OrganizerDetailsServiceImpl organizerDetailsService;

    @Mock
    private UserRepository userRepository;

    private OrganizerDetails organizerDetails;
    private User user;

    @BeforeEach
    void setUpMockData(){

        // set up mock data for the tests
        user = new User();
        user.setId(1L);
        user.setName("demo user");
        user.setOrganizationName("demo org");
        user.setDescription("demo org");

    }

    @Test
    void saveOrganizerDetailsSuccess() {

        organizerDetailsService.saveOrganizerDetails(user);

        verify(organizerDetailsRepository).save(any(OrganizerDetails.class));
    }
}
