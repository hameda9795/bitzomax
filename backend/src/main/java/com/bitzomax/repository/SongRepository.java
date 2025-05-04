package com.bitzomax.repository;

import com.bitzomax.model.Song;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    
    List<Song> findByArtist(String artist);
    
    List<Song> findByGenre(String genre);
    
    List<Song> findByTitleContainingIgnoreCase(String title);
    
    List<Song> findByAlbumContainingIgnoreCase(String album);
    
    // Find songs by creation date, used for latest songs
    List<Song> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find distinct genres for genre navigation
    @Query("SELECT DISTINCT s.genre FROM Song s WHERE s.genre IS NOT NULL")
    List<String> findDistinctGenres();
}