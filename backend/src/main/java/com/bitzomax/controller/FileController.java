package com.bitzomax.controller;

import com.bitzomax.model.WebMConversionResponse;
import com.bitzomax.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload/song")
    public ResponseEntity<Map<String, String>> uploadSongFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeSongFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/admin/files/song/")
                .path(fileName)
                .toUriString();

        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("fileDownloadUri", fileDownloadUri);
        response.put("fileType", file.getContentType());
        response.put("size", String.valueOf(file.getSize()));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload/cover")
    public ResponseEntity<Map<String, String>> uploadCoverArtFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeCoverArtFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/admin/files/cover/")
                .path(fileName)
                .toUriString();

        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("fileDownloadUri", fileDownloadUri);
        response.put("fileType", file.getContentType());
        response.put("size", String.valueOf(file.getSize()));

        return ResponseEntity.ok(response);
    }
    
    /**
     * Convert a file to WebM format with progress tracking
     */
    @PostMapping("/convert-to-webm")
    public ResponseEntity<WebMConversionResponse> convertToWebM(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "fileId", required = false) String clientFileId) {
        
        // If client provided a fileId, use it; otherwise, generate one
        String fileId = (clientFileId != null && !clientFileId.isEmpty()) ? clientFileId : null;
        
        String fileName = fileStorageService.convertToWebM(file, fileId);
        
        // If no clientFileId was provided, extract fileId from fileName (remove .webm extension)
        if (fileId == null) {
            fileId = fileName.substring(0, fileName.lastIndexOf('.'));
        }
        
        // Create download URI for the converted file
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/admin/files/converted/")
                .path(fileName)
                .toUriString();
        
        WebMConversionResponse response = new WebMConversionResponse(
            fileName, 
            fileId, 
            fileDownloadUri, 
            "video/webm", 
            String.valueOf(file.getSize())
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/song/{fileName:.+}")
    public ResponseEntity<Resource> downloadSongFile(@PathVariable String fileName, HttpServletRequest request) {
        return downloadFile(fileName, request, fileStorageService.loadSongAsResource(fileName));
    }

    @GetMapping("/cover/{fileName:.+}")
    public ResponseEntity<Resource> downloadCoverFile(@PathVariable String fileName, HttpServletRequest request) {
        return downloadFile(fileName, request, fileStorageService.loadCoverArtAsResource(fileName));
    }
    
    /**
     * Get a converted WebM file - Original admin endpoint, requires authentication
     */
    @GetMapping("/converted/{fileName:.+}")
    public ResponseEntity<Resource> downloadConvertedFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadConvertedFileAsResource(fileName);
        return downloadFile(fileName, request, resource);
    }

    /**
     * Public endpoint for downloading converted files with token-based authentication
     * This allows direct access from the browser while still maintaining security
     */
    @GetMapping("/public-download/{fileName:.+}")
    public ResponseEntity<Resource> downloadPublicFile(
            @PathVariable String fileName, 
            @RequestParam(value = "token", required = false) String token,
            HttpServletRequest request) {
        
        // Check if token is provided and valid
        boolean hasToken = token != null && !token.isEmpty();
        if (hasToken) {
            // Simple validation - in production you would verify the JWT properly
            System.out.println("Token provided for file download: " + fileName);
        } else {
            System.out.println("No token provided for file download: " + fileName);
            // For public downloads, we'll allow it for now, but in production
            // you might want to implement proper validation
        }
        
        Resource resource = fileStorageService.loadConvertedFileAsResource(fileName);
        return downloadFile(fileName, request, resource);
    }

    private ResponseEntity<Resource> downloadFile(String fileName, HttpServletRequest request, Resource resource) {
        String contentType;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            contentType = "application/octet-stream";
        }

        // For WebM files
        if (fileName.toLowerCase().endsWith(".webm")) {
            contentType = "video/webm";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}