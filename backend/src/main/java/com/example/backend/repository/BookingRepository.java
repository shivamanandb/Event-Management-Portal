package com.example.backend.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.models.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Set<Booking> findByUserId(Long userId);

    List<Booking> findByEventId(Long eventId);

    @Query(value = "SELECT b.* FROM public.bookings b " +
            "LEFT JOIN public.events e ON b.event_id = e.id " +
            "WHERE e.organizer_details_id = :organizerId " +
            "AND b.event_id = :eventId", nativeQuery = true)
    List<Booking> findBookingsByOrganizerAndEvent(
            @Param("organizerId") Long organizerId,
            @Param("eventId") Long eventId);

    void deleteByEventId(Long id);

}

// Native Query: Using nativeQuery = true to execute PostgreSQL-specific SQL.   