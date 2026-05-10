'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, X, GripVertical, Check, Plus, Calendar, DollarSign, Globe, Lock, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

// ── Types ─────────────────────────────────
interface Stop {
  id: string;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
}

interface BudgetCategory {
  label: string;
  percent: number;
  color: string;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
];

// ── Progress Indicator ─────────────────────
function StepIndicator({ current }: { current: number }) {
  const steps = ['Trip basics', 'Choose places', 'Set budget'];
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${done ? 'bg-gold text-white' : active ? 'bg-gold text-white ring-4 ring-gold/20' : 'bg-paper-dark text-earth-muted border border-earth-muted/30'}`}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-body whitespace-nowrap ${active ? 'text-gold font-medium' : done ? 'text-earth' : 'text-earth-muted'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-16 md:w-24 mx-2 mb-5 transition-colors duration-500 ${done ? 'bg-gold' : 'bg-earth-muted/20'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Basics ─────────────────────────
function Step1({ data, onChange }: { data: any; onChange: (k: string, v: any) => void }) {
  const [citySearch, setCitySearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState(data.coverImage || '');

  const duration = data.startDate && data.endDate
    ? Math.max(0, Math.round((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / 86400000))
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Trip Name */}
      <div>
        <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Trip Name *</label>
        <input
          type="text"
          value={data.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="My Himalayan Adventure"
          className="w-full h-14 px-5 rounded-pill border border-earth-muted/20 bg-white font-body text-earth placeholder:text-earth-muted/50 outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Description (optional)</label>
        <textarea
          value={data.description}
          onChange={e => onChange('description', e.target.value)}
          placeholder="A 2-week exploration through..."
          rows={3}
          className="w-full px-5 py-4 rounded-[20px] border border-earth-muted/20 bg-white font-body text-earth placeholder:text-earth-muted/50 outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all resize-none"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Start Date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            <input type="date" value={data.startDate} onChange={e => onChange('startDate', e.target.value)}
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
            <input type="date" value={data.endDate} min={data.startDate}
              onChange={e => onChange('endDate', e.target.value)}
              className="w-full h-14 pl-10 pr-5 rounded-pill border border-earth-muted/20 bg-white font-body text-earth outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
          </div>
        </div>
      </div>

      {/* Cover Image */}
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

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-4 bg-paper-dark rounded-[16px]">
        <div>
          {data.isPublic
            ? <p className="font-body text-sm text-forest font-medium flex items-center gap-2"><Globe size={15} /> Public — community can see your journey</p>
            : <p className="font-body text-sm text-earth-muted flex items-center gap-2"><Lock size={15} /> Private — only you can see this</p>}
        </div>
        <button onClick={() => onChange('isPublic', !data.isPublic)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${data.isPublic ? 'bg-forest' : 'bg-earth-muted/30'}`}>
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${data.isPublic ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Places ─────────────────────────
function Step2({ stops, onAdd, onRemove, onUpdate }: { stops: Stop[]; onAdd: (s: Stop) => void; onRemove: (id: string) => void; onUpdate: (id: string, k: string, v: string | number) => void }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<{ city: string; country: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const totalDays = stops.reduce((acc, s) => {
    if (s.startDate && s.endDate) {
      return acc + Math.max(0, Math.round((new Date(s.endDate).getTime() - new Date(s.startDate).getTime()) / 86400000));
    }
    return acc;
  }, 0);

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (q.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    const res = await fetch(`/api/cities?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSuggestions(data);
    setLoading(false);
  };

  const selectCity = (c: { city: string; country: string }) => {
    const stop: Stop = { id: Date.now().toString(), cityName: c.city, country: c.country, startDate: '', endDate: '', budget: 0 };
    onAdd(stop);
    setSearch('');
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-xs font-body uppercase tracking-widest text-earth-muted mb-2">Search for a city</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold z-10" />
          <input type="text" value={search} onChange={e => handleSearch(e.target.value)}
            placeholder="Search for a city..."
            className="w-full h-14 pl-10 pr-5 rounded-pill border border-earth-muted/20 bg-white font-body text-earth placeholder:text-earth-muted/50 outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all relative z-0" />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-xl border border-earth-muted/10 overflow-hidden z-50">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => selectCity(s)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-paper-dark transition-colors text-left">
                  <MapPin size={14} className="text-gold flex-shrink-0" />
                  <span className="font-body text-earth text-sm">{s.city}</span>
                  <span className="font-body text-earth-muted text-xs ml-auto">{s.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {stops.length === 0 && (
        <div className="border-2 border-dashed border-earth-muted/20 rounded-[20px] p-10 text-center">
          <MapPin size={28} className="text-earth-muted/40 mx-auto mb-3" />
          <p className="font-heading italic text-earth-muted text-xl">No stops yet</p>
          <p className="font-body text-earth-muted/60 text-sm mt-1">Search for a city above to add your first destination</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {stops.map((stop, idx) => (
          <div key={stop.id} className="bg-white border border-earth-muted/15 rounded-[20px] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-earth-muted/40 cursor-grab" />
                <div>
                  <p className="font-heading italic text-xl text-earth">{stop.cityName}</p>
                  <p className="font-body text-xs text-earth-muted uppercase tracking-wide">{stop.country}</p>
                </div>
              </div>
              <button onClick={() => onRemove(stop.id)} className="w-7 h-7 rounded-full bg-paper-dark hover:bg-red-50 text-earth-muted hover:text-error transition-colors flex items-center justify-center">
                <X size={13} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-earth-muted font-body mb-1">Arrival</label>
                <input type="date" value={stop.startDate} onChange={e => onUpdate(stop.id, 'startDate', e.target.value)}
                  className="w-full h-10 px-3 rounded-[12px] border border-earth-muted/15 bg-paper-dark font-body text-sm text-earth outline-none focus:border-gold/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs text-earth-muted font-body mb-1">Departure</label>
                <input type="date" value={stop.endDate} min={stop.startDate} onChange={e => onUpdate(stop.id, 'endDate', e.target.value)}
                  className="w-full h-10 px-3 rounded-[12px] border border-earth-muted/15 bg-paper-dark font-body text-sm text-earth outline-none focus:border-gold/50 transition-all" />
              </div>
            </div>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
              <input type="number" value={stop.budget || ''} onChange={e => onUpdate(stop.id, 'budget', Number(e.target.value))}
                placeholder="Budget for this stop"
                className="w-full h-10 pl-8 pr-3 rounded-[12px] border border-earth-muted/15 bg-paper-dark font-body text-sm text-earth outline-none focus:border-gold/50 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {stops.length > 0 && (
        <div className="text-sm font-body text-earth-muted text-right">
          Total trip duration: <span className="text-earth font-medium">{totalDays} days</span> across <span className="text-earth font-medium">{stops.length} stops</span>
        </div>
      )}
    </div>
  );
}

// ── Step 3: Budget ─────────────────────────
function Step3({ totalBudget, setTotalBudget, categories, setCategories, tripData, stops }: any) {
  const updatePercent = (idx: number, val: number) => {
    const newCats = [...categories];
    const old = newCats[idx].percent;
    const diff = val - old;
    const others = newCats.filter((_, i) => i !== idx);
    const totalOther = others.reduce((a, c) => a + c.percent, 0);
    newCats[idx].percent = val;
    others.forEach((c, i) => {
      const oIdx = newCats.indexOf(c);
      newCats[oIdx].percent = Math.max(0, Math.round(c.percent - (diff * c.percent / totalOther)));
    });
    setCategories(newCats);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Total Budget Input */}
      <div className="text-center">
        <p className="font-body text-earth-muted text-sm mb-3">What's your total budget?</p>
        <div className="flex items-center justify-center gap-2">
          <span className="font-heading italic text-4xl text-gold">$</span>
          <input type="number" value={totalBudget || ''} onChange={e => setTotalBudget(Number(e.target.value))}
            placeholder="5,000"
            className="font-heading italic text-4xl text-earth w-40 bg-transparent outline-none border-b-2 border-gold/40 focus:border-gold text-center transition-colors" />
        </div>
      </div>

      {/* Category Sliders */}
      {totalBudget > 0 && (
        <div className="bg-paper-dark rounded-[20px] p-6 flex flex-col gap-5">
          <h3 className="font-heading italic text-xl text-earth mb-1">Budget breakdown</h3>
          {categories.map((cat: BudgetCategory, i: number) => (
            <div key={cat.label} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-earth">{cat.label}</span>
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-earth-muted w-8 text-right">{cat.percent}%</span>
                  <span className="font-heading italic text-earth font-medium w-16 text-right">
                    ${Math.round(totalBudget * cat.percent / 100).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-white rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${cat.percent}%`, backgroundColor: '#B08968' }} />
              </div>
              <input type="range" min={0} max={80} value={cat.percent}
                onChange={e => updatePercent(i, Number(e.target.value))}
                className="w-full accent-gold cursor-pointer" />
            </div>
          ))}
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-earth text-paper rounded-[20px] p-6 flex flex-col gap-4">
        <h3 className="font-heading italic text-2xl text-paper/90">Trip Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm font-body">
          <div>
            <p className="text-paper/50 text-xs uppercase tracking-wide mb-0.5">Trip Name</p>
            <p className="text-paper font-medium">{tripData.name || '—'}</p>
          </div>
          <div>
            <p className="text-paper/50 text-xs uppercase tracking-wide mb-0.5">Dates</p>
            <p className="text-paper font-medium">
              {tripData.startDate ? new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
              {tripData.endDate ? ` – ${new Date(tripData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
            </p>
          </div>
          <div>
            <p className="text-paper/50 text-xs uppercase tracking-wide mb-0.5">Stops</p>
            <p className="text-paper font-medium">{stops.length} {stops.length === 1 ? 'stop' : 'stops'}</p>
          </div>
          <div>
            <p className="text-paper/50 text-xs uppercase tracking-wide mb-0.5">Total Budget</p>
            <p className="text-gold font-medium font-heading italic text-lg">${(totalBudget || 0).toLocaleString()}</p>
          </div>
        </div>
        <span className={`self-start px-3 py-1 rounded-full text-xs font-medium ${tripData.isPublic ? 'bg-forest/20 text-green-300' : 'bg-white/10 text-paper/60'}`}>
          {tripData.isPublic ? '🌍 Public' : '🔒 Private'}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────
export default function CreateTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [tripData, setTripData] = useState({
    name: '', description: '', startDate: '', endDate: '', coverImage: '', isPublic: false,
  });
  const [stops, setStops] = useState<Stop[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { label: 'Transport', percent: 30, color: '#B08968' },
    { label: 'Accommodation', percent: 40, color: '#B08968' },
    { label: 'Activities', percent: 15, color: '#B08968' },
    { label: 'Meals', percent: 10, color: '#B08968' },
    { label: 'Miscellaneous', percent: 5, color: '#B08968' },
  ]);

  const updateTripData = (k: string, v: any) => setTripData(p => ({ ...p, [k]: v }));
  const addStop = (s: Stop) => setStops(p => [...p, s]);
  const removeStop = (id: string) => setStops(p => p.filter(x => x.id !== id));
  const updateStop = (id: string, k: string, v: string | number) =>
    setStops(p => p.map(x => x.id === id ? { ...x, [k]: v } : x));

  const canNext = step === 0 ? tripData.name.trim().length >= 2 : true;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tripData,
          budget: totalBudget,
          stops: stops.map((s, i) => ({ ...s, order: i })),
        }),
      });
      if (!res.ok) throw new Error('Failed to create trip');
      const trip = await res.json();
      router.push(`/trips/${trip.id}`);
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const stepContent = [
    <Step1 key="s1" data={tripData} onChange={updateTripData} />,
    <Step2 key="s2" stops={stops} onAdd={addStop} onRemove={removeStop} onUpdate={updateStop} />,
    <Step3 key="s3" totalBudget={totalBudget} setTotalBudget={setTotalBudget} categories={categories} setCategories={setCategories} tripData={tripData} stops={stops} />,
  ];

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-paper-dark flex items-center justify-center text-earth hover:bg-gold/10 hover:text-gold transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-heading italic text-4xl text-earth leading-tight">Plan a new trip</h1>
            <p className="font-body text-earth-muted italic text-sm">Every great journey starts with a plan</p>
          </div>
        </div>

        <StepIndicator current={step} />

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-body">{error}</div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-10">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 h-14 rounded-pill border border-earth-muted/20 font-body text-earth hover:bg-paper-dark transition-colors">
              ← Back
            </button>
          )}
          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
              className={`flex-1 h-14 rounded-pill font-body font-medium transition-all ${canNext ? 'bg-gold text-white hover:bg-[#B58A40]' : 'bg-earth-muted/20 text-earth-muted cursor-not-allowed'}`}>
              {step === 0 ? 'Next: Add Places →' : 'Next: Set Budget →'}
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 h-14 rounded-pill bg-gold text-white font-body font-medium hover:bg-[#B58A40] transition-all disabled:opacity-60">
              {submitting ? 'Creating your adventure...' : 'Create my trip ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
