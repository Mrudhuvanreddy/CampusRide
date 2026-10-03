package com.campusride.controller;

import com.campusride.dto.RideRequest;
import com.campusride.dto.RideResponse;
import com.campusride.entity.Ride;
import com.campusride.entity.User;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideController(
            RideRepository rideRepository,
            UserRepository userRepository) {

        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    // OFFER A RIDE
    @PostMapping
    public RideResponse createRide(
            @RequestBody RideRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User driver = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Ride ride = new Ride();

        ride.setDriver(driver);
        ride.setSource(request.getSource());
        ride.setDestination(request.getDestination());
        ride.setRideDate(request.getRideDate());
        ride.setRideTime(request.getRideTime());
        ride.setAvailableSeats(request.getAvailableSeats());
        ride.setStatus("ACTIVE");

        Ride savedRide = rideRepository.save(ride);

        return convertToResponse(savedRide);
    }

    // GET ALL RIDES
    @GetMapping
    public List<RideResponse> getAllRides() {

        List<Ride> rides = rideRepository.findAll();

        return rides.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // SEARCH RIDES
    @GetMapping("/search")
    public List<RideResponse> searchRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam LocalDate rideDate) {

        List<Ride> rides =
                rideRepository
                        .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndRideDate(
                                source,
                                destination,
                                rideDate
                        );

        return rides.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // CONVERT RIDE TO RESPONSE
    private RideResponse convertToResponse(Ride ride) {

        User driver = ride.getDriver();

        return new RideResponse(
                ride.getId(),
                driver.getId(),
                driver.getName(),
                driver.getEmail(),
                ride.getSource(),
                ride.getDestination(),
                ride.getRideDate(),
                ride.getRideTime(),
                ride.getAvailableSeats(),
                ride.getStatus()
        );
    }
}