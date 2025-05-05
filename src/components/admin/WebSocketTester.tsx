import React, { useState, useEffect } from 'react';
import { webSocketService } from '@/lib/services/websocket-service';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { API_URL } from '@/lib/constants';

export function WebSocketTester() {
  const [connected, setConnected] = useState<boolean>(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string>('test-' + Date.now());
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Connect to WebSocket
  const handleConnect = async () => {
    try {
      await webSocketService.init();
      setConnected(true);
      addLog('Connected to WebSocket server');
    } catch (error) {
      addLog(`Connection error: ${error}`);
    }
  };
  
  // Disconnect from WebSocket
  const handleDisconnect = () => {
    webSocketService.disconnect();
    setConnected(false);
    if (subscriptionId) {
      webSocketService.unsubscribe(subscriptionId);
      setSubscriptionId(null);
    }
    addLog('Disconnected from WebSocket server');
  };
  
  // Subscribe to topic
  const handleSubscribe = () => {
    if (!connected) {
      addLog('Not connected to WebSocket server');
      return;
    }
    
    if (fileId.trim() === '') {
      addLog('File ID cannot be empty');
      return;
    }
    
    const topic = `/topic/conversion/${fileId}`;
    addLog(`Subscribing to ${topic}`);
    
    const subId = webSocketService.subscribe(topic, (data) => {
      addLog(`Received message: ${JSON.stringify(data)}`);
      
      setProgress(data.percentComplete || 0);
      setStatus(data.status || 'idle');
      setMessage(data.message || '');
      
      if (data.status === 'complete' && data.resultFile) {
        addLog(`Conversion complete: ${data.resultFile}`);
      }
    });
    
    setSubscriptionId(subId);
    addLog(`Subscribed with ID: ${subId}`);
  };
  
  // Unsubscribe from topic
  const handleUnsubscribe = () => {
    if (subscriptionId) {
      webSocketService.unsubscribe(subscriptionId);
      setSubscriptionId(null);
      addLog(`Unsubscribed from topic`);
    }
  };
  
  // Send test progress update
  const handleSendTestProgress = async (percent: number) => {
    try {
      const response = await fetch(`${API_URL}/test/websocket/send-progress?fileId=${fileId}&percent=${percent}&message=Test progress at ${percent}%`, {
        method: 'POST'
      });
      
      if (response.ok) {
        addLog(`Test progress ${percent}% sent`);
      } else {
        addLog(`Failed to send test progress: ${response.statusText}`);
      }
    } catch (error) {
      addLog(`Error sending test progress: ${error}`);
    }
  };
  
  // Simulate full conversion
  const handleSimulateConversion = async () => {
    try {
      const response = await fetch(`${API_URL}/test/websocket/simulate-conversion?fileId=${fileId}&duration=5`, {
        method: 'POST'
      });
      
      if (response.ok) {
        addLog(`Conversion simulation started for file ID: ${fileId}`);
      } else {
        addLog(`Failed to start simulation: ${response.statusText}`);
      }
    } catch (error) {
      addLog(`Error starting simulation: ${error}`);
    }
  };
  
  // Helper to add logs
  const addLog = (log: string) => {
    setLogs(prevLogs => {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      return [`[${timestamp}] ${log}`, ...prevLogs.slice(0, 49)]; // Keep last 50 logs only
    });
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (subscriptionId) {
        webSocketService.unsubscribe(subscriptionId);
      }
      webSocketService.disconnect();
    };
  }, [subscriptionId]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WebSocket Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{connected ? 'Connected' : 'Not Connected'}</span>
            
            {!connected ? (
              <Button onClick={handleConnect} variant="default" size="sm">Connect</Button>
            ) : (
              <Button onClick={handleDisconnect} variant="outline" size="sm">Disconnect</Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Input 
              value={fileId} 
              onChange={(e) => setFileId(e.target.value)}
              placeholder="File ID for subscription"
              className="flex-1"
            />
            {!subscriptionId ? (
              <Button onClick={handleSubscribe} disabled={!connected}>Subscribe</Button>
            ) : (
              <Button onClick={handleUnsubscribe} variant="outline">Unsubscribe</Button>
            )}
          </div>
          
          {subscriptionId && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleSendTestProgress(0)} size="sm" variant="outline">0%</Button>
                <Button onClick={() => handleSendTestProgress(25)} size="sm" variant="outline">25%</Button>
                <Button onClick={() => handleSendTestProgress(50)} size="sm" variant="outline">50%</Button>
                <Button onClick={() => handleSendTestProgress(75)} size="sm" variant="outline">75%</Button>
                <Button onClick={() => handleSendTestProgress(100)} size="sm" variant="outline">100%</Button>
                <Button onClick={handleSimulateConversion} size="sm">Simulate Conversion</Button>
              </div>
              
              <div className="space-y-2">
                <ProgressBar progress={progress} label="Conversion Progress" showValue />
                <p className="text-sm">{message}</p>
                
                {status === 'complete' && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Conversion Complete</AlertTitle>
                    <AlertDescription className="text-green-700">
                      The file was successfully processed.
                    </AlertDescription>
                  </Alert>
                )}
                
                {status === 'error' && (
                  <Alert className="bg-rose-50 border-rose-200" variant="destructive">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <AlertTitle className="text-rose-800">Conversion Failed</AlertTitle>
                    <AlertDescription className="text-rose-700">{message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
          
          <div className="border rounded-md p-2 mt-4 h-60 overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Event Log</h3>
            <div className="text-xs font-mono space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="border-b border-gray-100 pb-1">{log}</div>
              ))}
              {logs.length === 0 && <div className="text-gray-400">No events logged</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}