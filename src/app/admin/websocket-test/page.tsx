import React from 'react';
import { WebSocketTester } from '@/components/admin/WebSocketTester';

export default function WebSocketTestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">WebSocket Connection Tester</h1>
      <div className="max-w-4xl">
        <WebSocketTester />
      </div>
    </div>
  );
}