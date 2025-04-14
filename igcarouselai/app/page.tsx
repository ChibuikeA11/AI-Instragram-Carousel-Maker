import Image from "next/image";

import Hero from "./Hero";
import Howitworks from "./Howitworks";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div id="home">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="how-it-works">
        <Howitworks />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
    </main>
  );
}
