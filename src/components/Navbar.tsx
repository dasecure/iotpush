"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/docs", label: "Docs" },
    { href: "/integrations", label: "Integrations" },
    { href: "#pricing", label: "Pricing" },
    { href: "/login", label: "Login" },
  ];

  return (
    <nav className="fixed w-full bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>iot<span className="text-orange-400">push</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white transition py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-lg font-medium transition text-center mt-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
