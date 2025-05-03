package com.bitzomax.repository;

import com.bitzomax.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    
    List<Song> findByArtist(String artist);
    
    List<Song> findByGenre(String genre);
    
    List<Song> findByTitleContainingIgnoreCase(String title);
    
    List<Song> findByAlbumContainingIgnoreCase(String album);
}