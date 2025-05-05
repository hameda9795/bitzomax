import { API_URL } from '@/lib/constants';
import { getAuthHeader } from './auth-service';
import webSocketService from './websocket-service';

export interface ConversionProgress {
  fileId: string;
  percentComplete: number;
  status: 'processing' | 'complete' | 'error';
  message: string;
  resultFile?: string;
}

export interface ConversionOptions {
  onProgress?: (progress: ConversionProgress) => void;
  onComplete?: (resultFile: string) => void;
  onError?: (error: string) => void;
}

/**
 * Service for handling file conversions with progress tracking
 */
export const ConversionService = {
  /**
   * Convert a file to WebM format with progress tracking
   * @param file The file to convert
   * @param options Callbacks for tracking progress and completion
   * @returns Promise with the converted file information
   */
  async convertToWebM(file: File, options: ConversionOptions = {}) {
    let fileId = Date.now().toString();
    let unsubscribeFunc: (() => void) | null = null;
    
    try {
      console.log('Starting WebM conversion for file:', file.name);
      
      // Connect to WebSocket server if not already connected
      // Use the new Promise-based connect method
      if (!webSocketService.isConnected()) {
        // Remove the /api part from the URL to get the correct WebSocket endpoint
        // Use HTTP protocol for SockJS (it will upgrade to WebSocket)
        const baseUrl = API_URL.replace(/\/api$/, '').replace(/\/api\/.*$/, '');
        const sockjsEndpoint = `${baseUrl}/ws-endpoint`;
        const connected = await webSocketService.connect(sockjsEndpoint);
        
        if (!connected) {
          throw new Error('Failed to connect to WebSocket server');
        }
        console.log('WebSocket connection established');
      }
      
      // Subscribe to progress updates before sending the file
      if (options.onProgress || options.onComplete || options.onError) {
        console.log('Setting up WebSocket tracking for:', fileId);
        
        // Use the async version of trackConversionProgress
        unsubscribeFunc = await webSocketService.trackConversionProgress(
          fileId,
          (percent, message) => {
            if (options.onProgress) {
              options.onProgress({
                fileId,
                percentComplete: percent,
                status: 'processing',
                message
              });
            }
          },
          (resultFile) => {
            if (options.onComplete) {
              options.onComplete(resultFile);
            }
            // Clean up subscription
            if (unsubscribeFunc) {
              unsubscribeFunc();
              unsubscribeFunc = null;
            }
          },
          (errorMessage) => {
            if (options.onError) {
              options.onError(errorMessage);
            }
            // Clean up subscription
            if (unsubscribeFunc) {
              unsubscribeFunc();
              unsubscribeFunc = null;
            }
          }
        );
      }

      // Create form data with the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Add file ID for tracking
      formData.append('fileId', fileId);

      console.log('Uploading file for conversion with ID:', fileId);
      
      // Send the request to convert the file
      const response = await fetch(`${API_URL}/admin/files/convert-to-webm`, {
        method: 'POST',
        headers: {
          ...getAuthHeader()
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
        throw new Error(errorData.message || 'Failed to convert file');
      }

      const result = await response.json();
      console.log('Server response:', result);
      
      // If we received a server fileId and it's different from our temporary one,
      // we need to switch subscriptions
      if (result.fileId && result.fileId !== fileId && unsubscribeFunc) {
        const serverFileId = result.fileId;
        console.log('Switching to server fileId:', serverFileId);
        
        // Unsubscribe from temporary ID
        unsubscribeFunc();
        unsubscribeFunc = null;
        
        // Subscribe to the real server ID with the async version
        unsubscribeFunc = await webSocketService.trackConversionProgress(
          serverFileId,
          (percent, message) => {
            if (options.onProgress) {
              options.onProgress({
                fileId: serverFileId,
                percentComplete: percent,
                status: 'processing',
                message
              });
            }
          },
          (resultFile) => {
            if (options.onComplete) {
              options.onComplete(resultFile);
            }
            if (unsubscribeFunc) {
              unsubscribeFunc();
              unsubscribeFunc = null;
            }
          },
          (errorMessage) => {
            if (options.onError) {
              options.onError(errorMessage);
            }
            if (unsubscribeFunc) {
              unsubscribeFunc();
              unsubscribeFunc = null;
            }
          }
        );
      }

      return result;
    } catch (error) {
      console.error('Error converting file:', error);
      if (options.onError) {
        options.onError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
      
      // Clean up subscription on error
      if (unsubscribeFunc) {
        unsubscribeFunc();
      }
      
      throw error;
    }
  },
  
  /**
   * Retry connection to WebSocket server
   * @returns Promise that resolves to true if connection was successful
   */
  async retryWebSocketConnection(): Promise<boolean> {
    // Reset the WebSocket service first
    webSocketService.reset();
    
    // Try to connect again with the corrected URL for SockJS (must use HTTP/HTTPS, not WS/WSS)
    const baseUrl = API_URL.replace(/\/api$/, '').replace(/\/api\/.*$/, '');
    const sockjsEndpoint = `${baseUrl}/ws-endpoint`; // Use HTTP URL for SockJS
    return await webSocketService.connect(sockjsEndpoint);
  },

  /**
   * Get the download URL for a converted file
   * @param fileName The name of the converted file
   * @returns The URL to download the file
   */
  getConvertedFileDownloadUrl(fileName: string): string {
    // Remove any /api part from the API URL to get the base URL
    const baseUrl = API_URL.replace(/\/api$/, '').replace(/\/api\/.*$/, '');
    return `${baseUrl}/api/admin/files/converted/${fileName}`;
  },

  /**
   * Download a converted file
   * @param fileName The name of the converted file 
   * @param originalFileName Optional original file name to use for the download
   */
  downloadConvertedFile(fileName: string, originalFileName?: string): void {
    // Get authentication token
    const token = localStorage.getItem('auth_token');
    
    // Create download URL with authentication token
    const baseDownloadUrl = this.getConvertedFileDownloadUrl(fileName);
    const downloadUrl = token ? `${baseDownloadUrl}?token=${encodeURIComponent(token)}` : baseDownloadUrl;
    
    // Use fetch API with proper authentication
    fetch(downloadUrl, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set download attribute with original file name or converted file name
      if (originalFileName) {
        // Extract extension from fileName (.webm) and add it to original name
        const extension = fileName.substring(fileName.lastIndexOf('.'));
        const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
        link.download = `${nameWithoutExt}${extension}`;
      } else {
        link.download = fileName;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    })
    .catch(error => {
      console.error('Error downloading file:', error);
      alert('Failed to download the converted file. Please try again.');
    });
  }
}