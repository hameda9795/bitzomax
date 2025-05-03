package com.bitzomax.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path songStorageLocation;
    private final Path coverArtStorageLocation;

    public FileStorageService(
            @Value("${file.upload.songs}") String songUploadDir,
            @Value("${file.upload.covers}") String coverUploadDir) {
        
        this.songStorageLocation = Paths.get(songUploadDir).toAbsolutePath().normalize();
        this.coverArtStorageLocation = Paths.get(coverUploadDir).toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.songStorageLocation);
            Files.createDirectories(this.coverArtStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directories", ex);
        }
    }

    public String storeSongFile(MultipartFile file) {
        return storeFile(file, this.songStorageLocation);
    }

    public String storeCoverArtFile(MultipartFile file) {
        return storeFile(file, this.coverArtStorageLocation);
    }

    private String storeFile(MultipartFile file, Path storageLocation) {
        // Normalize file name
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Check if the filename contains invalid characters
            if (originalFilename.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + originalFilename);
            }
            
            // Generate unique file name to prevent overwriting
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Copy file to the target location
            Path targetLocation = storageLocation.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            return newFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename, ex);
        }
    }

    public Resource loadSongAsResource(String filename) {
        return loadFileAsResource(filename, this.songStorageLocation);
    }

    public Resource loadCoverArtAsResource(String filename) {
        return loadFileAsResource(filename, this.coverArtStorageLocation);
    }

    private Resource loadFileAsResource(String filename, Path storageLocation) {
        try {
            Path filePath = storageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + filename, ex);
        }
    }
}