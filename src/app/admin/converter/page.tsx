"use client";

import { VideoConverter } from "@/components/admin/VideoConverter";

export default function AdminConverterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Video Converter</h2>
        <p className="text-muted-foreground">
          Convert your video files to WebM format with real-time progress tracking
        </p>
      </div>
      
      <VideoConverter />
    </div>
  );
}