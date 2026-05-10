'use client';

import { Star, Clock, DollarSign, MapPin, Eye } from 'lucide-react';
import Link from 'next/link';
import { AddToTripDropdown } from './AddToTripDropdown';

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

const CATEGORY_ICONS: Record<string, string> = {
  'Sightseeing': '🏛',
  'Food & Dining': '🍜',
  'Adventure': '🧗',
  'Culture': '🎭',
  'Shopping': '🛍',
  'Transport': '🚌',
  'Stay': '🏨',
  'Nature': '🌿',
};

function formatDuration(mins?: number | null) {
  if (!mins) return 'Varies';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

interface ActivityListCardProps {
  activity: Activity;
}

export function ActivityListCard({ activity }: ActivityListCardProps) {
  const icon = CATEGORY_ICONS[activity.category] ?? '📍';

  return (
    <div className="group flex gap-0 rounded-[20px] overflow-hidden bg-[#1a1814] border border-[rgba(212,175,55,0.12)] hover:border-[rgba(212,175,55,0.3)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative w-[140px] flex-shrink-0 overflow-hidden">
        <img
          src={activity.imageUrl ?? `https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80`}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: 'contrast(1.05) saturate(0.9) brightness(0.9)' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1814]/20" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-['Cormorant_Garamond'] italic text-[1.15rem] text-white leading-tight">
              {activity.name}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={13} className="text-[var(--gold)] fill-[var(--gold)]" />
              <span className="text-sm font-semibold text-[var(--gold)]">{activity.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.35)] text-[var(--gold)]">
              {icon} {activity.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-white/50">
              <MapPin size={10} />
              <span>{activity.city}{activity.country ? `, ${activity.country}` : ''}</span>
            </div>
          </div>

          {activity.description && (
            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)] flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <Clock size={11} />
              <span>{formatDuration(activity.duration)}</span>
            </div>
            {activity.avgCost !== null && activity.avgCost !== undefined && (
              <div className="flex items-center gap-1">
                <DollarSign size={11} />
                <span>{activity.avgCost === 0 ? 'Free' : `$${activity.avgCost}`}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/explore/cities/${encodeURIComponent(activity.city)}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.35)] text-xs text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)] transition-colors"
            >
              <Eye size={11} />
              View
            </Link>
            <AddToTripDropdown mode="activity" activityId={activity.id} activityName={activity.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
