package com.example.backend.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;       
import com.example.backend.models.OrganizerDetails;
import com.example.backend.repository.OrganizerDetailsRepository;

import com.example.backend.configuration.JwtUtils;
import com.example.backend.models.JwtRequest;
import com.example.backend.models.JwtResponse;
import com.example.backend.models.User;
import com.example.backend.services.Implementation.UserDetailsServiceImpl;

@RestController
public class AuthenticateController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private OrganizerDetailsRepository organizerDetailsRepository;
    
    @Autowired
    private JwtUtils jwtUtils;

    // generate token
    @PostMapping("/generate-token")
    public ResponseEntity<?> generateToken(@RequestBody JwtRequest jwtRequest) throws Exception {
        try {

            authenticate(jwtRequest.getEmail(), jwtRequest.getPassword());
            
        } catch (UsernameNotFoundException e) {

            e.printStackTrace();
            throw new Exception("User not found");
        }

        /////// authenticate
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(jwtRequest.getEmail());
        String token = this.jwtUtils.generateToken(userDetails);
        System.out.println("Token: "+ token);
        return ResponseEntity.ok(new JwtResponse(token));
    }
    
    private void authenticate(String email, String password) throws Exception {

        try {

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        } catch(DisabledException e) {
            throw new Exception("User Disabled");
        } catch(BadCredentialsException e) {
            throw new Exception("Invalid Credentials "+ e.getMessage());
        }
    }

    @GetMapping("/current-user")
    public User getCurrentUser(Principal principal) {

        User user = ((User)this.userDetailsService.loadUserByUsername(principal.getName()));

        // save organization into user
        OrganizerDetails organizerDetails = this.organizerDetailsRepository.findByUser(user);
        if(organizerDetails != null){
            user.setOrganizationName(organizerDetails.getOrganizationName());
            user.setDescription(organizerDetails.getDescription());
            user.setOrganizerId(organizerDetails.getId());
        }
        
        // password set to null
        user.setPassword(null);
        return user;
    }
}
