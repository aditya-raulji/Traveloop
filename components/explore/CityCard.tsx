'use client';

import Link from 'next/link';
import { MapPin, DollarSign } from 'lucide-react';
import { AddToTripDropdown } from './AddToTripDropdown';
import { CityData } from '@/lib/data/cities';

interface CityCardProps {
  city: CityData;
}

const BUDGET_COLORS: Record<string, string> = {
  Budget: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  'Mid-range': 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  Luxury: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
};

export function CityCard({ city }: CityCardProps) {
  return (
    <div className="group relative rounded-[20px] overflow-hidden bg-[#1a1814] border border-[rgba(212,175,55,0.12)] hover:border-[rgba(212,175,55,0.35)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Image */}
      <Link href={`/explore/cities/${encodeURIComponent(city.name)}`}>
        <div className="relative h-[280px] overflow-hidden cursor-pointer">
          <img
            src={city.imageUrl}
            alt={city.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ filter: 'contrast(1.05) saturate(0.9) brightness(0.85)' }}
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Budget badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${BUDGET_COLORS[city.budgetLevel]}`}>
              {city.budgetLevel}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/explore/cities/${encodeURIComponent(city.name)}`}>
          <h3 className="font-['Cormorant_Garamond'] italic text-[1.4rem] text-[var(--text-primary)] leading-tight hover:text-[var(--gold)] transition-colors cursor-pointer">
            {city.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-0.5 mb-3">
          <MapPin size={12} className="text-[var(--text-muted)]" />
          <span className="text-sm text-[var(--text-muted)]">{city.country}</span>
          <span className="mx-1 text-[var(--text-muted)]">·</span>
          <span className="text-xs text-[var(--text-muted)]">{city.continent}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {city.bestFor.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full border border-[rgba(212,175,55,0.2)] text-[var(--gold)] bg-[rgba(212,175,55,0.05)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(212,175,55,0.1)]">
          <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
            <DollarSign size={13} className="text-[var(--gold)]" />
            <span>~${city.avgDailyBudget}/day</span>
          </div>
          <AddToTripDropdown mode="city" cityName={city.name} />
        </div>
      </div>
    </div>
  );
}
