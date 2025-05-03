"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SongUploadForm } from "@/components/admin/SongUploadForm";
import { SongsTable } from "@/components/admin/SongsTable";

export default function SongsPage() {
  const [refreshTable, setRefreshTable] = useState(false);

  const handleSongAdded = () => {
    setRefreshTable(prev => !prev);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Song Management</h2>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">Upload Song</TabsTrigger>
          <TabsTrigger value="manage">Manage Songs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="py-4">
          <SongUploadForm onSongAdded={handleSongAdded} />
        </TabsContent>
        
        <TabsContent value="manage" className="py-4">
          <SongsTable key={refreshTable ? "refresh" : "normal"} />
        </TabsContent>
      </Tabs>
    </div>
  );
}