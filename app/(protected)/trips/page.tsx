'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, Search, MapPin, Calendar, DollarSign, MoreVertical, Trash2, Edit, Copy, Eye, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useTrips, Trip } from '@/hooks/useTrips';

const STATUS_CONFIG = {
  ONGOING:   { label: 'Ongoing',   dot: 'bg-forest',           badge: 'bg-forest/10 text-forest',         header: 'text-forest' },
  UPCOMING:  { label: 'Upcoming',  dot: 'bg-gold',             badge: 'bg-gold/10 text-gold',             header: 'text-gold' },
  DRAFT:     { label: 'Draft',     dot: 'bg-earth-muted',      badge: 'bg-paper-dark text-earth-muted',   header: 'text-earth-muted' },
  COMPLETED: { label: 'Completed', dot: 'bg-earth-muted/40',   badge: 'bg-paper-dark text-earth-muted',   header: 'text-earth-muted' },
};

function TripRow({ trip, onDelete }: { trip: Trip; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const stopsCount = (trip as any).stops?.length ?? 0;
  const stopNames = (trip as any).stops?.slice(0, 3).map((s: any) => s.cityName).join(', ') ?? '';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="bg-white rounded-[24px] border border-earth-muted/10 flex flex-col sm:flex-row items-center gap-4 p-4 hover:shadow-premium transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0 rounded-[16px] overflow-hidden bg-paper-dark">
        <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url("${(trip as any).coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}")` }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 w-full">
        <h3 className="text-card-heading text-earth truncate mb-1">{trip.name}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-earth-muted font-body">
          {(trip.startDate || trip.endDate) && (
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?'}
              {' – '}
              {trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '?'}
            </span>
          )}
          {stopsCount > 0 && (
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {stopsCount} stops{stopNames ? `: ${stopNames}${stopsCount > 3 ? '...' : ''}` : ''}
            </span>
          )}
          {trip.budget && (
            <span className="flex items-center gap-1">
              <DollarSign size={13} />
              ${Number(trip.budget).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-earth/5">
        <span className={`text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${cfg.badge}`}>{cfg.label}</span>
        <Link href={`/trips/${trip.id}`}
          className="hidden md:flex text-sm font-body text-earth-muted border border-earth-muted/20 hover:border-gold hover:text-gold rounded-full px-3 py-1.5 transition-colors">
          View
        </Link>
        {/* 3-dot menu */}
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(p => !p)}
            className="w-8 h-8 rounded-full hover:bg-paper-dark flex items-center justify-center text-earth-muted hover:text-earth transition-colors">
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white rounded-[16px] shadow-xl border border-earth-muted/10 overflow-hidden z-50 min-w-[160px]">
              {[
                { icon: <Eye size={14}/>, label: 'View trip', href: `/trips/${trip.id}` },
                { icon: <Edit size={14}/>, label: 'Edit trip', href: `/trips/${trip.id}/edit` },
                { icon: <Copy size={14}/>, label: 'Duplicate', action: () => {} },
              ].map((item, i) => (
                item.href
                  ? <Link key={i} href={item.href} className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper-dark text-earth text-sm font-body transition-colors">
                      <span className="text-gold">{item.icon}</span>{item.label}
                    </Link>
                  : <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-paper-dark text-earth text-sm font-body transition-colors">
                      <span className="text-gold">{item.icon}</span>{item.label}
                    </button>
              ))}
              <div className="border-t border-earth-muted/10" />
              <button onClick={() => { onDelete(trip.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-error text-sm font-body transition-colors">
                <Trash2 size={14} /> Delete trip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusGroup({ status, trips, onDelete }: { status: string; trips: Trip[]; onDelete: (id: string) => void }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
  const muted = status === 'COMPLETED';

  return (
    <div className={muted ? 'opacity-70' : ''}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <h2 className={`font-body text-xs uppercase tracking-widest font-semibold ${cfg.header}`}>{cfg.label}</h2>
        <span className="font-body text-xs text-earth-muted bg-paper-dark px-2 py-0.5 rounded-full">{trips.length} trip{trips.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-col gap-3">
        {trips.map(t => <TripRow key={t.id} trip={t} onDelete={onDelete} />)}
      </div>
    </div>
  );
}

export default function MyTripsPage() {
  const { trips, isLoading, error, fetchTrips, deleteTrip } = useTrips();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('startDate');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = trips.filter(t => search ? t.name.toLowerCase().includes(search.toLowerCase()) : true);

  const grouped = {
    ONGOING:   filtered.filter(t => t.status === 'ONGOING'),
    UPCOMING:  filtered.filter(t => t.status === 'UPCOMING'),
    DRAFT:     filtered.filter(t => t.status === 'DRAFT'),
    COMPLETED: filtered.filter(t => t.status === 'COMPLETED'),
  };

  const sortedGroups = [
    ...grouped.ONGOING,
    ...grouped.UPCOMING,
    ...grouped.DRAFT,
    ...grouped.COMPLETED,
  ].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'budget') return (Number(b.budget) || 0) - (Number(a.budget) || 0);
    const da = a.startDate ? new Date(a.startDate).getTime() : 0;
    const db = b.startDate ? new Date(b.startDate).getTime() : 0;
    return da - db;
  });

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
    try { await deleteTrip(id); } catch {}
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-container py-10 md:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
        <div>
          <p className="font-body text-[11px] md:text-xs uppercase tracking-widest text-earth-muted mb-2">My Account</p>
          <h1 className="text-[36px] md:text-section-heading text-earth font-heading italic leading-tight">My Journeys</h1>
        </div>
        <Link href="/trips/new"
          className="flex items-center gap-2 bg-gold text-white rounded-pill px-6 py-3.5 font-body font-medium text-sm hover:bg-gold-dark transition-all shadow-lg w-full md:w-auto justify-center">
          <Plus size={16} /> Plan New Trip
        </Link>
      </div>

      {/* Filter / Sort Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
          <input type="text" placeholder="Search my trips..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-pill border border-earth-muted/20 bg-white font-body text-sm text-earth placeholder:text-earth-muted/50 outline-none focus:border-gold/40 transition-colors" />
        </div>
        <div className="relative">
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="h-11 pl-4 pr-8 rounded-pill border border-earth-muted/20 bg-white font-body text-sm text-earth outline-none focus:border-gold/40 appearance-none cursor-pointer transition-colors">
            <option value="startDate">Sort: Date</option>
            <option value="name">Sort: Name</option>
            <option value="budget">Sort: Budget</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-muted pointer-events-none" />
        </div>
      </div>

      {/* Delete confirmation banner */}
      {deleteConfirm && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <p className="text-sm font-body text-red-700">Are you sure you want to delete this trip? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="text-sm font-body text-earth-muted hover:text-earth">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="text-sm font-body text-error font-medium">Delete</button>
          </div>
        </div>
      )}

      {/* States */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-paper-dark rounded-[20px] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 font-body text-sm">{error}</div>
      )}

      {!isLoading && !error && trips.length === 0 && (
        <div className="border-2 border-dashed border-earth-muted/20 rounded-[24px] p-16 flex flex-col items-center text-center gap-4">
          <MapPin size={32} className="text-gold/40" />
          <h3 className="font-heading italic text-2xl text-earth">No journeys yet</h3>
          <p className="font-body text-earth-muted text-sm max-w-sm">Start planning your first cinematic trip and it will appear here.</p>
          <Link href="/trips/new" className="mt-2 bg-gold text-white rounded-pill px-6 py-3 text-sm font-body font-medium hover:bg-[#B58A40] transition-colors flex items-center gap-2">
            <Plus size={16} /> Plan your first trip →
          </Link>
        </div>
      )}

      {!isLoading && !error && trips.length > 0 && (
        <div className="flex flex-col gap-10">
          {grouped.ONGOING.length > 0 && <StatusGroup status="ONGOING" trips={grouped.ONGOING} onDelete={handleDelete} />}
          {grouped.UPCOMING.length > 0 && <StatusGroup status="UPCOMING" trips={grouped.UPCOMING} onDelete={handleDelete} />}
          {grouped.DRAFT.length > 0 && <StatusGroup status="DRAFT" trips={grouped.DRAFT} onDelete={handleDelete} />}
          {grouped.COMPLETED.length > 0 && <StatusGroup status="COMPLETED" trips={grouped.COMPLETED} onDelete={handleDelete} />}

          {filtered.length === 0 && search && (
            <div className="text-center py-10 font-body text-earth-muted italic">
              No trips matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
