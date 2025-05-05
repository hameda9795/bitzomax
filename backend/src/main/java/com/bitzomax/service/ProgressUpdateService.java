package com.bitzomax.service;

import com.bitzomax.model.ConversionProgress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for sending WebSocket progress updates during file conversion
 */
@Service
public class ProgressUpdateService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProgressUpdateService.class);
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    /**
     * Send a progress update for a file conversion
     * 
     * @param fileId The ID of the file being converted
     * @param percentComplete The percentage of completion (0-100)
     * @param status The current status (processing, complete, error)
     * @param message Additional message about the progress
     */
    public void sendProgressUpdate(String fileId, int percentComplete, String status, String message) {
        try {
            String destination = "/topic/conversion/" + fileId;
            
            ConversionProgress update = new ConversionProgress(fileId, percentComplete, status, message);
            
            logger.info("Sending progress update to {}: {}% - {}", destination, percentComplete, message);
            messagingTemplate.convertAndSend(destination, update);
        } catch (Exception e) {
            logger.error("Failed to send progress update for file {}: {}", fileId, e.getMessage(), e);
        }
    }
    
    /**
     * Send a completion update for a file conversion
     * 
     * @param fileId The ID of the file that was converted
     * @param resultFile The path or name of the resulting file
     */
    public void sendCompletionUpdate(String fileId, String resultFile) {
        try {
            String destination = "/topic/conversion/" + fileId;
            
            ConversionProgress update = new ConversionProgress(fileId, 100, "complete", "Conversion completed successfully");
            update.setResultFile(resultFile);
            
            logger.info("Sending completion update to {}: {}", destination, resultFile);
            messagingTemplate.convertAndSend(destination, update);
        } catch (Exception e) {
            logger.error("Failed to send completion update for file {}: {}", fileId, e.getMessage(), e);
        }
    }
    
    /**
     * Send an error update for a file conversion
     * 
     * @param fileId The ID of the file that encountered an error
     * @param errorMessage The error message
     */
    public void sendErrorUpdate(String fileId, String errorMessage) {
        try {
            String destination = "/topic/conversion/" + fileId;
            
            ConversionProgress update = new ConversionProgress(fileId, 0, "error", errorMessage);
            
            logger.info("Sending error update to {}: {}", destination, errorMessage);
            messagingTemplate.convertAndSend(destination, update);
        } catch (Exception e) {
            logger.error("Failed to send error update for file {}: {}", fileId, e.getMessage(), e);
        }
    }
}