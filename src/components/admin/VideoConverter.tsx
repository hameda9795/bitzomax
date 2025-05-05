import React, { useState, useRef } from 'react';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ConversionService, ConversionProgress } from '@/lib/services/conversion-service';

export function VideoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedFileName, setConvertedFileName] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError(null);
    setProgressStatus('idle');
    setProgress(0);
    setConvertedFileName(null);
    setStatusMessage('');
    
    // Create preview URL for the selected video
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };
  
  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile) return;
    
    // Check if it's a video file
    if (!droppedFile.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    
    setFile(droppedFile);
    setError(null);
    setProgressStatus('idle');
    setProgress(0);
    setConvertedFileName(null);
    setStatusMessage('');
    
    // Create preview URL for the dropped video
    const url = URL.createObjectURL(droppedFile);
    setPreviewUrl(url);
  };
  
  // Handle drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  // Start conversion
  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file to convert');
      return;
    }
    
    setIsConverting(true);
    setProgressStatus('processing');
    setProgress(0);
    setStatusMessage('Starting conversion...');
    setError(null);
    setConvertedFileName(null); // Reset any previous converted file
    
    try {
      await ConversionService.convertToWebM(file, {
        onProgress: (data: ConversionProgress) => {
          setProgress(data.percentComplete);
          setStatusMessage(data.message);
        },
        onComplete: (resultFile: string) => {
          setProgressStatus('complete');
          setProgress(100);
          setStatusMessage('Conversion completed successfully');
          
          // Set the name for the converted file
          setConvertedFileName(resultFile);
          setIsConverting(false);
        },
        onError: (errorMsg: string) => {
          setProgressStatus('error');
          setError(errorMsg);
          setIsConverting(false);
        }
      });
    } catch (err) {
      setProgressStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsConverting(false);
    }
  };
  
  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* File upload section */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center hover:border-primary/50 transition cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleBrowseClick}
            >
              <Upload className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                Drop video file or click to browse
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports MP4, MOV, AVI, and other common video formats
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="video/*" 
                onChange={handleFileChange}
              />
              <Button size="sm" variant="outline" type="button">
                Browse Files
              </Button>
            </div>

            {file && (
              <div className="mt-4 text-sm">
                <p>Selected file: <span className="font-medium">{file.name}</span></p>
                <p>Size: <span className="font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</span></p>
              </div>
            )}

            <div className="mt-6">
              <Button 
                className="w-full" 
                onClick={handleConvert} 
                disabled={!file || isConverting}
              >
                {isConverting ? 'Converting...' : 'Convert to WebM'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview and conversion status section */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Video Preview & Conversion</h3>
            
            {/* Video preview */}
            {previewUrl ? (
              <div className="mb-4 aspect-video">
                <video 
                  src={previewUrl} 
                  controls 
                  className="w-full h-full rounded-lg bg-black"
                />
              </div>
            ) : (
              <div className="bg-muted/20 rounded-lg aspect-video flex items-center justify-center mb-4">
                <p className="text-muted-foreground">No video selected</p>
              </div>
            )}
            
            {/* Conversion progress */}
            {progressStatus === 'processing' && (
              <div className="mb-6 space-y-2">
                <ProgressBar 
                  progress={progress} 
                  label="Converting" 
                  showValue 
                />
                <p className="text-xs text-muted-foreground">{statusMessage}</p>
              </div>
            )}
            
            {/* Success message */}
            {progressStatus === 'complete' && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Conversion Complete</AlertTitle>
                <AlertDescription className="text-green-700">
                  The video has been successfully converted to WebM format.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Error message */}
            {error && (
              <Alert className="mb-6 bg-rose-50 border-rose-200" variant="destructive">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <AlertTitle className="text-rose-800">Conversion Failed</AlertTitle>
                <AlertDescription className="text-rose-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Converted video preview */}
            {convertedFileName && (
              <div className="space-y-4">
                <h4 className="font-medium">Converted WebM</h4>
                <video 
                  src={ConversionService.getConvertedFileDownloadUrl(convertedFileName)} 
                  controls 
                  className="w-full rounded-lg bg-black"
                />
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => file && ConversionService.downloadConvertedFile(convertedFileName, file.name)}
                  >
                    Download WebM
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}