"use client";

import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Enter Your Prompt",
    description: "Describe your carousel content and style in natural language. Our AI understands your creative vision.",
  },
  {
    number: "02",
    title: "AI Generation",
    description: "Watch as GPT-4 and DALL-E create stunning visuals and compelling content for your carousel.",
  },
  {
    number: "03",
    title: "Customize & Edit",
    description: "Fine-tune your carousel with our intuitive editor. Adjust text, images, and layouts until perfect.",
  },
  {
    number: "04",
    title: "Export & Share",
    description: "Download your carousel or share directly to Instagram with one click.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Create engaging Instagram carousels in four simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
              {parseInt(step.number) !== 4 && (
                <div className="hidden lg:block absolute top-1/2 -right-12 w-24 h-0.5 bg-gray-200 dark:bg-gray-800" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Try It Now
          </Button>
        </div>
      </div>
    </section>
  );
}