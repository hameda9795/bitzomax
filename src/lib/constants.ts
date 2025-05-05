/**
 * Application-wide constants
 */

// API URL for backend services
export const API_URL = "http://localhost:8080/api";

// Default page size for pagination
export const DEFAULT_PAGE_SIZE = 10;

// Storage keys for client-side data
export const STORAGE_KEYS = {
  AUTH_TOKEN: "bitzomax_auth_token",
  USER_DATA: "bitzomax_user_data",
};

// Media formats supported by the application
export const SUPPORTED_FORMATS = {
  AUDIO: [".mp3", ".wav", ".ogg", ".flac", ".aac", ".webm"],
  VIDEO: [".mp4", ".webm", ".avi", ".mov", ".mkv"],
  IMAGE: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
};