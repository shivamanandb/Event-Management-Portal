package com.example.backend.services.Implementation;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.DTOs.UpdateUserDTO;
import com.example.backend.models.OrganizerDetails;
import com.example.backend.models.User;
import com.example.backend.models.UserRole;
import com.example.backend.repository.OrganizerDetailsRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizerDetailsServiceImpl organizerDetailsService;

    @Autowired
    private OrganizerDetailsRepository organizerDetailsRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // creating User
    @Override
    public User createUser(User user, String role) {
        User localUser = this.userRepository.findByEmail(user.getEmail());
        System.out.println("User organization: " + user.getOrganizationName());
        System.out.println("Role description: " + user.getDescription());
        try {
            if (localUser != null) {
                System.out.println("User is already there");
                throw new Exception("User already present!!");
            }

            // Check if email already exists
            User userByEmail = this.userRepository.findByEmail(user.getEmail());
            if (userByEmail != null) {
                throw new Exception("Email is already registered!");
            }

            // Encode password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setPassword(user.getPassword());

            // Set active status
            user.setActive(true);

            // Set user role
            if(role.toUpperCase().equals("ATTENDEE")){
                user.setRole(UserRole.ATTENDEE);
            }else{
                user.setRole(UserRole.ORGANIZER);
            }

            // Save user
            localUser = this.userRepository.save(user);

            if(role.toUpperCase().equals("ORGANIZER")){
                organizerDetailsService.saveOrganizerDetails(user);
            }

            // I want to remove password from returned user object for security
            localUser.setPassword(null);

            return localUser;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }

    @Override
    public void updateUserData(UpdateUserDTO updateUserData, Principal principal) {
        
        User user = this.userRepository.findByEmail(principal.getName());

        user.setName(updateUserData.getName());
        user.setEmail(updateUserData.getEmail());
        user.setPhoneNo(updateUserData.getPhoneNo());

        if(updateUserData.getRole().equals("ORGANIZER")){
            
            OrganizerDetails organizerDetails = this.organizerDetailsRepository.findByUser(user);
            organizerDetails.setDescription(updateUserData.getDescription());
            organizerDetails.setOrganizationName(updateUserData.getorganizationName());
            this.organizerDetailsRepository.save(organizerDetails);
        }

        this.userRepository.save(user);
    }

}
