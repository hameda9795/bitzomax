"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SongsTable } from "@/components/admin/SongsTable";
import { SongUploadForm } from "@/components/admin/SongUploadForm";
import { Plus } from "lucide-react";

export default function SongsPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Song Management</h2>
          <p className="text-muted-foreground">
            Upload, edit, and manage songs on the BitZoMax platform.
          </p>
        </div>
        <Button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          {showUploadForm ? "Cancel Upload" : "Upload New Song"}
        </Button>
      </div>
      
      {showUploadForm && (
        <div className="bg-muted/30 border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Upload New Song</h3>
          <SongUploadForm 
            onComplete={() => setShowUploadForm(false)} 
          />
        </div>
      )}
      
      <SongsTable />
    </div>
  );
}