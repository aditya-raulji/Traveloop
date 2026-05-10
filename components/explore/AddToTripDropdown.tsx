'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronDown, Check, Loader2 } from 'lucide-react';

interface Trip {
  id: string;
  name: string;
  stops?: Array<{ id: string; cityName: string; order: number }>;
}

interface AddToTripDropdownProps {
  cityName?: string;
  activityId?: string;
  activityName?: string;
  mode: 'city' | 'activity';
  className?: string;
}

export function AddToTripDropdown({
  cityName,
  activityId,
  activityName,
  mode,
  className = '',
}: AddToTripDropdownProps) {
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadTrips() {
    setLoading(true);
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      // /api/trips returns a plain array of trips (not {trips:[]})
      const tripList = Array.isArray(data) ? data : (data.trips ?? []);
      setTrips(tripList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleToggle() {
    if (!open) loadTrips();
    setOpen(!open);
  }

  async function handleSelectTrip(trip: Trip) {
    setAdding(trip.id);
    try {
      if (mode === 'city') {
        // Navigate to trip builder with city pre-selected
        router.push(`/trips/${trip.id}/build?city=${encodeURIComponent(cityName || '')}`);
        return;
      }

      if (mode === 'activity' && activityId) {
        // Find the first stop or use the trip
        const stop = trip.stops?.[0];
        if (!stop) {
          // Navigate to trip builder
          router.push(`/trips/${trip.id}/build`);
          return;
        }
        const res = await fetch(`/api/trips/${trip.id}/stops/${stop.id}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityId }),
        });
        if (res.ok) {
          setSuccess(trip.id);
          setTimeout(() => { setSuccess(null); setOpen(false); }, 1500);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-4 py-2 bg-[var(--gold)] text-white text-sm font-medium rounded-full hover:bg-[var(--gold-dark,#b8922a)] transition-all duration-200 active:scale-95"
      >
        <Plus size={14} />
        Add to Trip
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-56 bg-[#1a1814] border border-[rgba(212,175,55,0.2)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-3 border-b border-[rgba(212,175,55,0.1)]">
            <p className="text-[var(--gold)] text-xs font-semibold uppercase tracking-wider">
              {mode === 'city' ? `Add ${cityName}` : `Add activity`}
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Select a trip</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 size={16} className="text-[var(--gold)] animate-spin" />
            </div>
          ) : trips.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-[var(--text-muted)] text-xs">No trips yet</p>
              <button
                onClick={() => router.push('/trips/new')}
                className="mt-2 text-[var(--gold)] text-xs underline"
              >
                Create a trip
              </button>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => handleSelectTrip(trip)}
                  disabled={!!adding}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[rgba(212,175,55,0.08)] transition-colors text-left"
                >
                  <span className="text-sm text-[var(--text-primary)] truncate">{trip.name}</span>
                  {adding === trip.id ? (
                    <Loader2 size={12} className="text-[var(--gold)] animate-spin flex-shrink-0" />
                  ) : success === trip.id ? (
                    <Check size={12} className="text-green-400 flex-shrink-0" />
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
