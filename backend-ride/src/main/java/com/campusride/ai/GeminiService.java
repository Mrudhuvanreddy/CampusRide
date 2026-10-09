
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

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/"
            + "gemini-2.5-flash:generateContent";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GeminiService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    public String generateResponse(String message) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API key is not configured."
            );
        }

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Message cannot be empty."
            );
        }

        try {
            String prompt =
                    "You are CampusRide AI, a friendly assistant "
                    + "for a college carpooling application. "
                    + "Answer clearly and concisely. "
                    + "Help users understand ride booking, "
                    + "carpooling, and ride safety. "
                    + "Never claim to know live rides, bookings, "
                    + "or user information unless provided. "
                    + "User message: " + message;

            var body = objectMapper.createObjectNode();
            var contents = body.putArray("contents");
            var content = contents.addObject();
            var parts = content.putArray("parts");

            parts.addObject().put("text", prompt);

            var generationConfig =
                    body.putObject("generationConfig");

            generationConfig.put("temperature", 0.7);
            generationConfig.put("maxOutputTokens", 500);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_URL))
                    .timeout(Duration.ofSeconds(45))
                    .header("Content-Type", "application/json")
                    .header("x-goog-api-key", apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(
                            objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {
                throw new IllegalStateException(
                        "Gemini API returned HTTP "
                        + response.statusCode()
                );
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode textNode = root.at(
                    "/candidates/0/content/parts/0/text"
            );

            if (textNode.isMissingNode()
                    || textNode.asText().isBlank()) {
                throw new IllegalStateException(
                        "Gemini returned an empty response."
                );
            }

            return textNode.asText();

        } catch (IOException e) {
            throw new IllegalStateException(
                    "Could not communicate with Gemini.", e
            );
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Gemini request was interrupted.", e
            );
        }
    }
}
