package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.User;

public interface UserRepository extends JpaRepository<User, Long>{
    
    // public User findByUsername(String username);
    public User findByEmail(String email);
}
