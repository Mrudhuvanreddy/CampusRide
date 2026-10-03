package com.campusride.repository;

import com.campusride.entity.Ride;
import com.campusride.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByDriver(User driver);

    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndRideDate(
            String source,
            String destination,
            LocalDate rideDate
    );
}