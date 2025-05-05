package com.bitzomax.model;

/**
 * Response object for WebM conversion API
 */
public class WebMConversionResponse {
    private String fileName;
    private String fileId;
    private String fileDownloadUri;
    private String fileType;
    private String size;
    
    public WebMConversionResponse() {
        // Default constructor for JSON serialization
    }
    
    public WebMConversionResponse(String fileName, String fileId, String fileDownloadUri, String fileType, String size) {
        this.fileName = fileName;
        this.fileId = fileId;
        this.fileDownloadUri = fileDownloadUri;
        this.fileType = fileType;
        this.size = size;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFileId() {
        return fileId;
    }
    
    public void setFileId(String fileId) {
        this.fileId = fileId;
    }
    
    public String getFileDownloadUri() {
        return fileDownloadUri;
    }
    
    public void setFileDownloadUri(String fileDownloadUri) {
        this.fileDownloadUri = fileDownloadUri;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public String getSize() {
        return size;
    }
    
    public void setSize(String size) {
        this.size = size;
    }
}
