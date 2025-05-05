package com.bitzomax.model;

/**
 * Model class representing a progress update during file conversion.
 * This is used for WebSocket communication.
 */
public class ConversionProgress {
    
    private String fileId;
    private int percentComplete;
    private String status; // "processing", "complete", "error"
    private String message;
    private String resultFile; // Only set when status is "complete"
    
    public ConversionProgress() {
        // Required empty constructor for Jackson serialization
    }
    
    public ConversionProgress(String fileId, int percentComplete, String status, String message) {
        this.fileId = fileId;
        this.percentComplete = percentComplete;
        this.status = status;
        this.message = message;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public int getPercentComplete() {
        return percentComplete;
    }

    public void setPercentComplete(int percentComplete) {
        this.percentComplete = percentComplete;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResultFile() {
        return resultFile;
    }

    public void setResultFile(String resultFile) {
        this.resultFile = resultFile;
    }
    
    @Override
    public String toString() {
        return "ConversionProgress{" +
                "fileId='" + fileId + '\'' +
                ", percentComplete=" + percentComplete +
                ", status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", resultFile='" + resultFile + '\'' +
                '}';
    }
}