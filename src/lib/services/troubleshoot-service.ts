import { API_URL } from '@/lib/constants';
import { getAuthHeader } from './auth-service';

/**
 * Service for troubleshooting functionality
 */
export const TroubleshootService = {
  /**
   * Check if FFmpeg is installed
   * @returns Promise with FFmpeg installation status
   */
  async checkFfmpeg(): Promise<{ installed: boolean; output?: string; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/admin/troubleshoot/check-ffmpeg`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check FFmpeg');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking FFmpeg:', error);
      return { 
        installed: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  },

  /**
   * Attempt to install FFmpeg
   * @returns Promise with installation result
   */
  async installFfmpeg(): Promise<{ 
    success: boolean; 
    installDir?: string; 
    batchFilePath?: string; 
    output?: string; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${API_URL}/admin/troubleshoot/install-ffmpeg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to install FFmpeg');
      }

      return await response.json();
    } catch (error) {
      console.error('Error installing FFmpeg:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  }
};