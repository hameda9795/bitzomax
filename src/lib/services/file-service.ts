// File service for admin panel
import apiClient from './api-client';

export interface FileUploadResponse {
  fileName: string;
  fileDownloadUri: string;
  fileType: string;
  size: string;
}

export const FileService = {
  uploadSongFile: async (file: File): Promise<FileUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/admin/files/upload/song', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video file:', error);
      throw error;
    }
  },

  uploadCoverArtFile: async (file: File): Promise<FileUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/admin/files/upload/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading cover art file:', error);
      throw error;
    }
  },

  getSongFileUrl: (fileName: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/files/song/${fileName}`;
  },

  getCoverArtUrl: (fileName: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/files/cover/${fileName}`;
  }
}