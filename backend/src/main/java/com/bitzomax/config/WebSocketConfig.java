package com.bitzomax.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker with destinations prefixed with /topic
        config.enableSimpleBroker("/topic");
        
        // Set prefix for controller mapping
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/ws-endpoint" endpoint, enabling SockJS fallback options
        registry.addEndpoint("/ws-endpoint")
                .setAllowedOriginPatterns("*") // Allow all origins
                .withSockJS()
                .setClientLibraryUrl("https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js") // Use standard SockJS client
                .setWebSocketEnabled(true) // Ensure WebSocket is enabled
                .setSessionCookieNeeded(false) // Disable session cookie
                .setDisconnectDelay(30 * 1000); // Set disconnect delay to 30 seconds
    }
    
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        // Increase message size limits (important for larger WebSocket messages)
        registration.setMessageSizeLimit(8192 * 4); // Message size limit (in bytes)
        registration.setSendBufferSizeLimit(512 * 1024); // Send buffer size limit (in bytes)
        registration.setSendTimeLimit(20000); // Send time limit (in milliseconds)
    }
}