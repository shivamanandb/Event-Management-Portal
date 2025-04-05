package com.example.backend.configuration;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.backend.services.Implementation.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://127.0.0.1:5500/"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Use the CORS configuration
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/generate-token", "/user/create-user", "/events").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight requests
                    .requestMatchers(HttpMethod.POST, "/user/create-order").hasAuthority("ATTENDEE")
                    .requestMatchers(HttpMethod.PUT, "/user/update-order").hasAuthority("ATTENDEE")
                    .requestMatchers(HttpMethod.POST, "/bookings/create-booking/{paymentReferenceId}").hasAuthority("ATTENDEE")
                    .requestMatchers(HttpMethod.GET, "/bookings/all/{id}").hasAuthority("ATTENDEE")
                    .requestMatchers(HttpMethod.PUT, "/bookings/cancel/{bookingId}").hasAuthority("ATTENDEE")
                    .requestMatchers(HttpMethod.POST, "/events").hasAuthority("ATTENDEE")
                    .requestMatchers(HttpMethod.POST, "/events/create-event").hasAuthority("ORGANIZER")
                    .requestMatchers(HttpMethod.GET, "/events//getEnrolledPeople/{eventId}").hasAuthority("ORGANIZER")
                    .requestMatchers(HttpMethod.PUT, "/events/update/{id}").hasAuthority("ORGANIZER")
                    .requestMatchers(HttpMethod.GET, "/events/organizer/{userId}").hasAuthority("ORGANIZER")                    
                    .requestMatchers(HttpMethod.DELETE, "/events/{eventId}").hasAuthority("ORGANIZER")
                    .anyRequest().authenticated())
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}