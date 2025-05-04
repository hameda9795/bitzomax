package com.bitzomax.controller;

import com.bitzomax.model.Song;
import com.bitzomax.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*")
public class HomeController {

    @Autowired
    private SongService songService;

    @GetMapping("/featured")
    public ResponseEntity<Map<String, Object>> getFeaturedContent() {
        Map<String, Object> response = new HashMap<>();
        
        // Get latest songs (could be featured/recommended in a more complex implementation)
        List<Song> latestSongs = songService.getLatestSongs(5);
        
        // Get songs by popular genres
        List<Song> popSongs = songService.getSongsByGenre("Pop");
        List<Song> rockSongs = songService.getSongsByGenre("Rock");
        List<Song> hiphopSongs = songService.getSongsByGenre("Hip Hop");
        
        response.put("featuredSongs", latestSongs);
        response.put("genreHighlights", Map.of(
            "Pop", popSongs.size() > 3 ? popSongs.subList(0, 3) : popSongs,
            "Rock", rockSongs.size() > 3 ? rockSongs.subList(0, 3) : rockSongs,
            "Hip Hop", hiphopSongs.size() > 3 ? hiphopSongs.subList(0, 3) : hiphopSongs
        ));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        return ResponseEntity.ok(songService.getAllGenres());
    }

    @GetMapping("/genres/{genreName}")
    public ResponseEntity<List<Song>> getSongsByGenre(@PathVariable String genreName) {
        return ResponseEntity.ok(songService.getSongsByGenre(genreName));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Song>> searchSongs(@RequestParam String query) {
        List<Song> results = songService.searchSongsByTitle(query);
        return ResponseEntity.ok(results);
    }
    
    // Added new endpoints for public song access
    @GetMapping("/songs")
    public ResponseEntity<List<Song>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
    }
    
    @GetMapping("/songs/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable Long id) {
        return songService.getSongById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/songs/artist/{artist}")
    public ResponseEntity<List<Song>> getSongsByArtist(@PathVariable String artist) {
        return ResponseEntity.ok(songService.getSongsByArtist(artist));
    }
}