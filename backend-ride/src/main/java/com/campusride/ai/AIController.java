package com.campusride.ai;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private static final Logger logger =
            LoggerFactory.getLogger(AIController.class);

    private final GeminiService geminiService;

    public AIController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody Map<String, String> request) {

        String message = request.get("message");

        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Please enter a message.")
            );
        }

        if (message.length() > 2000) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            "Message must be 2000 characters or fewer."
                    )
            );
        }

        try {
            String reply =
                    geminiService.generateResponse(message.trim());

            return ResponseEntity.ok(
                    Map.of("reply", reply)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Please enter a valid message.")
            );

        } catch (Exception e) {
            logger.error(
                    "CampusRide AI request failed: {}",
                    e.getMessage(),
                    e
            );

            return ResponseEntity.status(
                    HttpStatus.BAD_GATEWAY
            ).body(
                    Map.of(
                            "error",
                            "The AI assistant is temporarily unavailable. Please try again."
                    )
            );
        }
    }
}