import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

/**
 * GET handler for streaming video files
 * This functions as a direct file system access with API fallback
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the song id from the URL parameter
  const songId = params.id;
  
  try {
    // Environment variables for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    
    // Get the song information first
    const songResponse = await fetch(`${backendUrl}/home/songs/${songId}`);
    
    if (!songResponse.ok) {
      return new NextResponse(`Song not found: ${songId}`, { status: 404 });
    }
    
    if (songResponse.headers.get('content-type')?.includes('application/json')) {
      console.log("Retrieved song metadata for streaming");
    } else {
      return new NextResponse(`Failed to get song details: ${songId}`, { status: 500 });
    }
    
    const song = await songResponse.json();
    
    if (song.filePath) {
      // Get just the filename from the file path
      const filePath = song.filePath;
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
      
      console.log(`Fetching file: ${fileName} from path: ${filePath}`);
      
      // First try to access the file directly from the file system
      // Assuming the uploads folder is at the project root level
      const projectRoot = path.resolve(process.cwd());
      const backendUploadsPath = path.join(projectRoot, 'backend', 'uploads', 'songs', fileName);
      
      // Check if file exists in the backend uploads directory
      if (fs.existsSync(backendUploadsPath)) {
        console.log(`File found at: ${backendUploadsPath}`);
        
        // Read the file
        const videoBuffer = fs.readFileSync(backendUploadsPath);
        
        // Determine content type based on file extension
        let contentType = 'application/octet-stream';
        const ext = path.extname(fileName).toLowerCase();
        
        if (ext === '.webm') contentType = 'video/webm';
        else if (ext === '.mp4') contentType = 'video/mp4';
        else if (ext === '.mp3') contentType = 'audio/mp3';
        else if (ext === '.wav') contentType = 'audio/wav';
        else if (ext === '.aac') contentType = 'audio/aac';
        
        // Create a response with the proper headers
        const responseHeaders = new Headers();
        responseHeaders.set('Content-Type', contentType);
        responseHeaders.set('Content-Length', videoBuffer.byteLength.toString());
        responseHeaders.set('Accept-Ranges', 'bytes');
        
        // Return the video file as a streaming response
        return new NextResponse(videoBuffer, {
          status: 200,
          headers: responseHeaders
        });
      }
      
      // If file not found locally, fallback to API request
      console.log(`File not found locally, trying API: ${fileName}`);
      
      // Try the admin files endpoint
      const fileResponse = await fetch(`${backendUrl}/admin/files/song/${fileName}`, {
        method: 'GET',
      });
      
      if (!fileResponse.ok) {
        return new NextResponse(`File not found: ${fileName}`, { status: 404 });
      }
      
      // Get the file data
      const fileData = await fileResponse.arrayBuffer();
      
      // Create a response with the proper headers
      const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', contentType);
      responseHeaders.set('Content-Length', fileData.byteLength.toString());
      responseHeaders.set('Accept-Ranges', 'bytes');
      
      // Return the file as a streaming response
      return new NextResponse(fileData, {
        status: 200,
        headers: responseHeaders
      });
    } else {
      return new NextResponse(`Song file path not found for: ${songId}`, { status: 404 });
    }
  } catch (error) {
    console.error('Error streaming song:', error);
    return new NextResponse(`Error streaming song: ${error}`, { status: 500 });
  }
}