package com.bitzomax.service;

import com.bitzomax.model.Song;
import com.bitzomax.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SongService {
    
    @Autowired
    private SongRepository songRepository;
    
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }
    
    public Optional<Song> getSongById(Long id) {
        return songRepository.findById(id);
    }
    
    public List<Song> getSongsByArtist(String artist) {
        return songRepository.findByArtist(artist);
    }
    
    public List<Song> getSongsByGenre(String genre) {
        return songRepository.findByGenre(genre);
    }
    
    public List<Song> searchSongsByTitle(String title) {
        return songRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Song> searchSongsByAlbum(String album) {
        return songRepository.findByAlbumContainingIgnoreCase(album);
    }
    
    public Song createSong(Song song) {
        // Set creation time
        song.setCreatedAt(LocalDateTime.now());
        song.setUpdatedAt(LocalDateTime.now());
        return songRepository.save(song);
    }
    
    public Optional<Song> updateSong(Long id, Song updatedSong) {
        return songRepository.findById(id)
                .map(existingSong -> {
                    // Update fields that are allowed to be modified
                    if (updatedSong.getTitle() != null) {
                        existingSong.setTitle(updatedSong.getTitle());
                    }
                    if (updatedSong.getArtist() != null) {
                        existingSong.setArtist(updatedSong.getArtist());
                    }
                    if (updatedSong.getAlbum() != null) {
                        existingSong.setAlbum(updatedSong.getAlbum());
                    }
                    if (updatedSong.getReleaseDate() != null) {
                        existingSong.setReleaseDate(updatedSong.getReleaseDate());
                    }
                    if (updatedSong.getGenre() != null) {
                        existingSong.setGenre(updatedSong.getGenre());
                    }
                    if (updatedSong.getDurationSeconds() != null) {
                        existingSong.setDurationSeconds(updatedSong.getDurationSeconds());
                    }
                    if (updatedSong.getFilePath() != null) {
                        existingSong.setFilePath(updatedSong.getFilePath());
                    }
                    if (updatedSong.getCoverArtUrl() != null) {
                        existingSong.setCoverArtUrl(updatedSong.getCoverArtUrl());
                    }
                    
                    // Update the modification timestamp
                    existingSong.setUpdatedAt(LocalDateTime.now());
                    
                    return songRepository.save(existingSong);
                });
    }
    
    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
}