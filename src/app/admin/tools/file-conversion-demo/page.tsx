'use client';

import React, { useState } from 'react';
import { FileConversionUploader } from '@/components/admin/FileConversionUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FileConversionDemoPage() {
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  
  const handleConversionComplete = (fileUrl: string) => {
    setConvertedFile(fileUrl);
    console.log('Conversion completed, file available at:', fileUrl);
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">File Conversion with WebSocket Progress</h1>
      
      <p className="mb-6 text-muted-foreground">
        This demo showcases real-time file conversion tracking using WebSockets. 
        Upload a file and monitor its conversion progress with live updates.
      </p>
      
      <Tabs defaultValue="uploader" className="mb-6">
        <TabsList>
          <TabsTrigger value="uploader">Uploader</TabsTrigger>
          <TabsTrigger value="test">WebSocket Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="uploader">
          <Card>
            <CardHeader>
              <CardTitle>Convert Media Files to WebM</CardTitle>
              <CardDescription>
                Upload audio or video files to convert them to WebM format with progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileConversionUploader
                onConversionComplete={handleConversionComplete}
                websocketUrl="ws://localhost:8080/ws-endpoint"
              />
              
              {convertedFile && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Converted File</h3>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <div className="mb-2">
                      <strong>URL:</strong> <code className="text-sm bg-slate-100 px-1">{convertedFile}</code>
                    </div>
                    
                    <video 
                      controls 
                      className="w-full max-h-[300px] border rounded-md bg-black"
                      src={convertedFile}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>WebSocket Test Tools</CardTitle>
              <CardDescription>
                Test your WebSocket connection and simulate conversion events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebSocketTestPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
          <CardDescription>
            Technical implementation information for developers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Backend Components:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>WebSocketConfig.java:</strong> Configures the Spring WebSocket endpoints with CORS support</li>
            <li><strong>FileController.java:</strong> Handles file upload and initiates conversion with fileId tracking</li>
            <li><strong>ProgressUpdateService.java:</strong> Manages sending WebSocket progress messages to clients</li>
            <li><strong>FileStorageService.java:</strong> Performs file conversion with progress updates</li>
          </ul>
          
          <h3 className="text-lg font-medium">Frontend Components:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>useFileConversion.ts:</strong> React hook for easy WebSocket connection and progress tracking</li>
            <li><strong>websocket-service.ts:</strong> Core WebSocket service using STOMP.js for reliable connections</li>
            <li><strong>FileConversionUploader.tsx:</strong> UI component with progress tracking for file uploads</li>
          </ul>
          
          <Alert>
            <AlertDescription>
              Remember to install <code className="text-sm bg-slate-100 px-1">@stomp/stompjs</code> package for WebSocket communication: <code className="text-sm bg-slate-100 px-1">npm install @stomp/stompjs</code>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

function WebSocketTestPanel() {
  const [testFileId, setTestFileId] = useState('test-file-id');
  const [testPercent, setTestPercent] = useState(50);
  const [testMessage, setTestMessage] = useState('Converting file...');
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  const simulateProgress = async () => {
    try {
      setTestStatus('sending');
      
      const response = await fetch(`/test/websocket/send-progress?fileId=${testFileId}&percent=${testPercent}&message=${encodeURIComponent(testMessage)}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 2000);
    } catch (error) {
      console.error('Test request failed:', error);
      setTestStatus('error');
    }
  };
  
  const simulateConversion = async () => {
    try {
      setTestStatus('sending');
      
      const response = await fetch(`/test/websocket/simulate-conversion?fileId=${testFileId}&duration=10`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 2000);
    } catch (error) {
      console.error('Test request failed:', error);
      setTestStatus('error');
    }
  };
  
  const simulateError = async () => {
    try {
      setTestStatus('sending');
      
      const response = await fetch(`/test/websocket/simulate-error?fileId=${testFileId}&message=${encodeURIComponent('Test error message')}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 2000);
    } catch (error) {
      console.error('Test request failed:', error);
      setTestStatus('error');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">File ID for testing</label>
        <input
          type="text"
          value={testFileId}
          onChange={(e) => setTestFileId(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter a file ID"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Progress Percentage</label>
          <input
            type="number"
            min="0"
            max="100"
            value={testPercent}
            onChange={(e) => setTestPercent(parseInt(e.target.value, 10))}
            className="border rounded p-2 w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Progress Message</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <button
          onClick={simulateProgress}
          disabled={testStatus === 'sending'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {testStatus === 'sending' ? 'Sending...' : 'Send Progress Update'}
        </button>
        
        <button
          onClick={simulateConversion}
          disabled={testStatus === 'sending'}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          Simulate Full Conversion
        </button>
        
        <button
          onClick={simulateError}
          disabled={testStatus === 'sending'}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
        >
          Simulate Error
        </button>
      </div>
      
      {testStatus === 'success' && (
        <div className="p-3 bg-green-50 text-green-800 rounded">
          Test request sent successfully! Check the console for WebSocket messages.
        </div>
      )}
      
      {testStatus === 'error' && (
        <div className="p-3 bg-red-50 text-red-800 rounded">
          Test request failed. Check that your backend server is running.
        </div>
      )}
      
      <div className="p-4 bg-slate-50 rounded-md mt-4">
        <h4 className="font-medium mb-2">How to test:</h4>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Open the Uploader tab</li>
          <li>Enter a File ID above (same as what you would see in the uploader)</li>
          <li>Click "Send Progress Update" or "Simulate Full Conversion"</li>
          <li>Watch the progress bar update in the Uploader tab in real-time</li>
        </ol>
      </div>
    </div>
  );
}