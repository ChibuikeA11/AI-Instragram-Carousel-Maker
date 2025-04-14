"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { AvatarCirclesDemo } from "@/components/magicui/AvatarCirclesDemo";

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-12 w-64 h-64 animate-float">
          <Image
            src="/globe.svg"
            alt="Globe illustration"
            width={256}
            height={256}
            className="opacity-10"
          />
        </div>
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 animate-float" style={{ animationDelay: "-2s" }}>
          <Image
            src="/window.svg"
            alt="Window illustration"
            width={256}
            height={256}
            className="opacity-10"
          />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Create Stunning <AnimatedGradientText>Instagram Carousels</AnimatedGradientText> with AI
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Transform your ideas into engaging carousel posts in minutes. 
          Powered by GPT-4 and DALL-E for professional-quality content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Try It Free <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            View Examples
          </Button>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-400 mb-4">Trusted by creators worldwide</p>
          <AvatarCirclesDemo />
        </div>
      </div>
    </section>
  );
}