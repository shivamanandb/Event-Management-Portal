package com.example.backend.services;

import com.example.backend.models.User;

public interface UserService {
    
    // creating User
    public User createUser(User user, String role);
    
}
