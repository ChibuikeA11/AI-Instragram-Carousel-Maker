"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for trying out our platform",
    features: [
      "3 carousel generations per month",
      "Basic templates",
      "Standard image quality",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    description: "Best for content creators and social media managers",
    features: [
      "50 carousel generations per month",
      "Premium templates",
      "High-quality image generation",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "99",
    description: "For teams and businesses",
    features: [
      "Unlimited carousel generations",
      "Custom templates",
      "Highest quality image generation",
      "Dedicated support",
      "Team collaboration",
      "API access",
      "Advanced analytics",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your content creation needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative ${
                tier.popular
                  ? "border-2 border-blue-500 shadow-blue-100 dark:shadow-blue-900/20"
                  : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="text-green-500 w-5 h-5 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-8 ${
                    tier.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      : ""
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}