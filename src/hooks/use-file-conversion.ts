import { useEffect, useState } from 'react';
import webSocketService from '@/lib/services/websocket-service';

type ConversionStatus = 'idle' | 'connecting' | 'tracking' | 'completed' | 'error';

interface UseFileConversionOptions {
  autoConnect?: boolean;
  serverUrl?: string;
}

interface ConversionState {
  status: ConversionStatus;
  progress: number;
  message: string;
  resultFile?: string;
  error?: string;
}

/**
 * React hook for tracking file conversion progress via WebSocket
 */
export function useFileConversion(fileId?: string, options: UseFileConversionOptions = {}) {
  const { autoConnect = true, serverUrl = 'ws://localhost:8080/ws-endpoint' } = options;
  
  const [state, setState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    message: 'Not started',
  });
  
  // Connect to WebSocket server
  useEffect(() => {
    if (autoConnect && !webSocketService.isConnected()) {
      setState(prev => ({ ...prev, status: 'connecting' }));
      
      webSocketService.connect(serverUrl, () => {
        console.log('WebSocket connected in hook');
        if (fileId) {
          startTracking(fileId);
        }
      });
      
      // Cleanup on unmount
      return () => {
        webSocketService.disconnect();
      };
    }
  }, [autoConnect, serverUrl]);
  
  // Track file conversion when fileId changes
  useEffect(() => {
    if (fileId && webSocketService.isConnected()) {
      startTracking(fileId);
    }
    
    return () => {
      if (fileId) {
        webSocketService.unsubscribeFromTopic(fileId);
      }
    };
  }, [fileId]);
  
  // Start tracking a file's conversion progress
  const startTracking = (id: string) => {
    setState(prev => ({ 
      ...prev, 
      status: 'tracking',
      progress: 0, 
      message: 'Starting tracking...',
      resultFile: undefined,
      error: undefined
    }));
    
    webSocketService.trackConversionProgress(
      id,
      // Progress callback
      (percent, message) => {
        setState(prev => ({ 
          ...prev, 
          progress: percent, 
          message 
        }));
      },
      // Completion callback
      (resultFile) => {
        setState(prev => ({ 
          ...prev, 
          status: 'completed', 
          progress: 100,
          message: 'Conversion completed', 
          resultFile 
        }));
      },
      // Error callback
      (error) => {
        setState(prev => ({ 
          ...prev, 
          status: 'error', 
          message: 'Conversion failed', 
          error 
        }));
      }
    );
  };
  
  // Manual connect function
  const connect = () => {
    if (!webSocketService.isConnected()) {
      setState(prev => ({ ...prev, status: 'connecting' }));
      webSocketService.connect(serverUrl, () => {
        if (fileId) {
          startTracking(fileId);
        }
      });
    }
  };
  
  // Manual disconnect function
  const disconnect = () => {
    webSocketService.disconnect();
    setState({ status: 'idle', progress: 0, message: 'Disconnected' });
  };
  
  return {
    ...state,
    isConnected: webSocketService.isConnected(),
    connect,
    disconnect,
    startTracking
  };
}