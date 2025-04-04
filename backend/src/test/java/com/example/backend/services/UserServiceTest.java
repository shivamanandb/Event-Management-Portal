package com.example.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.security.Principal;

import com.example.backend.services.Implementation.OrganizerDetailsServiceImpl;
import com.example.backend.services.Implementation.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.backend.DTOs.UpdateUserDTO;
import com.example.backend.models.OrganizerDetails;
import com.example.backend.models.User;
import com.example.backend.models.UserRole;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizerDetailsServiceImpl organizerDetailsService;

    @Mock
    private OrganizerDetailsRepository organizerDetailsRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private Principal principal;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private OrganizerDetails organizerDetails;
    private UpdateUserDTO updateUserDTO;

    @BeforeEach
    void setUpMockData() {

        // Setup test user
        user = new User();
        user.setName("demo user");
        user.setEmail("xyz@gmail.com");
        user.setPassword("password");
        user.setPhoneNo("9874563210");
        user.setOrganizationName("demo org");
        user.setDescription("demo description");

        // Setup test organizer details
        organizerDetails = new OrganizerDetails();
        organizerDetails.setUser(user);
        organizerDetails.setOrganizationName("demo org");
        organizerDetails.setDescription("demo description");

        // Setup update DTO
        updateUserDTO = new UpdateUserDTO();
        updateUserDTO.setName("updated user");
        updateUserDTO.setEmail("updatedxyz@gmail.com");
        updateUserDTO.setPhoneNo("9632587410");
        updateUserDTO.setRole("ORGANIZER");
        updateUserDTO.setorganizationName("updated org");
        updateUserDTO.setDescription("updated description");
    }


    @Test
    void createUserSuccessForAttendee(){

        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User result = userService.createUser(user, "ATTENDEE");

        // Assert
        assertNotNull(result);
        assertEquals(UserRole.ATTENDEE, result.getRole());
        assertTrue(result.isActive());
        verify(userRepository, times(1)).save(user); //  it confirms that when creating a new attendee user, the code correctly saved the user to the repository exactly one time.
        verify(organizerDetailsService, never()).saveOrganizerDetails(any(User.class)); // This line verifies that the saveOrganizerDetails method on the organizerDetailsService mock was never called with any User object.
        assertNull(result.getPassword());
    }

    @Test
    void createUserSuccessForOrganizer() {

        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User result = userService.createUser(user, "ORGANIZER");

        // Assert
        assertNotNull(result);
        assertEquals(UserRole.ORGANIZER, result.getRole());
        assertEquals("xyz@gmail.com", result.getEmail());
        assertTrue(result.isActive());
        verify(userRepository, times(1)).save(user);
        verify(organizerDetailsService, times(1)).saveOrganizerDetails(user);
        assertNull(result.getPassword());
    }

    @Test
    void updateUserDataSuccessForAttendee(){

        // Arrange
        updateUserDTO.setRole("ATTENDEE");
        when(principal.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        // Act
        userService.updateUserData(updateUserDTO, principal);

        // Assert
        assertEquals(updateUserDTO.getName(), user.getName());
        assertEquals(updateUserDTO.getEmail(), user.getEmail());
        assertEquals(updateUserDTO.getPhoneNo(), user.getPhoneNo());
        verify(userRepository, times(1)).save(user);
        verify(organizerDetailsRepository, never()).save(any(OrganizerDetails.class));
    }

    @Test
    void updateUserSuccessForOrganizer() {

        // Arrange
        when(principal.getName()).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
        when(organizerDetailsRepository.findByUser(user)).thenReturn(organizerDetails);

        // Act
        userService.updateUserData(updateUserDTO, principal);

        // Assert
        assertEquals(updateUserDTO.getName(), user.getName());
        assertEquals(updateUserDTO.getEmail(), user.getEmail());
        assertEquals(updateUserDTO.getPhoneNo(), user.getPhoneNo());
        assertEquals(updateUserDTO.getDescription(), organizerDetails.getDescription());
        assertEquals(updateUserDTO.getorganizationName(), organizerDetails.getOrganizationName());
        verify(userRepository, times(1)).save(user);
        verify(organizerDetailsRepository, times(1)).save(organizerDetails);
    }
}
