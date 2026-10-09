package com.campusride.ai;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${GROQ_API_KEY:}")
    private String apiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private static final String MODEL =
            "llama-3.3-70b-versatile";

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    public String generateResponse(String message) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Groq API key is not configured."
            );
        }

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Message cannot be empty."
            );
        }

        try {
            var body = objectMapper.createObjectNode();

            body.put("model", MODEL);
            body.put("temperature", 0.7);
            body.put("max_tokens", 500);

            var messages = body.putArray("messages");

            messages.addObject()
                    .put("role", "system")
                    .put(
                            "content",
                            "You are CampusRide AI, a friendly assistant "
                            + "for a college carpooling application. "
                            + "Answer clearly and concisely. "
                            + "Help users understand ride booking, "
                            + "carpooling, and ride safety. "
                            + "Never claim to know live rides, bookings, "
                            + "or user information unless provided."
                    );

            messages.addObject()
                    .put("role", "user")
                    .put("content", message.trim());

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GROQ_URL))
                    .timeout(Duration.ofSeconds(45))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(
                            objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                String errorDetails =
                        "No error details returned.";

                try {
                    JsonNode errorRoot =
                            objectMapper.readTree(response.body());

                    JsonNode errorMessage =
                            errorRoot.at("/error/message");

                    if (!errorMessage.isMissingNode()
                            && !errorMessage.asText().isBlank()) {
                        errorDetails = errorMessage.asText();
                    }
                } catch (Exception ignored) {
                    // Keep the generic error if response is not JSON.
                }

                throw new IllegalStateException(
                        "Groq API returned HTTP "
                        + response.statusCode()
                        + ": " + errorDetails
                );
            }

            JsonNode root = objectMapper.readTree(response.body());

            JsonNode textNode = root.at(
                    "/choices/0/message/content"
            );

            if (textNode.isMissingNode()
                    || textNode.asText().isBlank()) {
                throw new IllegalStateException(
                        "Groq returned an empty response."
                );
            }

            return textNode.asText();

        } catch (IOException e) {
            throw new IllegalStateException(
                    "Could not communicate with Groq: "
                    + e.getMessage(),
                    e
            );
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            throw new IllegalStateException(
                    "Groq request was interrupted.",
                    e
            );
        }
    }
}