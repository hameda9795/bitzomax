package com.bitzomax.service;

import com.bitzomax.model.User;
import com.bitzomax.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(User user) {
        // Set creation time
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    public Optional<User> updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    // Update fields that are allowed to be modified
                    if (updatedUser.getFirstName() != null) {
                        existingUser.setFirstName(updatedUser.getFirstName());
                    }
                    if (updatedUser.getLastName() != null) {
                        existingUser.setLastName(updatedUser.getLastName());
                    }
                    if (updatedUser.getEmail() != null) {
                        existingUser.setEmail(updatedUser.getEmail());
                    }
                    if (updatedUser.getPassword() != null) {
                        existingUser.setPassword(updatedUser.getPassword());
                    }
                    if (updatedUser.getSubscriptionType() != null) {
                        existingUser.setSubscriptionType(updatedUser.getSubscriptionType());
                    }
                    
                    existingUser.setActive(updatedUser.isActive());
                    
                    return userRepository.save(existingUser);
                });
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public List<User> getUsersBySubscriptionType(String subscriptionType) {
        return userRepository.findBySubscriptionType(subscriptionType);
    }
    
    public List<User> getActiveUsers() {
        return userRepository.findByActive(true);
    }
    
    public List<User> getInactiveUsers() {
        return userRepository.findByActive(false);
    }
    
    public void updateLastLogin(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}