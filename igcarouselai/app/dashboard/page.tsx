'use client';

import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      {/* Add your dashboard content here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600">Welcome to Carousel AI! Start creating your first carousel.</p>
        </div>
      </div>
    </div>
  );
}