package com.example.backend.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.Booking;
import com.example.backend.models.Event;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Set<Booking> findByUserId(Long userId);
    
    @Query(value = "SELECT * FROM public.bookings WHERE event_id = :#{#event.id}", nativeQuery = true)
    Set<Booking> findBookingsByEvent(@Param("event") Event event);

    @Query(value = "SELECT b.* FROM public.bookings b " +
            "LEFT JOIN public.events e ON b.event_id = e.id " +
            "WHERE e.organizer_details_id = :organizerId " +
            "AND b.event_id = :eventId", nativeQuery = true)
    Set<Booking> findBookingsByOrganizerAndEvent(
            @Param("organizerId") Long organizerId,
            @Param("eventId") Long eventId);

    @Query(value = "DELETE FROM public.bookings where event_id = :eventId", nativeQuery = true)        
    void deleteByEventId(@Param("eventId") Long eventId);

}

// Native Query: Using nativeQuery = true to execute PostgreSQL-specific SQL.   