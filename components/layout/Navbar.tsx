'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/dashboard' },
    { label: 'My Trips', href: '/trips' },
    { label: 'Explore', href: '/explore/cities' },
    { label: 'Community', href: '/community' },
    { label: 'Profile', href: '/profile' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'backdrop-blur-md bg-paper/70 border-b border-gold/20 py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link href="/">
          <span className="font-heading italic text-2xl text-earth">Traveloop</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="uppercase tracking-widest text-xs font-body text-earth-muted hover:text-earth transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="ghost">Login</Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-earth"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-paper border-b border-gold/20 p-6 flex flex-col gap-6 shadow-lg">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="uppercase tracking-widest text-sm font-body text-earth-muted hover:text-earth transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="justify-start px-0 text-sm">
            Login
          </Button>
        </div>
      )}
    </nav>
  );
}
