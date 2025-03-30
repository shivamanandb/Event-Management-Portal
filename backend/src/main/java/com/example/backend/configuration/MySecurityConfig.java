package com.example.backend.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.backend.services.Implementation.UserDetailsServiceImpl;

@Configuration
public class MySecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration builder) throws Exception {
        return builder.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider getAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(this.userDetailsServiceImpl);
        daoAuthenticationProvider.setPasswordEncoder(this.passwordEncoder());

        return daoAuthenticationProvider;
    }

    // configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                .authorizeHttpRequests(authorize -> authorize
                    
                    .requestMatchers("/generate-token","/user/create-user","/events").permitAll()
                    // .requestMatchers(HttpMethod.POST, "/user/create-order").hasRole("ATTENDEE")
                    // .requestMatchers(HttpMethod.PUT, "/user/update-order").hasRole("ATTENDEE")
                    // .requestMatchers(HttpMethod.POST, "/bookings/create-booking/{paymentReferenceId}").hasRole("ORGANIZER")
                    // .requestMatchers(HttpMethod.GET, "/bookings/all/{id}").hasRole("ATTENDEE")
                    // .requestMatchers(HttpMethod.PUT, "bookings/cancel/{bookingId}").hasRole("ATTENDEE")
                    // .requestMatchers(HttpMethod.POST, "/events/create-event").hasRole("ORGANIZER")
                    // .requestMatchers(HttpMethod.GET, "/events").hasRole("ATTENDEE")
                    // .requestMatchers(HttpMethod.GET , "/events/category/{category}").hasRole("ATTENDEE")
                    // .requestMatchers(HttpMethod.PUT, "/events/update/{id}").hasRole("ORGANIZER")
                    // .requestMatchers(HttpMethod.GET, "/events/organizer/{userId}").hasRole("ORGANIZER")
                    // .requestMatchers(HttpMethod.DELETE, "/events/{eventId}").hasRole("ORGANIZER")
                    // .requestMatchers(HttpMethod.PUT, "/eventDetails/save-event").hasRole("ORGANIZER")
                    // .requestMatchers(HttpMethod.GET, "/eventDetails/get-events/{id}").hasRole("ORGANIZER")
                    .requestMatchers(HttpMethod.OPTIONS).permitAll()
                    .anyRequest().authenticated())

                    .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(unauthorizedHandler))
                    
                    .sessionManagement((session) -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();

    }
}
