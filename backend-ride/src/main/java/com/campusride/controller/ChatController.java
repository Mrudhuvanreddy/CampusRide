package com.campusride.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusride.dto.ChatMessageRequest;
import com.campusride.dto.ChatMessageResponse;
import com.campusride.entity.ChatMessage;
import com.campusride.entity.Ride;
import com.campusride.entity.RideBookingRequest;
import com.campusride.entity.User;
import com.campusride.repository.ChatMessageRepository;
import com.campusride.repository.RideBookingRequestRepository;
import com.campusride.repository.RideRepository;
import com.campusride.repository.UserRepository;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final RideRepository rideRepository;
    private final RideBookingRequestRepository requestRepository;
    private final UserRepository userRepository;

    public ChatController(
            ChatMessageRepository chatMessageRepository,
            RideRepository rideRepository,
            RideBookingRequestRepository requestRepository,
            UserRepository userRepository) {

        this.chatMessageRepository = chatMessageRepository;
        this.rideRepository = rideRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // GET CHAT MESSAGES
    // DRIVER OR ACCEPTED PASSENGER ONLY
    // ==========================================

    @GetMapping("/{rideId}")
    public List<ChatMessageResponse> getMessages(
            @PathVariable Long rideId,
            Authentication authentication) {

        User user = getUser(authentication);

        Ride ride = getRide(rideId);

        checkAccess(ride, user);

        return chatMessageRepository
                .findByRideOrderBySentAtAsc(ride)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ==========================================
    // SEND CHAT MESSAGE
    // DRIVER OR ACCEPTED PASSENGER ONLY
    // ==========================================

    @PostMapping("/{rideId}")
    public ChatMessageResponse sendMessage(
            @PathVariable Long rideId,
            @RequestBody ChatMessageRequest messageRequest,
            Authentication authentication) {

        User user = getUser(authentication);

        Ride ride = getRide(rideId);

        checkAccess(ride, user);

        if (messageRequest.getMessage() == null
                || messageRequest.getMessage().trim().isEmpty()) {

            throw new RuntimeException(
                    "Message cannot be empty");
        }

        ChatMessage chatMessage =
                new ChatMessage();

        chatMessage.setRide(ride);
        chatMessage.setSender(user);
        chatMessage.setMessage(
                messageRequest.getMessage().trim()
        );
        chatMessage.setSentAt(
                LocalDateTime.now()
        );

        ChatMessage savedMessage =
                chatMessageRepository.save(chatMessage);

        return convertToResponse(savedMessage);
    }

    // ==========================================
    // GET CURRENT USER
    // ==========================================

    private User getUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }

    // ==========================================
    // GET RIDE
    // ==========================================

    private Ride getRide(Long rideId) {

        return rideRepository
                .findById(rideId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ride not found"));
    }

    // ==========================================
    // CHECK CHAT ACCESS
    // ==========================================

    private void checkAccess(
            Ride ride,
            User user) {

        // Driver always has access to their own ride
        boolean isDriver =
                ride.getDriver()
                        .getId()
                        .equals(user.getId());

        if (isDriver) {
            return;
        }

        // Passenger must have an ACCEPTED request
        RideBookingRequest request =
                requestRepository
                        .findByRideAndPassenger(
                                ride,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You are not part of this ride"));

        if (!"ACCEPTED".equals(request.getStatus())) {
            throw new RuntimeException(
                    "Chat is available only after your ride request is accepted");
        }
    }

    // ==========================================
    // CONVERT ENTITY TO RESPONSE
    // ==========================================

    private ChatMessageResponse convertToResponse(
            ChatMessage message) {

        return new ChatMessageResponse(
                message.getId(),
                message.getRide().getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getMessage(),
                message.getSentAt()
        );
    }
}