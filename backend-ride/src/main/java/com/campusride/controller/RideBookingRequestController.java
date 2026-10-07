package com.campusride.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusride.dto.BookingRequestResponse;
import com.campusride.entity.Ride;
import com.campusride.entity.RideBookingRequest;
import com.campusride.entity.User;
import com.campusride.repository.RideBookingRequestRepository;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;

@RestController
@RequestMapping("/api/requests")
public class RideBookingRequestController {

    private final RideBookingRequestRepository requestRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideBookingRequestController(
            RideBookingRequestRepository requestRepository,
            RideRepository rideRepository,
            UserRepository userRepository) {

        this.requestRepository = requestRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // REQUEST TO JOIN A RIDE
    // ==========================================

    @PostMapping("/{rideId}")
    public BookingRequestResponse requestRide(
            @PathVariable Long rideId,
            Authentication authentication) {

        String email = authentication.getName();

        User passenger = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Ride ride = rideRepository
                .findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        // Driver cannot request their own ride
        if (ride.getDriver().getId().equals(passenger.getId())) {
            throw new RuntimeException(
                    "You cannot request your own ride");
        }

        // Ride must be active
        if (!"ACTIVE".equals(ride.getStatus())) {
            throw new RuntimeException(
                    "This ride is not active");
        }

        // Ride must have available seats
        if (ride.getAvailableSeats() <= 0) {
            throw new RuntimeException(
                    "No seats are available");
        }

        // Check duplicate request
        boolean alreadyRequested =
                requestRepository
                        .findByRideAndPassenger(ride, passenger)
                        .isPresent();

        if (alreadyRequested) {
            throw new RuntimeException(
                    "You have already requested this ride");
        }

        RideBookingRequest request =
                new RideBookingRequest();

        request.setRide(ride);
        request.setPassenger(passenger);
        request.setStatus("PENDING");

        RideBookingRequest savedRequest =
                requestRepository.save(request);

        return convertToResponse(savedRequest);
    }

    // ==========================================
    // GET MY REQUESTS
    // ==========================================

    @GetMapping("/my-requests")
    public List<BookingRequestResponse> getMyRequests(
            Authentication authentication) {

        String email = authentication.getName();

        User passenger = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<RideBookingRequest> requests =
                requestRepository.findByPassenger(passenger);

        return requests.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ==========================================
    // GET REQUESTS FOR A RIDE
    // DRIVER ONLY
    // ==========================================

    @GetMapping("/ride/{rideId}")
    public List<BookingRequestResponse> getRideRequests(
            @PathVariable Long rideId,
            Authentication authentication) {

        String email = authentication.getName();

        User driver = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Ride ride = rideRepository
                .findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        // Only the driver who owns the ride can see requests
        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException(
                    "You are not the driver of this ride");
        }

        List<RideBookingRequest> requests =
                requestRepository.findByRide(ride);

        return requests.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ==========================================
    // ACCEPT REQUEST
    // DRIVER ONLY
    // ==========================================

    @PutMapping("/{requestId}/accept")
    public BookingRequestResponse acceptRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        String email = authentication.getName();

        User driver = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        RideBookingRequest request =
                requestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"));

        Ride ride = request.getRide();

        // Only the ride owner can accept
        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException(
                    "You are not the driver of this ride");
        }

        // Request must still be pending
        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException(
                    "This request has already been processed");
        }

        // Check available seats
        if (ride.getAvailableSeats() <= 0) {
            throw new RuntimeException(
                    "No seats are available");
        }

        // Accept request
        request.setStatus("ACCEPTED");

        // Reduce available seats
        ride.setAvailableSeats(
                ride.getAvailableSeats() - 1
        );

        // If no seats remain, close the ride
        if (ride.getAvailableSeats() == 0) {
            ride.setStatus("FULL");
        }

        rideRepository.save(ride);

        RideBookingRequest updatedRequest =
                requestRepository.save(request);

        return convertToResponse(updatedRequest);
    }

    // ==========================================
    // REJECT REQUEST
    // DRIVER ONLY
    // ==========================================

    @PutMapping("/{requestId}/reject")
    public BookingRequestResponse rejectRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        String email = authentication.getName();

        User driver = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        RideBookingRequest request =
                requestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Request not found"));

        Ride ride = request.getRide();

        // Only the ride owner can reject
        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException(
                    "You are not the driver of this ride");
        }

        // Request must still be pending
        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException(
                    "This request has already been processed");
        }

        // Reject request
        request.setStatus("REJECTED");

        RideBookingRequest updatedRequest =
                requestRepository.save(request);

        return convertToResponse(updatedRequest);
    }

    // ==========================================
    // GET EXPENSE SHARE
    // DRIVER OR ACCEPTED PASSENGER ONLY
    // ==========================================

    @GetMapping("/{rideId}/expense")
    public String getExpenseShare(
            @PathVariable Long rideId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Ride ride = rideRepository
                .findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException("Ride not found"));

        // Check if current user is the driver
        boolean isDriver =
                ride.getDriver().getId().equals(user.getId());

        // Check if current user is an accepted passenger
        boolean isAcceptedPassenger =
                requestRepository
                        .findByRideAndPassenger(ride, user)
                        .map(request ->
                                "ACCEPTED".equals(
                                        request.getStatus()))
                        .orElse(false);

        // Only ride participants can see expense details
        if (!isDriver && !isAcceptedPassenger) {
            throw new RuntimeException(
                    "You are not part of this ride");
        }

        // Count accepted passengers
        long acceptedPassengers =
                requestRepository
                        .findByRideAndStatus(
                                ride,
                                "ACCEPTED")
                        .size();

        // Driver + accepted passengers
        long totalPeople =
                acceptedPassengers + 1;

        // Calculate share per person
        double share =
                ride.getTotalExpense() / totalPeople;

        return String.format(
                "{\"totalExpense\":%.2f,\"totalPeople\":%d,\"sharePerPerson\":%.2f}",
                ride.getTotalExpense(),
                totalPeople,
                share
        );
    }

    // ==========================================
    // CONVERT ENTITY TO RESPONSE
    // ==========================================

    private BookingRequestResponse convertToResponse(
            RideBookingRequest request) {

        return new BookingRequestResponse(
                request.getId(),
                request.getRide().getId(),
                request.getPassenger().getId(),
                request.getPassenger().getName(),
                request.getPassenger().getEmail(),
                request.getStatus()
        );
    }
}