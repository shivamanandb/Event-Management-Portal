package com.example.backend.services;

import java.security.Principal;

import org.springframework.http.ResponseEntity;

import com.example.backend.DTOs.UpdateUserDTO;
import com.example.backend.models.User;

public interface UserService {
    
    // creating User
    public User createUser(User user, String role);

    public void updateUserData(UpdateUserDTO updateUserData, Principal principal);
    
}
