'use client';

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignIn appearance={{
        elements: {
          rootBox: "mx-auto w-full max-w-md",
          card: "bg-white shadow-md rounded-lg",
        }
      }} />
    </div>
  );
}