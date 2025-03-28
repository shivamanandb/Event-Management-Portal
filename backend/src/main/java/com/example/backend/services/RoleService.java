package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.models.Role;
import com.example.backend.repository.RoleRepository;

import jakarta.annotation.PostConstruct;

@Service
public class RoleService {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @PostConstruct
    public void initRoles() {
        createRoleIfNotExists("ORGANIZER");
        createRoleIfNotExists("ATTENDEE");
    }
    
    private void createRoleIfNotExists(String roleName) {
        if (!roleRepository.existsByName(roleName)) {
            Role role = new Role(roleName);
            roleRepository.save(role);
        }
    }
}