'use client';

import { useState } from 'react';
import { format, differenceInDays, addDays } from 'date-fns';
import { MapPin, Calendar, DollarSign, Activity, CheckCircle, Circle, Link2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PublicTripClient({ trip }: { trip: any }) {
  const [activeTab, setActiveTab] = useState('Overview');

  const duration = trip.startDate && trip.endDate 
    ? differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1 
    : 0;
  
  const activitiesCount = trip.stops.reduce((acc: number, stop: any) => acc + (stop.activities?.length || 0), 0);
  const citiesStr = trip.stops.map((s:any) => s.cityName).join(', ');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-earth-light/20 pb-20">
      {/* Top Banner */}
      <div className="bg-earth text-white text-center py-2 text-sm font-medium">
        Viewing {trip.user?.name || 'someone'}'s trip to {citiesStr || 'somewhere exciting'}
      </div>

      {/* Top Nav */}
      <nav className="bg-white border-b border-earth-muted/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif italic text-2xl text-earth">Traveloop</Link>
          
          <div className="flex gap-4">
            {['Overview', 'Itinerary'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-16 text-sm font-medium relative transition-colors ${
                  activeTab === tab ? 'text-earth' : 'text-earth-muted hover:text-earth'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <button onClick={handleCopyLink} className="flex items-center text-sm font-medium text-gold hover:text-gold-dark transition-colors">
            <Link2 className="w-4 h-4 mr-1.5" /> Share
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
        {activeTab === 'Overview' && <OverviewTab trip={trip} duration={duration} activitiesCount={activitiesCount} />}
        {activeTab === 'Itinerary' && <ItineraryTab trip={trip} />}
      </main>

      {/* Bottom CTA */}
      <div className="max-w-md mx-auto mt-20 text-center bg-white p-8 rounded-[32px] shadow-sm border border-earth-muted/10">
        <h3 className="font-serif italic text-2xl text-earth mb-2">Inspired by this journey?</h3>
        <p className="text-earth-muted text-sm mb-6">Create your own beautiful itinerary with Traveloop.</p>
        <Link href="/" className="inline-flex items-center px-8 py-3 bg-earth text-white rounded-full text-sm font-medium hover:bg-earth-dark transition-colors">
          Start Planning <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

// --- Overview Tab Component ---
function OverviewTab({ trip, duration, activitiesCount }: { trip: any, duration: number, activitiesCount: number }) {
  const coverImage = trip.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
  
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative h-[400px] rounded-[32px] overflow-hidden shadow-lg group">
        <img src={coverImage} alt={trip.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="font-serif italic text-4xl mb-4">{trip.name}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-white/90 font-medium">
            {trip.startDate && trip.endDate && (
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-80" /> {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')} • {duration} days</span>
            )}
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 opacity-80" /> {trip.stops?.length || 0} cities</span>
            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-2 opacity-80" /> ${(trip.budget || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Days', value: duration },
          { label: 'Cities', value: trip.stops?.length || 0 },
          { label: 'Budget', value: `$${(trip.budget || 0).toLocaleString()}` },
          { label: 'Planned', value: `${activitiesCount} Act.` },
        ].map((stat, i) => (
          <div key={i} className="bg-paper-dark rounded-[20px] p-6 text-center shadow-sm">
            <div className="font-serif italic text-3xl text-earth mb-2">{stat.value}</div>
            <div className="w-8 h-0.5 bg-gold mx-auto mb-3" />
            <div className="text-sm text-earth-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Journey Map */}
      {trip.stops && trip.stops.length > 0 && (
        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-earth-muted/10">
          <h3 className="font-serif text-xl italic text-earth mb-8">Journey Map</h3>
          <div className="flex items-center justify-between relative px-4">
            <div className="absolute left-8 right-8 top-3 h-0.5 bg-earth-muted/20" />
            {trip.stops.map((stop: any, index: number) => (
              <div key={stop.id} className="relative z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gold border-4 border-white shadow-sm mb-3" />
                <span className="font-medium text-earth">{stop.cityName}</span>
                {stop.startDate && (
                  <span className="text-xs text-earth-muted mt-1">{format(new Date(stop.startDate), 'MMM d')}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Itinerary Tab Component ---
function ItineraryTab({ trip }: { trip: any }) {
  if (!trip.stops || trip.stops.length === 0) {
    return <div className="text-center py-20 text-earth-muted">No itinerary planned yet.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {trip.stops.map((stop: any) => {
        const spent = stop.activities?.reduce((acc: number, a: any) => acc + (a.cost || 0), 0) || 0;
        const budget = stop.budget || 0;
        const remaining = budget - spent;
        
        const activitiesByDate: Record<string, any[]> = {};
        if (stop.activities) {
          stop.activities.forEach((act: any) => {
            const dateStr = act.date ? format(new Date(act.date), 'yyyy-MM-dd') : 'Unscheduled';
            if (!activitiesByDate[dateStr]) activitiesByDate[dateStr] = [];
            activitiesByDate[dateStr].push(act);
          });
        }

        const sortedDates = Object.keys(activitiesByDate).sort();

        return (
          <div key={stop.id} className="shadow-lg rounded-[20px] overflow-hidden">
            <div className="bg-earth text-paper p-6">
              <h2 className="font-serif italic text-2xl mb-1 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gold" /> {stop.cityName}
              </h2>
              <p className="text-paper/70 text-sm">
                {stop.startDate && stop.endDate 
                  ? `${format(new Date(stop.startDate), 'MMM d')} – ${format(new Date(stop.endDate), 'MMM d')} • ` 
                  : ''}
                ${budget.toLocaleString()} budget
              </p>
            </div>

            <div className="bg-paper-dark p-6">
              <div className="grid grid-cols-[100px_1fr_100px] gap-4 mb-4 pb-2 border-b border-earth/10 text-xs font-semibold text-earth-muted uppercase tracking-wider">
                <div>Day</div>
                <div>Activity</div>
                <div className="text-right">Cost</div>
              </div>

              {sortedDates.length === 0 ? (
                <div className="text-center py-8 text-earth-muted text-sm italic">No activities.</div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map((dateStr, dIndex) => {
                    const dayActs = activitiesByDate[dateStr];
                    const dayTotal = dayActs.reduce((acc, a) => acc + (a.cost || 0), 0);
                    
                    return (
                      <div key={dateStr} className="grid grid-cols-[100px_1fr_100px] gap-4 items-start">
                        <div className="text-sm font-medium text-earth pt-2">
                          {dateStr !== 'Unscheduled' ? (
                            <>
                              <div>Day {dIndex + 1}</div>
                              <div className="text-xs text-earth-muted font-normal mt-0.5">{format(new Date(dateStr), 'MMM d')}</div>
                            </>
                          ) : 'Unscheduled'}
                        </div>
                        
                        <div className="space-y-2">
                          {dayActs.map(act => (
                            <div key={act.id} className="bg-white rounded-xl p-3 border border-earth-muted/10 flex items-center shadow-sm">
                              <div className="mr-3">
                                {act.done ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-earth-muted/50" />}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-earth">{act.activity?.name || 'Custom Activity'}</div>
                                {act.activity?.category && (
                                  <div className="text-[10px] uppercase tracking-wider text-earth-muted mt-1">{act.activity.category}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="text-right pt-2 space-y-2">
                          {dayActs.map(act => (
                            <div key={act.id} className="h-[46px] flex items-center justify-end">
                              <span className="text-sm font-medium text-earth">${act.cost || 0}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-earth-muted/20 text-xs font-semibold text-earth-muted">
                            Total: ${dayTotal}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white p-4 text-sm flex items-center justify-between border-t border-earth-muted/10">
              <div className="text-earth-muted">
                Budget: <span className="font-medium text-earth">${budget}</span> | 
                Spent: <span className="font-medium text-earth">${spent}</span>
              </div>
              <div className="w-32 h-1.5 bg-paper rounded-full overflow-hidden">
                <div className="h-full bg-gold" style={{ width: `${Math.min((spent / (budget || 1)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
