"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, AlertCircle, CheckCircle, Info } from "lucide-react";
import { TroubleshootService } from "@/lib/services/troubleshoot-service";

export default function TroubleshootingPage() {
  const [ffmpegStatus, setFfmpegStatus] = useState<"pending" | "checking" | "success" | "error">("pending");
  const [ffmpegOutput, setFfmpegOutput] = useState<string>("");
  const [installStatus, setInstallStatus] = useState<"pending" | "installing" | "success" | "error">("pending");
  const [installOutput, setInstallOutput] = useState<string>("");

  const checkFfmpeg = async () => {
    setFfmpegStatus("checking");
    try {
      const result = await TroubleshootService.checkFfmpeg();
      
      if (result.installed) {
        setFfmpegStatus("success");
        setFfmpegOutput(result.output || "FFmpeg is installed");
      } else {
        setFfmpegStatus("error");
        setFfmpegOutput(result.error || "FFmpeg is not installed or not found in PATH");
      }
    } catch (error) {
      setFfmpegStatus("error");
      setFfmpegOutput("Error checking FFmpeg: " + (error as Error).message);
    }
  };

  const installFfmpeg = async () => {
    setInstallStatus("installing");
    try {
      const result = await TroubleshootService.installFfmpeg();
      
      if (result.success) {
        setInstallStatus("success");
        setInstallOutput(result.output || "FFmpeg installed successfully");
      } else {
        setInstallStatus("error");
        setInstallOutput(result.error || "Failed to install FFmpeg");
      }
    } catch (error) {
      setInstallStatus("error");
      setInstallOutput("Error installing FFmpeg: " + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Troubleshooting</h2>
        <p className="text-muted-foreground">
          Diagnose and fix common issues with the BitZoMax server
        </p>
      </div>

      <Tabs defaultValue="ffmpeg">
        <TabsList>
          <TabsTrigger value="ffmpeg">FFmpeg Issues</TabsTrigger>
          <TabsTrigger value="javacv">JavaCV Issues</TabsTrigger>
          <TabsTrigger value="general">General Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ffmpeg" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FFmpeg Troubleshooting</CardTitle>
              <CardDescription>
                Fix issues with video conversion to WebM format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Missing FFmpeg</AlertTitle>
                <AlertDescription>
                  Many conversion errors happen because FFmpeg is not installed on the server or is not in the PATH
                </AlertDescription>
              </Alert>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Step 1: Check FFmpeg Installation</h3>
                  <p className="text-muted-foreground mb-2">
                    First, let's check if FFmpeg is installed and available in the system PATH
                  </p>
                  <Button onClick={checkFfmpeg} disabled={ffmpegStatus === "checking"}>
                    {ffmpegStatus === "checking" ? "Checking..." : "Check FFmpeg"}
                  </Button>

                  {ffmpegStatus === "success" && (
                    <Alert className="mt-2 bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">FFmpeg is properly installed</AlertTitle>
                      <AlertDescription className="text-green-700 mt-2">
                        <pre className="bg-green-100 p-2 rounded text-sm overflow-auto max-h-40">
                          {ffmpegOutput}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  )}

                  {ffmpegStatus === "error" && (
                    <Alert className="mt-2 bg-rose-50 border-rose-200" variant="destructive">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                      <AlertTitle className="text-rose-800">FFmpeg is not properly installed</AlertTitle>
                      <AlertDescription className="text-rose-700">
                        <pre className="bg-rose-100 p-2 rounded text-sm overflow-auto max-h-40">
                          {ffmpegOutput}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {ffmpegStatus === "error" && (
                  <div>
                    <h3 className="text-lg font-medium">Step 2: Install FFmpeg</h3>
                    <p className="text-muted-foreground mb-2">
                      Install FFmpeg to fix the WebM conversion issues
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Option 1: Automated Installation</h4>
                        <p className="text-muted-foreground mb-2">
                          Attempt to automatically download and install FFmpeg
                        </p>
                        <Button onClick={installFfmpeg} disabled={installStatus === "installing"}>
                          {installStatus === "installing" ? "Installing..." : "Install FFmpeg"}
                        </Button>

                        {installStatus === "success" && (
                          <Alert className="mt-2 bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800">FFmpeg installed successfully</AlertTitle>
                            <AlertDescription className="text-green-700">
                              <pre className="bg-green-100 p-2 rounded text-sm overflow-auto max-h-40">
                                {installOutput}
                              </pre>
                            </AlertDescription>
                          </Alert>
                        )}

                        {installStatus === "error" && (
                          <Alert className="mt-2 bg-rose-50 border-rose-200" variant="destructive">
                            <AlertCircle className="h-4 w-4 text-rose-600" />
                            <AlertTitle className="text-rose-800">Installation failed</AlertTitle>
                            <AlertDescription className="text-rose-700">
                              <pre className="bg-rose-100 p-2 rounded text-sm overflow-auto max-h-40">
                                {installOutput}
                              </pre>
                              <p className="mt-2">Please try manual installation instead.</p>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium">Option 2: Manual Installation</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Follow these steps to manually install FFmpeg:
                        </p>
                        <ol className="list-decimal list-outside pl-5 space-y-2 text-sm">
                          <li>
                            <a 
                              href="https://ffmpeg.org/download.html" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Download FFmpeg from the official website
                            </a>
                          </li>
                          <li>Extract the downloaded archive to a folder (e.g., <code>C:\ffmpeg</code>)</li>
                          <li>Add the FFmpeg <code>bin</code> folder to your system PATH:</li>
                          <ol className="list-lower-alpha list-outside pl-5 space-y-1">
                            <li>Open System Properties (Win+Pause or right-click on This PC and select Properties)</li>
                            <li>Click on Advanced System Settings</li>
                            <li>Click on Environment Variables</li>
                            <li>Under System Variables, find the PATH variable, select it and click Edit</li>
                            <li>Click New and add the path to the FFmpeg bin folder (e.g., <code>C:\ffmpeg\bin</code>)</li>
                            <li>Click OK to close all dialogs</li>
                          </ol>
                          <li>Restart the Spring Boot application</li>
                        </ol>
                        
                        <Button variant="outline" className="mt-2" asChild>
                          <a 
                            href="https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download FFmpeg (Windows)
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="javacv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>JavaCV Troubleshooting</CardTitle>
              <CardDescription>
                Fix issues with JavaCV fallback conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Sample Rate Issues</AlertTitle>
                <AlertDescription>
                  The most common JavaCV error is related to unsupported sample rates with the Opus codec
                </AlertDescription>
              </Alert>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Update JavaCV Configuration</h3>
                  <p className="text-muted-foreground">
                    The JavaCV configuration has been updated to use the Vorbis codec instead of Opus, which should resolve the sample rate compatibility issues.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-md mt-2">
                    <h4 className="font-mono text-sm mb-2">Applied Code Change:</h4>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
{`// Changed from Opus to Vorbis codec
recorder.setAudioCodec(avcodec.AV_CODEC_ID_VORBIS); // Use Vorbis instead of Opus`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Restart Application</h3>
                  <p className="text-muted-foreground mb-2">
                    The code changes have been applied to the Java backend. For these changes to take effect, you may need to restart the Spring Boot application.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Troubleshooting Tips</CardTitle>
              <CardDescription>
                Additional guidance for fixing file conversion issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">1. Check File Access</h3>
                <p className="text-muted-foreground">
                  Ensure the application has read/write permissions for the uploads directory and that files aren't locked by other processes.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">2. Install FFmpeg System-Wide</h3>
                <p className="text-muted-foreground">
                  For best compatibility, install FFmpeg system-wide using the platform package manager:
                </p>
                <div className="bg-gray-100 p-2 rounded text-sm mt-2">
                  <p>Windows (with Chocolatey):</p>
                  <pre className="bg-black text-white p-2 rounded">choco install ffmpeg</pre>
                  
                  <p className="mt-2">Linux (Ubuntu/Debian):</p>
                  <pre className="bg-black text-white p-2 rounded">sudo apt update && sudo apt install ffmpeg</pre>
                  
                  <p className="mt-2">macOS (with Homebrew):</p>
                  <pre className="bg-black text-white p-2 rounded">brew install ffmpeg</pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">3. Check Application Logs</h3>
                <p className="text-muted-foreground">
                  Check Spring Boot logs for detailed error messages, especially around file access and conversion processes.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">4. Try Simplified Conversion Settings</h3>
                <p className="text-muted-foreground">
                  If conversion still fails, try simpler conversion parameters that prioritize reliability over quality.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}