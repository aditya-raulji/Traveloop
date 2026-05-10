'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1 — HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600")' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#2B241D]/35 z-10" />
        
        {/* Grain overlay via global CSS applies to body, but we can ensure it here if needed */}
        
        {/* Content Container */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center left-[10%] top-[10%] md:top-[15%] max-w-3xl pr-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="uppercase tracking-widest text-white/60 text-xs font-body mb-6"
          >
            ✦ YOUR STORY STARTS HERE
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-heading italic font-semibold text-white text-[56px] md:text-[80px] leading-[1] tracking-[1px] mb-6"
          >
            Explore <br/>
            Untamed Journeys
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-[18px] text-white/75 leading-[1.8] max-w-[480px] mb-10"
          >
            Plan your dream trip. Build your perfect itinerary. Let your adventure begin with Traveloop's cinematic planner.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <Link 
              href="/register" 
              className="bg-gold text-white rounded-pill px-8 py-4 font-medium hover:bg-[#B58A40] transition-all duration-400 transform hover:-translate-y-[2px]"
            >
              Start Planning →
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-white/60 underline hover:text-white transition-colors"
            >
              See how it works
            </Link>
          </motion.div>
        </div>

        {/* Bottom Decorative Section */}
        <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center">
          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-8 text-white/50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.div>
          
          {/* Curved SVG Line */}
          <svg className="w-full h-12 text-paper fill-current" viewBox="0 0 1440 48" preserveAspectRatio="none">
            <path d="M0,48 C480,0 960,0 1440,48 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>
    </div>
  );
}
