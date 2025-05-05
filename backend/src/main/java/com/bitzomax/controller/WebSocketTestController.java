package com.bitzomax.controller;

import com.bitzomax.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

/**
 * Controller for testing WebSocket functionality
 * This is for demonstration and testing purposes only
 */
@RestController
@RequestMapping("/test/websocket")
public class WebSocketTestController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    /**
     * Send a single progress update message
     */
    @PostMapping("/send-progress")
    public ResponseEntity<String> sendProgressUpdate(
            @RequestParam("fileId") String fileId,
            @RequestParam("percent") int percentComplete,
            @RequestParam("message") String message) {

        progressUpdateService.sendProgressUpdate(fileId, percentComplete, "processing", message);
        return ResponseEntity.ok("Progress update sent for file ID: " + fileId);
    }

    /**
     * Simulate a complete file conversion process with multiple progress updates
     */
    @PostMapping("/simulate-conversion")
    public ResponseEntity<String> simulateConversion(
            @RequestParam("fileId") String fileId,
            @RequestParam(value = "duration", defaultValue = "10") int durationSeconds) {

        // Start a background task to send progress updates
        CompletableFuture.runAsync(() -> {
            try {
                // Send initial progress update
                progressUpdateService.sendProgressUpdate(fileId, 0, "processing", "Starting conversion");
                Thread.sleep(500);

                // Calculate delay between updates
                int steps = 20;
                int delay = (durationSeconds * 1000) / steps;

                // Send progress updates
                for (int i = 1; i <= steps; i++) {
                    int progress = (i * 100) / steps;
                    String message = "Converting file... " + progress + "%";
                    progressUpdateService.sendProgressUpdate(fileId, progress, "processing", message);
                    Thread.sleep(delay);
                }

                // Send completion update
                Thread.sleep(500);
                progressUpdateService.sendCompletionUpdate(fileId, fileId + "-converted.webm");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                progressUpdateService.sendErrorUpdate(fileId, "Conversion interrupted");
            }
        });

        return ResponseEntity.ok("Simulating conversion for file ID: " + fileId);
    }

    /**
     * Simulate an error during file conversion
     */
    @PostMapping("/simulate-error")
    public ResponseEntity<String> simulateError(
            @RequestParam("fileId") String fileId,
            @RequestParam("message") String errorMessage) {

        // Start a background task to simulate a failed conversion
        CompletableFuture.runAsync(() -> {
            try {
                // Send initial progress updates
                progressUpdateService.sendProgressUpdate(fileId, 0, "processing", "Starting conversion");
                Thread.sleep(500);

                progressUpdateService.sendProgressUpdate(fileId, 30, "processing", "Processing...");
                Thread.sleep(1000);

                progressUpdateService.sendProgressUpdate(fileId, 45, "processing", "Converting audio...");
                Thread.sleep(800);

                // Send error update after some progress
                progressUpdateService.sendErrorUpdate(fileId, errorMessage);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        return ResponseEntity.ok("Simulating error for file ID: " + fileId);
    }
}