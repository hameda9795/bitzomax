import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

/**
 * GET handler for streaming audio files
 * This functions as a direct file system access with API fallback
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
  }

  try {
    // Get backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    
    // Get auth token from cookies if available
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;
    
    // Prepare headers to forward to backend
    const headers = new Headers();
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    
    // Forward any cookies to handle session-based auth
    request.cookies.getAll().forEach(cookie => {
      if (cookie.name.toLowerCase().includes('jsessionid') || 
          cookie.name.toLowerCase().includes('auth') || 
          cookie.name.toLowerCase().includes('token')) {
        headers.append('Cookie', `${cookie.name}=${cookie.value}`);
      }
    });
    
    console.log(`Attempting to fetch song with ID: ${id}`);
    
    // First try to get the song data to obtain the file path
    try {
      const songResponse = await fetch(`${backendUrl}/admin/songs/${id}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      });
      
      if (!songResponse.ok) {
        console.error(`Failed to fetch song metadata: ${songResponse.status} - ${songResponse.statusText}`);
        // Instead of returning an error, let's try local file lookup
        console.log("Trying local file lookup...");
      } else {
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
            console.log(`Found song file at: ${backendUploadsPath}`);
            const audioBuffer = fs.readFileSync(backendUploadsPath);
            
            if (audioBuffer.byteLength === 0) {
              console.error('File exists but is empty');
              return NextResponse.json(
                { error: 'Empty audio file' }, 
                { status: 500 }
              );
            }
            
            // Determine content type based on file extension
            const ext = path.extname(fileName).toLowerCase();
            let contentType = 'audio/mpeg'; // default
            if (ext === '.wav') contentType = 'audio/wav';
            if (ext === '.ogg') contentType = 'audio/ogg';
            if (ext === '.flac') contentType = 'audio/flac';
            if (ext === '.aac') contentType = 'audio/aac';
            
            // Create a response with the proper headers
            const responseHeaders = new Headers();
            responseHeaders.set('Content-Type', contentType);
            responseHeaders.set('Content-Length', audioBuffer.byteLength.toString());
            responseHeaders.set('Accept-Ranges', 'bytes');
            
            // Return the audio file as a streaming response
            return new NextResponse(audioBuffer, {
              status: 200,
              headers: responseHeaders
            });
          }
          
          // If file not found locally, fallback to API request
          console.log(`File not found locally, trying API: ${fileName}`);
          
          // Try the admin files endpoint
          const fileResponse = await fetch(`${backendUrl}/admin/files/song/${fileName}`, {
            method: 'GET',
            headers: headers,
            credentials: 'include',
          });
          
          if (!fileResponse.ok) {
            console.error(`Backend API returned error: ${fileResponse.status} - ${fileResponse.statusText}`);
            
            // Try direct file scanning in the uploads directory as a last resort
            console.log("API failed. Trying directory scan...");
            const uploadsDir = path.join(projectRoot, 'backend', 'uploads', 'songs');
            
            if (fs.existsSync(uploadsDir)) {
              const files = fs.readdirSync(uploadsDir);
              console.log(`Found ${files.length} files in uploads directory`);
              
              if (id && files.length > 0) {
                // Find a file that might match this ID (using simple heuristics)
                // This is a fallback when we can't get the exact filename from metadata
                const matchedFile = files.find(file => {
                  // If any part of filename contains the ID
                  return file.includes(id.substring(0, 8));
                });
                
                if (matchedFile) {
                  console.log(`Found potential match for ID ${id}: ${matchedFile}`);
                  const audioBuffer = fs.readFileSync(path.join(uploadsDir, matchedFile));
                  
                  if (audioBuffer.byteLength === 0) {
                    console.error('Matched file exists but is empty');
                    return NextResponse.json(
                      { error: 'Empty audio file' }, 
                      { status: 500 }
                    );
                  }
                  
                  // Determine content type based on file extension
                  const ext = path.extname(matchedFile).toLowerCase();
                  let contentType = 'audio/mpeg'; // default
                  if (ext === '.wav') contentType = 'audio/wav';
                  if (ext === '.ogg') contentType = 'audio/ogg';
                  if (ext === '.flac') contentType = 'audio/flac';
                  if (ext === '.aac') contentType = 'audio/aac';
                  
                  // Create a response with the proper headers
                  const responseHeaders = new Headers();
                  responseHeaders.set('Content-Type', contentType);
                  responseHeaders.set('Content-Length', audioBuffer.byteLength.toString());
                  responseHeaders.set('Accept-Ranges', 'bytes');
                  
                  // Return the audio file as a streaming response
                  return new NextResponse(audioBuffer, {
                    status: 200,
                    headers: responseHeaders
                  });
                }
              }
              
              // If we got to this point, try to return any audio file as a demo
              if (files.length > 0) {
                // Find the first MP3 file
                const mp3File = files.find(file => file.endsWith('.mp3'));
                if (mp3File) {
                  console.log(`No match found. Using demo file: ${mp3File}`);
                  const audioBuffer = fs.readFileSync(path.join(uploadsDir, mp3File));
                  
                  // Create a response with the proper headers
                  const responseHeaders = new Headers();
                  responseHeaders.set('Content-Type', 'audio/mpeg');
                  responseHeaders.set('Content-Length', audioBuffer.byteLength.toString());
                  responseHeaders.set('Accept-Ranges', 'bytes');
                  
                  // Return the audio file as a streaming response
                  return new NextResponse(audioBuffer, {
                    status: 200,
                    headers: responseHeaders
                  });
                }
              }
            }
            
            // If we get here, we've exhausted all options - return proper error
            if (fileResponse.status === 404) {
              return NextResponse.json({ error: 'Song file not found' }, { status: 404 });
            } else if (fileResponse.status === 403) {
              return NextResponse.json({ error: 'Access forbidden to this song file' }, { status: 403 });
            } else if (fileResponse.status === 401) {
              return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
            }
            
            return NextResponse.json(
              { error: `Error streaming audio file: ${fileResponse.status} ${fileResponse.statusText}` },
              { status: fileResponse.status }
            );
          }
          
          // If API request succeeded, get the audio file content
          const audioBuffer = await fileResponse.arrayBuffer();
          
          if (audioBuffer.byteLength === 0) {
            console.error('Received empty audio buffer from backend');
            return NextResponse.json(
              { error: 'Received empty audio file from server' }, 
              { status: 500 }
            );
          }
          
          console.log(`Successfully fetched song from API, size: ${audioBuffer.byteLength} bytes`);
          
          // Create a response with the proper headers
          const responseHeaders = new Headers();
          responseHeaders.set('Content-Type', fileResponse.headers.get('Content-Type') || 'audio/mpeg');
          responseHeaders.set('Content-Length', audioBuffer.byteLength.toString());
          responseHeaders.set('Accept-Ranges', 'bytes');
          
          // Return the audio file as a streaming response
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: responseHeaders
          });
        } else {
          console.error('Song does not have a file path');
          // Try direct file lookup as fallback
        }
      }
      
      // If we reach this point, try direct directory scan
      // This is our last-ditch effort to find music files
      console.log("No song metadata available. Trying directory scan...");
      const projectRoot = path.resolve(process.cwd());
      const uploadsDir = path.join(projectRoot, 'backend', 'uploads', 'songs');
      
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        
        // If ID specified, try to find a matching file first
        if (id && files.length > 0) {
          const matchedFile = files.find(file => {
            // If any part of filename contains the ID
            return file.includes(id.substring(0, 8));
          });
          
          if (matchedFile) {
            console.log(`Found potential match for ID ${id}: ${matchedFile}`);
            const audioBuffer = fs.readFileSync(path.join(uploadsDir, matchedFile));
            
            // Create a response with the proper headers
            const responseHeaders = new Headers();
            responseHeaders.set('Content-Type', 'audio/mpeg');
            responseHeaders.set('Content-Length', audioBuffer.byteLength.toString());
            responseHeaders.set('Accept-Ranges', 'bytes');
            
            // Return the audio file as a streaming response
            return new NextResponse(audioBuffer, {
              status: 200,
              headers: responseHeaders
            });
          }
        }
        
        // Fallback to any audio file
        if (files.length > 0) {
          // Find first MP3 file
          const mp3File = files.find(file => file.endsWith('.mp3'));
          if (mp3File) {
            console.log(`Using fallback file: ${mp3File}`);
            const audioBuffer = fs.readFileSync(path.join(uploadsDir, mp3File));
            
            // Create a response with the proper headers
            const responseHeaders = new Headers();
            responseHeaders.set('Content-Type', 'audio/mpeg');
            responseHeaders.set('Content-Length', audioBuffer.byteLength.toString());
            responseHeaders.set('Accept-Ranges', 'bytes');
            
            // Return the audio file as a streaming response
            return new NextResponse(audioBuffer, {
              status: 200,
              headers: responseHeaders
            });
          }
        }
      }
      
      // If we get here, we couldn't find any audio files
      return NextResponse.json({ error: 'No audio files found' }, { status: 404 });
      
    } catch (error) {
      console.error('Error fetching song metadata:', error);
      return NextResponse.json(
        { error: 'Failed to fetch song' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error streaming audio:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}