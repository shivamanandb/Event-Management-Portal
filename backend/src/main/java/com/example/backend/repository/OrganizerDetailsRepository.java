package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.OrganizerDetails;
import com.example.backend.models.User;

public interface OrganizerDetailsRepository extends JpaRepository <OrganizerDetails, Long>{
    
    public OrganizerDetails findByUser(User user);
}
