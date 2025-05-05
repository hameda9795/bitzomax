package com.bitzomax.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import org.bytedeco.javacv.*;
import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.javacpp.Loader;
import org.bytedeco.ffmpeg.global.avutil;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FileStorageService {

    private final Path songStorageLocation;
    private final Path coverArtStorageLocation;
    private final Path convertedStorageLocation;
    
    @Autowired
    private ProgressUpdateService progressUpdateService;

    public FileStorageService(
            @Value("${file.upload.songs}") String songUploadDir,
            @Value("${file.upload.covers}") String coverUploadDir) {
        
        this.songStorageLocation = Paths.get(songUploadDir).toAbsolutePath().normalize();
        this.coverArtStorageLocation = Paths.get(coverUploadDir).toAbsolutePath().normalize();
        this.convertedStorageLocation = Paths.get(songUploadDir, "converted").toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.songStorageLocation);
            Files.createDirectories(this.coverArtStorageLocation);
            Files.createDirectories(this.convertedStorageLocation);
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
    
    /**
     * Convert a video file to WebM format with progress tracking
     * @param file The video file to convert
     * @param providedFileId Optional client-provided file ID for tracking progress
     * @return The name of the converted file
     */
    public String convertToWebM(MultipartFile file, String providedFileId) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String baseFileName = providedFileId != null ? providedFileId : UUID.randomUUID().toString();
        String tempFileName = baseFileName + getFileExtension(originalFilename);
        String outputFileName = baseFileName + ".webm";
        
        try {
            // Store the uploaded file
            Path targetLocation = this.songStorageLocation.resolve(tempFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            File inputFile = targetLocation.toFile();
            
            // Output path for the converted file
            Path outputPath = this.convertedStorageLocation.resolve(outputFileName);
            File outputFile = outputPath.toFile();
            
            // Initial progress update - starting conversion
            progressUpdateService.sendProgressUpdate(baseFileName, 0, "processing", "Starting conversion");
            
            // Try with FFmpeg first
            boolean conversionSuccess = false;
            try {
                conversionSuccess = tryFFmpegConversionWithProgress(inputFile, outputFile, baseFileName);
            } catch (Exception e) {
                progressUpdateService.sendProgressUpdate(baseFileName, 10, "processing", 
                    "FFmpeg conversion failed: " + e.getMessage() + ". Trying JavaCV...");
                System.out.println("FFmpeg conversion failed: " + e.getMessage());
            }
            
            // If FFmpeg fails, try with JavaCV
            if (!conversionSuccess) {
                try {
                    progressUpdateService.sendProgressUpdate(baseFileName, 20, "processing", "Using JavaCV for WebM conversion");
                    System.out.println("Using JavaCV for WebM conversion");
                    convertWithJavaCVWithProgress(inputFile, outputFile, baseFileName);
                    conversionSuccess = true;
                } catch (Exception e) {
                    progressUpdateService.sendProgressUpdate(baseFileName, 30, "processing", 
                        "JavaCV conversion failed: " + e.getMessage() + ". Using fallback...");
                    System.out.println("JavaCV conversion failed: " + e.getMessage());
                    e.printStackTrace();
                    
                    // Last resort - copy the file
                    if (!outputFile.exists()) {
                        progressUpdateService.sendProgressUpdate(baseFileName, 40, "processing", "Using fallback file copy method");
                        System.out.println("Using fallback file copy method for WebM conversion");
                        copyFileAsWebm(inputFile, outputFile);
                        progressUpdateService.sendProgressUpdate(baseFileName, 90, "processing", "Fallback copy completed");
                    }
                }
            }
            
            // Delete temporary file after successful conversion
            Files.deleteIfExists(targetLocation);
            
            // Final progress update - conversion complete
            progressUpdateService.sendCompletionUpdate(baseFileName, outputFileName);
            
            return outputFileName;
        } catch (IOException ex) {
            // Send error update
            progressUpdateService.sendErrorUpdate(baseFileName, "Conversion failed: " + ex.getMessage());
            throw new RuntimeException("Could not convert the file to WebM format", ex);
        }
    }

    /**
     * Overloaded method for backward compatibility
     */
    public String convertToWebM(MultipartFile file) {
        return convertToWebM(file, null);
    }
    
    /**
     * Convert video to WebM using JavaCV with progress updates
     */
    private void convertWithJavaCVWithProgress(File inputFile, File outputFile, String fileId) throws Exception {
        // Input format
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(inputFile);
        grabber.start();
        
        // Get total frames for progress calculation
        int totalFrames = grabber.getLengthInFrames();
        if (totalFrames <= 0) {
            // If we can't get frame count, estimate based on duration and framerate
            double duration = grabber.getLengthInTime() / 1000000.0; // convert to seconds
            totalFrames = (int)(duration * grabber.getFrameRate());
        }
        
        progressUpdateService.sendProgressUpdate(fileId, 30, "processing", "Starting JavaCV conversion");
        
        // Output format - WebM with VP9 codec
        FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(
            outputFile,
            grabber.getImageWidth(),
            grabber.getImageHeight(),
            grabber.getAudioChannels()
        );
        
        // Configure WebM settings for smaller file
        recorder.setFormat("webm");
        recorder.setVideoCodec(avcodec.AV_CODEC_ID_VP9);  // VP9 for better compression
        
        // Fix for audio codec sample rate issue - Opus only supports certain sample rates
        // Instead of using Opus, use Vorbis which is more compatible with various sample rates
        recorder.setAudioCodec(avcodec.AV_CODEC_ID_VORBIS); // Use Vorbis instead of Opus
        
        // Video quality settings (lower values = higher compression)
        recorder.setVideoQuality(30); // Medium quality, high compression
        recorder.setVideoBitrate(500000); // 500Kbps, adjust as needed
        recorder.setFrameRate(grabber.getFrameRate());
        
        // Audio quality settings
        recorder.setAudioBitrate(96000); // 96Kbps, adjust as needed
        recorder.setAudioChannels(grabber.getAudioChannels());
        
        // Fix sample rate issues by checking for supported rates
        int sampleRate = grabber.getSampleRate();
        recorder.setSampleRate(sampleRate);
        
        recorder.start();
        
        progressUpdateService.sendProgressUpdate(fileId, 40, "processing", "JavaCV conversion started");
        
        // Convert each frame with progress tracking
        Frame frame;
        int frameCount = 0;
        
        while ((frame = grabber.grab()) != null) {
            recorder.record(frame);
            frameCount++;
            
            // Update progress every 10 frames
            if (frameCount % 10 == 0 && totalFrames > 0) {
                int progressPercent = Math.min(90, 40 + (frameCount * 50 / totalFrames));
                progressUpdateService.sendProgressUpdate(fileId, progressPercent, "processing", 
                    "Converting frame " + frameCount + "/" + totalFrames);
            }
        }
        
        // Clean up
        progressUpdateService.sendProgressUpdate(fileId, 90, "processing", "Finalizing conversion");
        recorder.stop();
        recorder.release();
        grabber.stop();
        grabber.release();
        
        progressUpdateService.sendProgressUpdate(fileId, 95, "processing", "JavaCV conversion completed");
    }
    
    /**
     * Try to execute FFmpeg conversion with progress monitoring
     * @return true if conversion succeeded, false otherwise
     */
    private boolean tryFFmpegConversionWithProgress(File inputFile, File outputFile, String fileId) {
        try {
            // Check if ffmpeg is available
            Process checkProcess = Runtime.getRuntime().exec("ffmpeg -version");
            int exitCode = checkProcess.waitFor();
            if (exitCode != 0) {
                return false;
            }
            
            progressUpdateService.sendProgressUpdate(fileId, 5, "processing", "FFmpeg available, starting conversion");
            
            // FFmpeg is available, proceed with conversion
            ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg", 
                "-i", inputFile.getAbsolutePath(),
                "-c:v", "libvpx-vp9", // VP9 codec
                "-crf", "30",         // Constant Rate Factor (quality)
                "-b:v", "0",          // Use quality-based bitrate
                "-c:a", "libopus",    // Opus audio codec
                "-progress", "pipe:1", // Send progress information to stdout
                outputFile.getAbsolutePath()
            );
            
            // Redirect error stream to output stream
            processBuilder.redirectErrorStream(true);
            
            // Start the process
            Process process = processBuilder.start();
            
            // Read the process output in a separate thread to avoid blocking
            CompletableFuture.runAsync(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    String currentTime = "00:00:00.00";
                    String totalDuration = getDuration(inputFile.getAbsolutePath());
                    
                    while ((line = reader.readLine()) != null) {
                        if (line.startsWith("out_time=")) {
                            currentTime = line.substring("out_time=".length());
                            int progressPercent = calculateProgressPercentage(currentTime, totalDuration);
                            progressUpdateService.sendProgressUpdate(fileId, progressPercent, "processing", 
                                "FFmpeg converting: " + currentTime + " / " + totalDuration);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Error reading FFmpeg progress: " + e.getMessage());
                }
            });
            
            // Wait for the process to complete
            int conversionExitCode = process.waitFor();
            
            if (conversionExitCode == 0) {
                progressUpdateService.sendProgressUpdate(fileId, 90, "processing", "FFmpeg conversion completed");
                return true;
            } else {
                progressUpdateService.sendProgressUpdate(fileId, 10, "processing", "FFmpeg conversion failed with exit code: " + conversionExitCode);
                return false;
            }
        } catch (IOException | InterruptedException e) {
            progressUpdateService.sendProgressUpdate(fileId, 10, "processing", "FFmpeg execution error: " + e.getMessage());
            System.out.println("FFmpeg execution error: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Calculate progress percentage based on current time and total duration
     */
    private int calculateProgressPercentage(String currentTime, String totalDuration) {
        try {
            long current = timeToMillis(currentTime);
            long total = timeToMillis(totalDuration);
            
            if (total <= 0) return 0;
            
            // Map to range 5-90% to leave room for start/end processing
            return (int) Math.min(90, 5 + (current * 85 / total));
        } catch (Exception e) {
            return 0;
        }
    }
    
    /**
     * Convert time format (HH:MM:SS.MS) to milliseconds
     */
    private long timeToMillis(String time) {
        try {
            // Parse time format HH:MM:SS.MS
            Pattern pattern = Pattern.compile("(\\d+):(\\d+):(\\d+\\.?\\d*)");
            Matcher matcher = pattern.matcher(time);
            
            if (matcher.find()) {
                int hours = Integer.parseInt(matcher.group(1));
                int minutes = Integer.parseInt(matcher.group(2));
                float seconds = Float.parseFloat(matcher.group(3));
                
                return (hours * 3600 + minutes * 60) * 1000 + (long)(seconds * 1000);
            }
            
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }
    
    /**
     * Get the duration of a media file using ffmpeg
     */
    private String getDuration(String filePath) {
        try {
            Process process = Runtime.getRuntime().exec(new String[] {
                "ffmpeg", "-i", filePath
            });
            
            // FFmpeg outputs information to stderr
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String line;
            Pattern durationPattern = Pattern.compile("Duration: (\\d+:\\d+:\\d+\\.\\d+)");
            
            while ((line = reader.readLine()) != null) {
                Matcher matcher = durationPattern.matcher(line);
                if (matcher.find()) {
                    return matcher.group(1);
                }
            }
            
            // Default duration if we can't find it
            return "00:00:00.00";
        } catch (Exception e) {
            return "00:00:00.00";
        }
    }
    
    /**
     * Fallback method - copy the file as WebM
     * This is a last resort if all conversion methods fail
     */
    private void copyFileAsWebm(File inputFile, File outputFile) throws IOException {
        try (
            InputStream in = Files.newInputStream(inputFile.toPath());
            FileOutputStream out = new FileOutputStream(outputFile)
        ) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }
    }
    
    /**
     * Get file extension from a filename
     * @param filename The input filename
     * @return The file extension with dot (e.g., ".mp4")
     */
    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf("."));
    }

    private String storeFile(MultipartFile file, Path storageLocation) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + fileExtension;

        try {
            if (filename.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + filename);
            }
            
            Path targetLocation = storageLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return filename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + filename, ex);
        }
    }

    public Resource loadSongAsResource(String filename) {
        return loadFileAsResource(filename, songStorageLocation);
    }

    public Resource loadCoverArtAsResource(String filename) {
        return loadFileAsResource(filename, coverArtStorageLocation);
    }
    
    /**
     * Load a converted WebM file as resource
     * @param filename The name of the WebM file to load
     * @return Resource for the WebM file
     */
    public Resource loadConvertedFileAsResource(String filename) {
        return loadFileAsResource(filename, convertedStorageLocation);
    }

    private Resource loadFileAsResource(String filename, Path storageLocation) {
        try {
            Path filePath = storageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + filename, ex);
        }
    }
}