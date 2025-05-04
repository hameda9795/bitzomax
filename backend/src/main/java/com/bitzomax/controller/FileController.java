package com.bitzomax.controller;

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

    @GetMapping("/song/{fileName:.+}")
    public ResponseEntity<Resource> downloadSongFile(@PathVariable String fileName, HttpServletRequest request) {
        return downloadFile(fileName, request, fileStorageService.loadSongAsResource(fileName));
    }

    @GetMapping("/cover/{fileName:.+}")
    public ResponseEntity<Resource> downloadCoverFile(@PathVariable String fileName, HttpServletRequest request) {
        return downloadFile(fileName, request, fileStorageService.loadCoverArtAsResource(fileName));
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