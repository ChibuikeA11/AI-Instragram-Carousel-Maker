"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "This tool has completely transformed how I create content for Instagram. The AI-generated carousels are stunning and save me hours of work!",
    rating: 5,
  },
  {
    name: "Mark Chen",
    role: "Digital Marketer",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "The best investment for my social media strategy. The templates are professional, and the AI understands exactly what I need.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Social Media Manager",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "I manage multiple accounts and this tool has become indispensable. The carousel generation is fast, and the results are always engaging.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by Content Creators
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            See what our users are saying about their experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}