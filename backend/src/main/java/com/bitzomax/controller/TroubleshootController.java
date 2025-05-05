package com.bitzomax.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@RestController
@RequestMapping("/api/admin/troubleshoot")
@CrossOrigin(origins = "*")
public class TroubleshootController {

    /**
     * Check if FFmpeg is installed and available in the system PATH
     */
    @GetMapping("/check-ffmpeg")
    public ResponseEntity<Map<String, Object>> checkFfmpeg() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Process process = Runtime.getRuntime().exec("ffmpeg -version");
            int exitCode = process.waitFor();
            
            // Read the output
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            
            // Check if FFmpeg is installed
            if (exitCode == 0) {
                response.put("installed", true);
                response.put("output", output.toString());
            } else {
                response.put("installed", false);
                response.put("error", "FFmpeg is not installed or not found in PATH");
            }
        } catch (IOException | InterruptedException e) {
            response.put("installed", false);
            response.put("error", "Error checking FFmpeg: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Attempt to download and install FFmpeg for Windows
     * Note: This is a simplified implementation primarily for Windows
     */
    @PostMapping("/install-ffmpeg")
    public ResponseEntity<Map<String, Object>> installFfmpeg() {
        Map<String, Object> response = new HashMap<>();
        StringBuilder log = new StringBuilder();
        
        try {
            // Create temp directory for download
            Path tempDir = Files.createTempDirectory("ffmpeg-install");
            log.append("Created temp directory: ").append(tempDir).append("\n");
            
            // Download FFmpeg
            String ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip";
            Path zipPath = tempDir.resolve("ffmpeg.zip");
            
            log.append("Downloading FFmpeg from: ").append(ffmpegUrl).append("\n");
            try (ReadableByteChannel readableByteChannel = Channels.newChannel(new URL(ffmpegUrl).openStream());
                 java.io.FileOutputStream fileOutputStream = new java.io.FileOutputStream(zipPath.toFile())) {
                fileOutputStream.getChannel().transferFrom(readableByteChannel, 0, Long.MAX_VALUE);
            }
            log.append("Downloaded FFmpeg to: ").append(zipPath).append("\n");
            
            // Extract the zip file
            Path extractPath = tempDir.resolve("extracted");
            Files.createDirectories(extractPath);
            log.append("Extracting to: ").append(extractPath).append("\n");
            
            try (ZipInputStream zipInputStream = new ZipInputStream(Files.newInputStream(zipPath))) {
                ZipEntry zipEntry;
                while ((zipEntry = zipInputStream.getNextEntry()) != null) {
                    Path entryPath = extractPath.resolve(zipEntry.getName());
                    
                    // Create parent directories if they don't exist
                    if (zipEntry.isDirectory()) {
                        Files.createDirectories(entryPath);
                    } else {
                        // Create parent directories if they don't exist
                        Files.createDirectories(entryPath.getParent());
                        
                        // Extract file
                        Files.copy(zipInputStream, entryPath, StandardCopyOption.REPLACE_EXISTING);
                    }
                }
            }
            log.append("Extraction completed\n");
            
            // Find the bin directory
            Path ffmpegBinDir = findBinDirectory(extractPath);
            if (ffmpegBinDir == null) {
                response.put("success", false);
                response.put("error", "Could not locate FFmpeg bin directory in the extracted files");
                log.append("Failed to locate bin directory\n");
                response.put("log", log.toString());
                return ResponseEntity.ok(response);
            }
            
            log.append("Found FFmpeg bin directory: ").append(ffmpegBinDir).append("\n");
            
            // Copy FFmpeg to a permanent location
            Path installDir = Paths.get(System.getProperty("user.home"), "ffmpeg");
            Files.createDirectories(installDir);
            log.append("Installing to: ").append(installDir).append("\n");
            
            copyDirectory(ffmpegBinDir, installDir);
            log.append("Files copied to installation directory\n");
            
            // Add to PATH (Windows specific)
            String os = System.getProperty("os.name").toLowerCase();
            if (os.contains("win")) {
                // For Windows, create a .bat file that sets the PATH
                Path batchFile = tempDir.resolve("add-ffmpeg-to-path.bat");
                String batchContent = String.format(
                        "@echo off\n" +
                        "echo Adding FFmpeg to PATH...\n" +
                        "setx PATH \"%%PATH%%;%s\"\n" +
                        "echo FFmpeg added to PATH. Please restart any open terminals.\n" +
                        "pause", 
                        installDir.toString());
                Files.write(batchFile, batchContent.getBytes());
                
                log.append("Created batch file to add FFmpeg to PATH: ").append(batchFile).append("\n");
                log.append("To complete installation, run the batch file as administrator.\n");
                
                response.put("batchFilePath", batchFile.toString());
            } else {
                // For Unix-like systems, suggest adding to PATH manually
                log.append("For Linux/Mac: Add the following to your ~/.bashrc or ~/.zshrc:\n");
                log.append("export PATH=\"$PATH:").append(installDir).append("\"\n");
            }
            
            response.put("success", true);
            response.put("installDir", installDir.toString());
            response.put("output", log.toString());
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("error", "Failed to install FFmpeg: " + e.getMessage());
            log.append("Error: ").append(e.getMessage());
            response.put("output", log.toString());
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Find the bin directory in the extracted FFmpeg files
     */
    private Path findBinDirectory(Path extractPath) throws IOException {
        // Look for a directory named "bin"
        try (java.util.stream.Stream<Path> paths = Files.walk(extractPath)) {
            return paths
                .filter(Files::isDirectory)
                .filter(p -> p.getFileName().toString().equalsIgnoreCase("bin"))
                .findFirst()
                .orElse(null);
        }
    }
    
    /**
     * Copy directory contents recursively
     */
    private void copyDirectory(Path source, Path target) throws IOException {
        try (java.util.stream.Stream<Path> stream = Files.walk(source)) {
            stream.forEach(sourcePath -> {
                try {
                    Path targetPath = target.resolve(source.relativize(sourcePath));
                    if (Files.isDirectory(sourcePath)) {
                        Files.createDirectories(targetPath);
                    } else {
                        Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
        }
    }
}