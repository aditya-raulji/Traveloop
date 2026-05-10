'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users, Compass, Map, Share2 } from 'lucide-react';
import { DestinationCard, destinations } from '@/components/destinations/DestinationCard';

const demoTrips = [
  {
    id: 'demo-1',
    name: 'Golden Days in Tuscany',
    img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800',
    start: 'Jun 12',
    end: 'Jun 22, 2025',
  },
  {
    id: 'demo-2',
    name: 'Norwegian Fjord Adventure',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
    start: 'Aug 3',
    end: 'Aug 15, 2025',
  },
  {
    id: 'demo-3',
    name: 'Ancient Ruins of Athens',
    img: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800',
    start: 'Sep 20',
    end: 'Sep 28, 2025',
  },
];

export default function LandingPage() {
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');
  const [travelers, setTravelers] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      {/* SECTION 1 — HERO */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600")' }}
        />
        <div className="absolute inset-0 bg-[#2B241D]/35 z-10" />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:pl-[10%] pt-24 md:pt-0">
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
            className="text-hero-heading font-semibold text-white leading-[1.1] tracking-[1px] mb-6 max-w-3xl"
          >
            Explore<br />Untamed Journeys
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-body-responsive text-white/75 leading-[1.8] max-w-[480px] mb-10"
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
              className="bg-gold text-white rounded-pill px-8 py-4 font-medium font-body hover:bg-[#B58A40] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
            >
              Start Planning →
            </Link>
            <a href="#how-it-works" className="text-white/60 underline hover:text-white transition-colors font-body">
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Bottom elements */}
        <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-8 text-white/50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
          <svg className="w-full h-12 text-paper fill-current" viewBox="0 0 1440 48" preserveAspectRatio="none">
            <path d="M0,48 C480,0 960,0 1440,48 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      {/* SECTION 2 — QUICK SEARCH BAR */}
      <section className="relative z-30 -mt-8 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-paper shadow-premium rounded-[24px] md:rounded-pill p-4 md:p-2 flex flex-col md:flex-row items-center gap-4">
            <div className="flex flex-col md:flex-row flex-1 w-full">
              <div className="flex items-center gap-3 flex-1 px-4 py-3 md:py-0 md:border-r border-earth/10">
                <MapPin size={18} className="text-gold flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={where}
                  onChange={e => setWhere(e.target.value)}
                  className="flex-1 bg-transparent font-body text-earth placeholder:text-earth-muted/60 outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3 flex-1 px-4 py-3 md:py-0 md:border-r border-earth/10">
                <Calendar size={18} className="text-gold flex-shrink-0" />
                <input
                  type="text"
                  placeholder="When?"
                  value={when}
                  onChange={e => setWhen(e.target.value)}
                  className="flex-1 bg-transparent font-body text-earth placeholder:text-earth-muted/60 outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3 flex-1 px-4 py-3 md:py-0">
                <Users size={18} className="text-gold flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Travelers"
                  value={travelers}
                  onChange={e => setTravelers(e.target.value)}
                  className="flex-1 bg-transparent font-body text-earth placeholder:text-earth-muted/60 outline-none text-sm"
                />
              </div>
            </div>
            <Link
              href="/register"
              className="bg-gold text-white rounded-pill px-8 py-4 md:py-3 font-medium font-body text-sm hover:bg-gold-dark transition-colors flex-shrink-0 flex items-center gap-2 w-full md:w-auto justify-center shadow-lg"
            >
              <Search size={16} />
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3 — POPULAR DESTINATIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-container">
          <div className="mb-10">
            <h2 className="text-section-heading text-earth leading-tight mb-2">Popular Destinations</h2>
            <p className="font-body text-earth-muted text-base">Handpicked journeys for every kind of traveler</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {destinations.map(dest => (
              <DestinationCard key={dest.city} {...dest} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — RECENT JOURNEYS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-paper-dark/40">
        <div className="max-w-container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-section-heading text-earth leading-tight mb-2">Recent Journeys</h2>
              <p className="font-body text-earth-muted text-base">Stories from our community of travelers</p>
            </div>
            <Link href="/register" className="text-gold font-medium text-sm hover:underline hidden md:block">
              Start your own →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoTrips.map(trip => (
              <div key={trip.id} className="group rounded-[32px] overflow-hidden bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)] transition-all duration-500 cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url("${trip.img}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B241D]/30 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading italic text-2xl text-earth mb-2">{trip.name}</h3>
                  <p className="font-body text-earth-muted text-sm mb-4">{trip.start} – {trip.end}</p>
                  <Link href="/register" className="text-gold font-medium text-sm hover:underline">
                    View Trip →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-container">
          <div className="text-center mb-16">
            <h2 className="text-section-heading text-earth leading-tight mb-3">Plan smarter, travel better</h2>
            <p className="font-body text-earth-muted text-lg">Three simple steps to your perfect journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              num: '01',
              icon: <Compass size={28} />,
              title: 'Build your itinerary',
              desc: 'Drag and drop stops, activities, and restaurants into your perfect day-by-day plan.'
            },
            {
              num: '02',
              icon: <Map size={28} />,
              title: 'Discover activities',
              desc: 'Explore thousands of curated local experiences, hidden gems, and must-sees for every destination.'
            },
            {
              num: '03',
              icon: <Share2 size={28} />,
              title: 'Share your journey',
              desc: 'Post your travel stories, inspire others, and connect with a global community of explorers.'
            }
          ].map(step => (
            <div key={step.num} className="flex flex-col items-center text-center gap-4">
              <span className="font-heading italic text-[72px] text-gold/30 leading-none">{step.num}</span>
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-gold -mt-6">
                {step.icon}
              </div>
              <h3 className="font-heading italic text-2xl text-earth">{step.title}</h3>
              <p className="font-body text-earth-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — PLAN A TRIP CTA */}
      <section className="bg-earth py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-container flex flex-col items-center gap-6">
          <h2 className="text-section-heading text-paper leading-tight">
            Ready to start your adventure?
          </h2>
          <p className="font-body text-paper/70 text-lg leading-relaxed max-w-2xl">
            Join thousands of travelers who plan their journeys with Traveloop — beautifully, effortlessly.
          </p>
          <Link
            href="/register"
            className="bg-gold text-white rounded-pill px-10 py-4 font-medium font-body hover:bg-[#B58A40] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
          >
            Plan a trip →
          </Link>
        </div>
      </section>
    </div>
  );
}
