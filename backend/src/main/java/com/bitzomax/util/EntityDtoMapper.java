package com.bitzomax.util;

import com.bitzomax.dto.SongDTO;
import com.bitzomax.dto.UserDTO;
import com.bitzomax.model.Song;
import com.bitzomax.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class EntityDtoMapper {

    // User to UserDTO conversion
    public static UserDTO toUserDto(User user) {
        if (user == null) {
            return null;
        }
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setSubscriptionType(user.getSubscriptionType());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());
        
        return dto;
    }
    
    // List of Users to List of UserDTOs
    public static List<UserDTO> toUserDtoList(List<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(EntityDtoMapper::toUserDto)
                .collect(Collectors.toList());
    }
    
    // Song to SongDTO conversion
    public static SongDTO toSongDto(Song song) {
        if (song == null) {
            return null;
        }
        
        SongDTO dto = new SongDTO();
        dto.setId(song.getId());
        dto.setTitle(song.getTitle());
        dto.setArtist(song.getArtist());
        dto.setAlbum(song.getAlbum());
        dto.setReleaseDate(song.getReleaseDate());
        dto.setGenre(song.getGenre());
        dto.setDurationSeconds(song.getDurationSeconds());
        dto.setFilePath(song.getFilePath());
        dto.setCoverArtUrl(song.getCoverArtUrl());
        
        return dto;
    }
    
    // List of Songs to List of SongDTOs
    public static List<SongDTO> toSongDtoList(List<Song> songs) {
        if (songs == null) {
            return null;
        }
        return songs.stream()
                .map(EntityDtoMapper::toSongDto)
                .collect(Collectors.toList());
    }
}