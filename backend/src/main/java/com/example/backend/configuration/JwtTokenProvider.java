package com.example.backend.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public Authentication getAuthentication(String token) {
        
        // Extract username from token
        String username = jwtUtils.extractUsername(token);
        
        // Extract roles from token
        List<String> roles = jwtUtils.extractRoles(token);
        
        // Convert roles to Spring Security authorities
        List<GrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        
        // Create authenticated user with authorities
        return new UsernamePasswordAuthenticationToken(username, "", authorities);
    }
}