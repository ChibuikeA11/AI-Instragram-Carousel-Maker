"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wand2, Layout, Image, Share2, Sparkles, Clock } from "lucide-react";

const features = [
  {
    title: "AI-Powered Generation",
    description: "Generate beautiful carousel designs with GPT-4 and DALL-E integration",
    icon: <Wand2 className="w-6 h-6" />,
  },
  {
    title: "Custom Layouts",
    description: "Choose from multiple professional carousel layouts and templates",
    icon: <Layout className="w-6 h-6" />,
  },
  {
    title: "High-Quality Images",
    description: "Create stunning visuals with AI image generation technology",
    icon: <Image className="w-6 h-6" />,
  },
  {
    title: "One-Click Sharing",
    description: "Export and share directly to Instagram with just one click",
    icon: <Share2 className="w-6 h-6" />,
  },
  {
    title: "Smart Suggestions",
    description: "Get AI-powered content and design suggestions for better engagement",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: "Quick Generation",
    description: "Create multiple carousel variations in seconds, not hours",
    icon: <Clock className="w-6 h-6" />,
  },
];

export default function Features() {
  return (
    <section className="w-full py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features for Content Creators
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to create engaging Instagram carousels that capture attention and drive engagement.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="rounded-lg p-2 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}