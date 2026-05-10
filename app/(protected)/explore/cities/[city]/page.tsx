'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Globe, DollarSign, Calendar, Languages, Coins, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { ActivityListCard } from '@/components/explore/ActivityListCard';
import { AddToTripDropdown } from '@/components/explore/AddToTripDropdown';
import { CityData } from '@/lib/data/cities';

import { cn } from '@/lib/utils';

const CATEGORY_FILTERS = ['All', 'Sightseeing', 'Food & Dining', 'Adventure', 'Culture', 'Shopping', 'Nature'];

interface Activity {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  city: string;
  country?: string | null;
  avgCost?: number | null;
  duration?: number | null;
  imageUrl?: string | null;
  rating: number;
}

export default function CityDetailPage() {
  const { city: citySlug } = useParams<{ city: string }>();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchCity() {
      setLoading(true);
      try {
        const res = await fetch(`/api/cities/${citySlug}`);
        if (!res.ok) throw new Error('City not found');
        const data = await res.json();
        setCityData(data.city);
        setActivities(data.activities ?? []);
        setFilteredActivities(data.activities ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (citySlug) fetchCity();
  }, [citySlug]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter((a) => a.category === activeCategory));
    }
  }, [activeCategory, activities]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--gold)] border-t-transparent" />
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--text-muted)] text-lg">City not found</p>
        <Link href="/explore/cities" className="text-[var(--gold)] underline">← Back to Cities</Link>
      </div>
    );
  }

  const INFO_ITEMS = [
    { icon: <DollarSign size={13} />, label: `~$${cityData.avgDailyBudget}/day` },
    { icon: <Calendar size={13} />, label: cityData.bestMonths },
    { icon: <Languages size={13} />, label: cityData.language },
    { icon: <Coins size={13} />, label: cityData.currency },
    { icon: <Clock size={13} />, label: cityData.timeZone },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pb-24">
      {/* Hero Image */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={cityData.imageUrl}
          alt={cityData.name}
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.85) brightness(0.75)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <Link
          href="/explore/cities"
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          All Cities
        </Link>

        {/* City name */}
        <div className="absolute bottom-8 left-8">
          <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">
            {cityData.continent} · {cityData.country}
          </p>
          <h1 className="text-hero-heading text-white leading-tight">
            {cityData.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {cityData.bestFor.map((tag) => (
              <span 
                key={tag} 
                className="text-[12px] px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-container mt-8">
        {/* Info pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {INFO_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/30 rounded-full text-sm text-white backdrop-blur-md"
            >
              <span className="text-white/80">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-[720px] mb-10">
          <p className="text-[var(--text-primary)] text-base leading-relaxed mb-4">
            {cityData.description}
          </p>
          <p className="text-[var(--text-muted)] text-base leading-relaxed">
            From its world-renowned landmarks to hidden local gems, {cityData.name} offers an unforgettable travel experience that blends {cityData.bestFor.slice(0, 2).join(' and ').toLowerCase()} in equal measure. Whether you're planning a quick weekend getaway or an extended stay, you'll find something new to love every day.
          </p>
        </div>

        {/* Activities section */}
        <div>
          <h2 className="font-['Cormorant_Garamond'] italic text-3xl text-[var(--text-primary)] mb-5">
            Things to Do in {cityData.name}
          </h2>

          {/* Category filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 px-5 py-2 rounded-full text-sm transition-all duration-200",
                  activeCategory === cat
                    ? 'bg-earth text-paper border-earth'
                    : 'bg-transparent border border-earth/30 text-earth hover:bg-earth/5'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p>No activities found for this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <ActivityListCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d0c0a]/90 backdrop-blur-xl border-t border-[rgba(212,175,55,0.15)] p-4 flex items-center justify-between z-50">
        <div>
          <p className="text-[var(--text-primary)] font-semibold">{cityData.name}</p>
          <p className="text-[var(--text-muted)] text-sm">~${cityData.avgDailyBudget}/day avg. budget</p>
        </div>
        <AddToTripDropdown mode="city" cityName={cityData.name} className="flex-shrink-0" />
      </div>
    </div>
  );
}
