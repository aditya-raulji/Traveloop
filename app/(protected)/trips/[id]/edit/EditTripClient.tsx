'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Image as ImageIcon, X, Globe, Lock, DollarSign } from 'lucide-react';
import Link from 'next/link';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
];

export default function EditTripClient({ trip }: { trip: any }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [tripData, setTripData] = useState({
    name: trip.name || '',
    description: trip.description || '',
    startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
    endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
    coverImage: trip.coverImage || '',
    isPublic: trip.isPublic || false,
    budget: trip.budget || 0,
  });

  const [previewUrl, setPreviewUrl] = useState(trip.coverImage || '');

  const onChange = (k: string, v: any) => setTripData(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      if (!res.ok) throw new Error('Failed to update trip');
      router.push(`/trips/${trip.id}`);
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const duration = tripData.startDate && tripData.endDate
    ? Math.max(0, Math.round((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / 86400000))
    : null;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/trips/${trip.id}`} className="w-10 h-10 rounded-full bg-paper-dark flex items-center justify-center text-earth hover:bg-gold/10 hover:text-gold transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-heading italic text-4xl text-earth leading-tight">Edit Trip</h1>
            <p className="font-body text-earth-muted italic text-sm">Update your journey details</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-earth-muted/10">
          <div>
            <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Trip Name *</label>
            <input
              type="text"
              value={tripData.name}
              onChange={e => onChange('name', e.target.value)}
              className="w-full h-14 px-5 rounded-pill border border-earth-muted/20 bg-white font-body text-earth outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Description</label>
            <textarea
              value={tripData.description}
              onChange={e => onChange('description', e.target.value)}
              rows={3}
              className="w-full px-5 py-4 rounded-[20px] border border-earth-muted/20 bg-white font-body text-earth outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Start Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                <input type="date" value={tripData.startDate} onChange={e => onChange('startDate', e.target.value)}
                  className="w-full h-14 pl-10 pr-5 rounded-pill border border-earth-muted/20 bg-white font-body text-earth outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">
                End Date
                {duration !== null && duration > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gold/10 text-gold rounded-full text-xs normal-case">{duration} days</span>
                )}
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                <input type="date" value={tripData.endDate} min={tripData.startDate}
                  onChange={e => onChange('endDate', e.target.value)}
                  className="w-full h-14 pl-10 pr-5 rounded-pill border border-earth-muted/20 bg-white font-body text-earth outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Total Budget</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
              <input type="number" value={tripData.budget || ''} onChange={e => onChange('budget', Number(e.target.value))}
                className="w-full h-14 pl-10 pr-5 rounded-pill border border-earth-muted/20 bg-white font-body text-earth outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Cover Photo</label>
            {previewUrl ? (
              <div className="relative h-48 rounded-[20px] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${previewUrl}")` }} />
                <button onClick={() => { setPreviewUrl(''); onChange('coverImage', ''); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-earth/70 text-white rounded-full flex items-center justify-center hover:bg-earth transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gold/30 rounded-[20px] h-48 flex flex-col items-center justify-center gap-3 bg-paper-dark/40 hover:border-gold/50 transition-colors">
                <ImageIcon size={28} className="text-gold/50" />
                <p className="font-body text-earth-muted text-sm">Choose a preset image</p>
                <div className="flex gap-2 flex-wrap justify-center px-4">
                  {PRESET_IMAGES.map((url, i) => (
                    <button key={i} onClick={() => { setPreviewUrl(url); onChange('coverImage', url); }}
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-gold transition-all">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${url}")` }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-paper-dark rounded-[16px]">
            <div>
              {tripData.isPublic
                ? <p className="font-body text-sm text-forest font-medium flex items-center gap-2"><Globe size={15} /> Public — community can see your journey</p>
                : <p className="font-body text-sm text-earth-muted flex items-center gap-2"><Lock size={15} /> Private — only you can see this</p>}
            </div>
            <button onClick={() => onChange('isPublic', !tripData.isPublic)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${tripData.isPublic ? 'bg-forest' : 'bg-earth-muted/30'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${tripData.isPublic ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-body">{error}</div>}

          <button onClick={handleSubmit} disabled={submitting || tripData.name.trim().length < 2}
            className="w-full h-14 mt-4 rounded-pill bg-gold text-white font-body font-medium hover:bg-[#B58A40] transition-all disabled:opacity-60">
            {submitting ? 'Saving changes...' : 'Save Changes ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}
