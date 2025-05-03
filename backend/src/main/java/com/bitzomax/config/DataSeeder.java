package com.bitzomax.config;

import com.bitzomax.model.Song;
import com.bitzomax.model.User;
import com.bitzomax.repository.SongRepository;
import com.bitzomax.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SongRepository songRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed admin users
        seedAdminUsers();
        
        // Seed sample songs
        seedSampleSongs();
    }
    
    private void seedAdminUsers() {
        // Check if admin user already exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@bitzomax.com");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setSubscriptionType("ADMIN");
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
        }
        
        // Add another test user if needed
        if (userRepository.findByUsername("testuser").isEmpty()) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setPassword(passwordEncoder.encode("password123"));
            testUser.setEmail("test@bitzomax.com");
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setSubscriptionType("PREMIUM");
            testUser.setActive(true);
            testUser.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(testUser);
        }
    }
    
    private void seedSampleSongs() {
        // Only seed if no songs exist yet
        if (songRepository.count() == 0) {
            Song song1 = new Song();
            song1.setTitle("Bohemian Rhapsody");
            song1.setArtist("Queen");
            song1.setAlbum("A Night at the Opera");
            song1.setReleaseDate(LocalDate.of(1975, 10, 31));
            song1.setGenre("Rock");
            song1.setDurationSeconds(355);
            song1.setFilePath("bohemian_rhapsody.mp3");
            song1.setCoverArtUrl("bohemian_rhapsody_cover.jpg");
            
            Song song2 = new Song();
            song2.setTitle("Billie Jean");
            song2.setArtist("Michael Jackson");
            song2.setAlbum("Thriller");
            song2.setReleaseDate(LocalDate.of(1983, 1, 2));
            song2.setGenre("Pop");
            song2.setDurationSeconds(294);
            song2.setFilePath("billie_jean.mp3");
            song2.setCoverArtUrl("thriller_cover.jpg");
            
            Song song3 = new Song();
            song3.setTitle("Imagine");
            song3.setArtist("John Lennon");
            song3.setAlbum("Imagine");
            song3.setReleaseDate(LocalDate.of(1971, 10, 11));
            song3.setGenre("Rock");
            song3.setDurationSeconds(183);
            song3.setFilePath("imagine.mp3");
            song3.setCoverArtUrl("imagine_cover.jpg");
            
            songRepository.saveAll(Arrays.asList(song1, song2, song3));
        }
    }
}