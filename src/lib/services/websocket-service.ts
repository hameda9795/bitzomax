import { Client } from '@stomp/stompjs';
import { API_URL } from '@/lib/constants';
import SockJS from 'sockjs-client';

/**
 * WebSocket Service for tracking file conversion progress
 */
export class WebSocketService {
  private client: Client | null = null;
  private connected = false;
  private connecting = false;
  private subscriptions: { [key: string]: any } = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10; // Increased from 5
  private serverUrl: string = '';
  private connectionPromise: Promise<boolean> | null = null;
  
  // Default WebSocket URL is crucial for connection
  private defaultWsUrl = 'http://localhost:8080/ws-endpoint';

  /**
   * Initialize the WebSocket connection
   * @param serverUrl The WebSocket server URL (e.g., http://localhost:8080/ws-endpoint)
   * @param onConnectCallback Optional callback when connection is established
   * @returns Promise that resolves when connection is established or fails
   */
  async connect(serverUrl?: string, onConnectCallback?: () => void): Promise<boolean> {
    // Allow using a default URL if none is provided
    this.serverUrl = serverUrl || this.serverUrl || this.getDefaultWebSocketUrl();
    
    // If already connecting, return the existing promise
    if (this.connecting && this.connectionPromise) {
      return this.connectionPromise;
    }
    
    // If already connected, return resolved promise
    if (this.connected && this.client) {
      return Promise.resolve(true);
    }
    
    // Reset client if it exists but is not connected
    if (this.client && !this.connected) {
      this.client.deactivate();
      this.client = null;
    }
    
    this.connecting = true;
    
    // Create a new connection promise
    this.connectionPromise = new Promise((resolve) => {
      console.log('Initializing WebSocket connection to:', this.serverUrl);
      
      this.client = new Client({
        // Use SockJS for better compatibility across browsers and networks
        webSocketFactory: () => new SockJS(this.serverUrl),
        reconnectDelay: 3000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('Connected to WebSocket server');
          this.connected = true;
          this.connecting = false;
          this.reconnectAttempts = 0;
          if (onConnectCallback) onConnectCallback();
          resolve(true);
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
          this.connecting = false;
          resolve(false);
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket server');
          this.connected = false;
        },
        onWebSocketClose: (event) => {
          console.log('WebSocket connection closed', event);
          this.connected = false;
          
          // Only attempt reconnect if not deliberately disconnected
          if (!event || event.code !== 1000) {
            this.handleReconnect();
          }
        }
      });
      
      // Set a connection timeout
      setTimeout(() => {
        if (this.connecting) {
          console.error('WebSocket connection timeout');
          this.connecting = false;
          resolve(false);
        }
      }, 10000); // 10 second timeout
      
      try {
        this.client.activate();
      } catch (error) {
        console.error('Error activating WebSocket client:', error);
        this.connecting = false;
        resolve(false);
      }
    });
    
    return this.connectionPromise;
  }
  
  /**
   * Get the default WebSocket URL based on the API_URL
   */
  private getDefaultWebSocketUrl(): string {
    try {
      // Get base URL without /api segment
      const baseUrl = API_URL.replace(/\/api.*$/, '');
      return `${baseUrl}/ws-endpoint`;
    } catch (error) {
      console.error('Error generating WebSocket URL:', error);
      return 'http://localhost:8080/ws-endpoint'; // Fallback to default
    }
  }
  
  /**
   * Handle reconnection logic
   */
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.reconnectAttempts++;
      
      // Use exponential backoff for reconnections
      const delay = Math.min(1000 * (2 ** this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        if (!this.connected) {
          try {
            // Instead of reactivating the existing client, create a fresh connection
            this.client = null;
            this.connect(this.serverUrl).catch(error => {
              console.error('Reconnection attempt failed:', error);
            });
          } catch (error) {
            console.error('Error during reconnection attempt:', error);
          }
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      // Reset client to allow manual reconnection attempts
      this.client = null;
      this.reconnectAttempts = 0;
    }
  }
  
  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.error('Error disconnecting WebSocket client:', error);
      } finally {
        this.client = null;
        this.connected = false;
        this.connecting = false;
        this.connectionPromise = null;
        this.subscriptions = {};
      }
    }
  }
  
  /**
   * Track file conversion progress
   * @param fileId The ID of the file to track
   * @param onProgress Callback for progress updates
   * @param onComplete Callback for conversion completion
   * @param onError Callback for conversion errors
   * @returns A function to unsubscribe
   */
  async trackConversionProgress(
    fileId: string,
    onProgress: (percent: number, message: string) => void,
    onComplete?: (resultFile: string) => void,
    onError?: (error: string) => void
  ): Promise<() => void> {
    if (!fileId) {
      if (onError) onError('No fileId provided for tracking');
      return () => {};
    }
    
    // Auto-connect if not connected
    if (!this.connected) {
      const connected = await this.connect();
      if (!connected) {
        if (onError) onError('Failed to connect to WebSocket server');
        return () => {};
      }
    }
    
    if (!this.client || !this.connected) {
      if (onError) onError('WebSocket client not connected');
      return () => {};
    }
    
    const destination = `/topic/conversion/${fileId}`;
    
    // Unsubscribe if already subscribed to this fileId
    this.unsubscribeFromTopic(fileId);
    
    try {
      // Subscribe to progress updates
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const progressData = JSON.parse(message.body);
          console.log('Received progress update:', progressData);
          
          if (progressData.status === 'error' && onError) {
            onError(progressData.message || 'Unknown error occurred');
          } else if (progressData.status === 'complete' && onComplete && progressData.resultFile) {
            onProgress(100, progressData.message || 'Conversion complete');
            onComplete(progressData.resultFile);
          } else {
            onProgress(
              progressData.percentComplete || 0, 
              progressData.message || `Processing at ${progressData.percentComplete || 0}%`
            );
          }
        } catch (error) {
          console.error('Error parsing progress update:', error);
          if (onError) onError('Error parsing server response');
        }
      });
      
      // Store the subscription
      this.subscriptions[fileId] = subscription;
      
      // Return an unsubscribe function
      return () => this.unsubscribeFromTopic(fileId);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      if (onError) onError('Failed to subscribe to conversion updates');
      return () => {};
    }
  }
  
  /**
   * Unsubscribe from a specific topic
   * @param fileId The ID of the file to unsubscribe from
   */
  unsubscribeFromTopic(fileId: string) {
    if (this.subscriptions[fileId]) {
      try {
        this.subscriptions[fileId].unsubscribe();
      } catch (error) {
        console.error(`Error unsubscribing from ${fileId}:`, error);
      }
      delete this.subscriptions[fileId];
    }
  }
  
  /**
   * Unsubscribe from all topics
   */
  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach(fileId => {
      this.unsubscribeFromTopic(fileId);
    });
  }
  
  /**
   * Check if the WebSocket client is connected
   */
  isConnected(): boolean {
    return this.connected;
  }
  
  /**
   * Check if the WebSocket client is connecting
   */
  isConnecting(): boolean {
    return this.connecting;
  }
  
  /**
   * Reset the client and connection state
   */
  reset() {
    this.disconnect();
    this.reconnectAttempts = 0;
  }
}

// Export a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;