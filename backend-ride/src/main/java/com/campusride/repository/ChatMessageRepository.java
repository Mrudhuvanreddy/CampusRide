package com.campusride.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusride.entity.ChatMessage;
import com.campusride.entity.Ride;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRideOrderBySentAtAsc(
            Ride ride
    );
}