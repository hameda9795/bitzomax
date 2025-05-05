import React, { useState, useRef } from 'react';
import { useFileConversion } from '@/hooks/use-file-conversion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, CheckCircleIcon, AlertCircleIcon, UploadIcon } from 'lucide-react';

interface FileConversionUploaderProps {
  onConversionComplete?: (fileDownloadUrl: string) => void;
  uploadEndpoint?: string;
  websocketUrl?: string;
}

export function FileConversionUploader({
  onConversionComplete,
  uploadEndpoint = '/api/admin/files/convert-to-webm',
  websocketUrl = 'ws://localhost:8080/ws-endpoint',
}: FileConversionUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use our custom hook for WebSocket connection and progress tracking
  const { 
    status, 
    progress, 
    message, 
    resultFile, 
    error, 
    isConnected,
  } = useFileConversion(fileId, { serverUrl: websocketUrl });
  
  // Handler for file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadStatus('idle');
    setUploadError(null);
    setFileId(undefined);
  };
  
  // Handler for file upload
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploadStatus('uploading');
      setUploadError(null);
      
      // Generate a unique file ID
      const uniqueFileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setFileId(uniqueFileId);
      
      // Create form data with the file and file ID
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileId', uniqueFileId);
      
      // Upload the file
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important for CORS with credentials
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setUploadStatus('success');
      
      // If we got a different fileId from the server, update our tracking
      if (data.fileId && data.fileId !== uniqueFileId) {
        setFileId(data.fileId);
      }
      
      // If conversion is immediate or we don't use WebSockets
      if (data.fileDownloadUri && onConversionComplete) {
        onConversionComplete(data.fileDownloadUri);
      }
    } catch (err: any) {
      setUploadStatus('error');
      setUploadError(err.message || 'An error occurred during upload');
      console.error('Upload error:', err);
    }
  };
  
  // When conversion is complete via WebSocket, notify parent component
  React.useEffect(() => {
    if (status === 'completed' && resultFile && onConversionComplete) {
      const fileDownloadUrl = `/api/admin/files/converted/${resultFile}`;
      onConversionComplete(fileDownloadUrl);
    }
  }, [status, resultFile, onConversionComplete]);
  
  // Reset form handler
  const handleReset = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadError(null);
    setFileId(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="file-upload" className="text-sm font-medium">
          Select a file to convert to WebM
        </label>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileChange}
          className="border rounded p-2"
          disabled={uploadStatus === 'uploading' || status === 'tracking'}
        />
      </div>
      
      {file && (
        <div className="text-sm">
          Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
      
      {/* Upload button */}
      <div className="flex gap-2">
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploadStatus === 'uploading' || status === 'tracking'}
        >
          <UploadIcon className="mr-2 h-4 w-4" />
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload & Convert'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={uploadStatus === 'uploading' || status === 'tracking'}
        >
          Reset
        </Button>
      </div>
      
      {/* Upload status indicator */}
      {uploadStatus === 'uploading' && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Uploading</AlertTitle>
          <AlertDescription>
            Please wait while your file is being uploaded...
          </AlertDescription>
        </Alert>
      )}
      
      {uploadStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      {/* WebSocket connection status */}
      {(uploadStatus === 'success' || status !== 'idle') && (
        <div className="text-sm">
          WebSocket: {isConnected ? 
            <span className="text-green-500">Connected</span> : 
            <span className="text-red-500">Disconnected</span>}
        </div>
      )}
      
      {/* Conversion progress indicator */}
      {status === 'tracking' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Converting: {progress}%</span>
            <span>{message}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {/* Conversion complete message */}
      {status === 'completed' && (
        <Alert className="bg-green-50">
          <CheckCircleIcon className="h-4 w-4 text-green-600" />
          <AlertTitle>Conversion Complete</AlertTitle>
          <AlertDescription>
            Your file has been successfully converted to WebM format.
            {resultFile && <div className="mt-1 text-sm">Result: {resultFile}</div>}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Conversion error message */}
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Conversion Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}