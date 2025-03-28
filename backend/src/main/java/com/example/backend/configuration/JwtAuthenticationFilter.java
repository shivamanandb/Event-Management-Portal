package com.example.backend.configuration;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String requestTokenHeader = request.getHeader("Authorization");   
        System.out.println(requestTokenHeader);
        String email = null;
        String jwtToken = null;

        if(requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {

            // token valid
            try {

                jwtToken = requestTokenHeader.substring(7);

                try {
                    email = this.jwtUtil.extractUsername(jwtToken);
                    
                                        
                } catch (ExpiredJwtException e) {
                    e.printStackTrace();
                    System.out.println("JWT token has expired");
                
                } catch(Exception e) {
                    e.printStackTrace();
                    System.out.println("error");
                }

            } catch(Exception e) {
                e.printStackTrace();
            }
        } else {

            System.out.println("Invalid token, not start with bearer string");
        }

        // validated
        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            final UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

            if(this.jwtUtil.validateToken(jwtToken, userDetails)) {

                // token is valid

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        else {
            System.out.println("token is not valid");
        }

        filterChain.doFilter(request, response);
    }
    
}
