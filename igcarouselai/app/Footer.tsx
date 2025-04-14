"use client";

import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Instagram Carousel AI</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create stunning carousel posts with AI assistance
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="text-gray-500 hover:text-gray-700">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="https://github.com" className="text-gray-500 hover:text-gray-700">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://instagram.com" className="text-gray-500 hover:text-gray-700">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-500 hover:text-gray-700">Features</Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-500 hover:text-gray-700">Pricing</Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-500 hover:text-gray-700">Testimonials</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-500 hover:text-gray-700">Documentation</Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-500 hover:text-gray-700">Guides</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-700">About</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-700">Privacy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-gray-700">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Instagram Carousel AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}