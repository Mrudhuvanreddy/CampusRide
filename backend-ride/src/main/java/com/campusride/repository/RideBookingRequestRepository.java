package com.campusride.repository;

import com.campusride.entity.Ride;
import com.campusride.entity.RideBookingRequest;
import com.campusride.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RideBookingRequestRepository
        extends JpaRepository<RideBookingRequest, Long> {

    List<RideBookingRequest> findByPassenger(User passenger);

    List<RideBookingRequest> findByRide(Ride ride);

    Optional<RideBookingRequest> findByRideAndPassenger(
            Ride ride,
            User passenger
    );
}