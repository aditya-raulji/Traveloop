'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, differenceInDays, addDays } from 'date-fns';
import { ArrowLeft, MoreHorizontal, MapPin, Calendar, DollarSign, Activity, CheckCircle, Circle, Edit, Share2, Globe, Lock, Trash, Download } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import BudgetTab from '@/components/trips/BudgetTab';
import ChecklistTab from '@/components/trips/ChecklistTab';
import NotesTab from '@/components/trips/NotesTab';

// Utility for fetching updating trip status (public/private)
async function updateTrip(id: string, updates: any) {
  return fetch(`/api/trips/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export default function TripClient({ trip, isOwner }: { trip: any, isOwner: boolean }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPublic, setIsPublic] = useState(trip.isPublic);

  const duration = trip.startDate && trip.endDate 
    ? differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1 
    : 0;
  
  const activitiesCount = trip.stops.reduce((acc: number, stop: any) => acc + (stop.activities?.length || 0), 0);

  const togglePublic = async () => {
    const nextState = !isPublic;
    setIsPublic(nextState);
    await updateTrip(trip.id, { isPublic: nextState });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/trips/${trip.id}/share`);
    alert('Link copied to clipboard!');
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this trip?')) {
      await fetch(`/api/trips/${trip.id}`, { method: 'DELETE' });
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-earth-light/20 pb-20">
      {/* Top Nav */}
      <nav className="bg-white border-b border-earth-muted/10 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-earth-muted hover:text-earth transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trips
          </Link>
          <h1 className="font-serif italic text-2xl text-earth">{trip.name}</h1>
          
          <div>
            {isOwner && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2 hover:bg-earth-light rounded-full text-earth-muted transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="w-48 bg-white rounded-xl shadow-xl border border-earth-muted/10 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-earth cursor-pointer hover:bg-earth-light rounded-lg outline-none" asChild>
                      <Link href={`/trips/${trip.id}/edit`}><Edit className="w-4 h-4 mr-2" /> Edit Details</Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-earth cursor-pointer hover:bg-earth-light rounded-lg outline-none" asChild>
                      <Link href={`/trips/${trip.id}/build`}><MapPin className="w-4 h-4 mr-2" /> Build Itinerary</Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-earth-muted/10 my-1" />
                    <DropdownMenu.Item onSelect={handleShare} className="flex items-center px-3 py-2 text-sm text-earth cursor-pointer hover:bg-earth-light rounded-lg outline-none">
                      <Share2 className="w-4 h-4 mr-2" /> Share Trip
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-earth cursor-pointer hover:bg-earth-light rounded-lg outline-none" asChild>
                      <a href={`/api/trips/${trip.id}/export`} target="_blank"><Download className="w-4 h-4 mr-2" /> Export as PDF</a>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={togglePublic} className="flex items-center px-3 py-2 text-sm text-earth cursor-pointer hover:bg-earth-light rounded-lg outline-none">
                      {isPublic ? <Lock className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                      {isPublic ? 'Make Private' : 'Make Public'}
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-earth-muted/10 my-1" />
                    <DropdownMenu.Item onSelect={handleDelete} className="flex items-center px-3 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 rounded-lg outline-none">
                      <Trash className="w-4 h-4 mr-2" /> Delete Trip
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex gap-8 border-b border-earth-muted/10 overflow-x-auto scrollbar-hide">
          {['Overview', 'Itinerary', 'Budget', 'Checklist', 'Notes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-medium whitespace-nowrap relative transition-colors",
                activeTab === tab ? 'text-earth' : 'text-[#6B6257] hover:text-earth'
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B08968] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
        {activeTab === 'Overview' && <OverviewTab trip={trip} duration={duration} activitiesCount={activitiesCount} />}
        {activeTab === 'Itinerary' && <ItineraryTab trip={trip} isOwner={isOwner} />}
        {activeTab === 'Budget' && <BudgetTab trip={trip} isOwner={isOwner} />}
        {activeTab === 'Checklist' && <ChecklistTab trip={trip} isOwner={isOwner} />}
        {activeTab === 'Notes' && <NotesTab trip={trip} isOwner={isOwner} />}
      </main>
    </div>
  );
}

// --- Overview Tab Component ---
function OverviewTab({ trip, duration, activitiesCount }: { trip: any, duration: number, activitiesCount: number }) {
  const coverImage = trip.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
  
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative w-full max-w-[1050px] mx-auto h-[400px] rounded-[24px] overflow-hidden shadow-premium group">
        <img src={coverImage} alt={trip.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B241D]/90 via-[#2B241D]/20 to-transparent" />
        
        <div className="absolute bottom-8 left-8 text-white z-10">
          <h2 className="font-heading italic text-[44px] md:text-[56px] leading-tight mb-4">{trip.name}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-white/90 font-body">
            {trip.startDate && trip.endDate && (
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-80" /> {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
            )}
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 opacity-80" /> {trip.stops?.length || 0} cities</span>
            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-2 opacity-80" /> ${(trip.budget || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-[24px] overflow-hidden border border-[#B08968]/20 shadow-premium">
        {[
          { label: 'Days', value: duration },
          { label: 'Cities', value: trip.stops?.length || 0 },
          { label: 'Budget', value: `$${(trip.budget || 0).toLocaleString()}` },
          { label: 'Activities', value: activitiesCount },
        ].map((stat, i) => (
          <div 
            key={i} 
            className={cn(
              "py-8 px-4 text-center flex flex-col items-center justify-center",
              i > 0 && "sm:border-l border-[#B08968]/20",
              i === 1 && "border-l border-transparent sm:border-l-[#B08968]/20", // Fix for 2x2 grid border
              i >= 2 && "border-t sm:border-t-0 border-[#B08968]/20"
            )}
          >
            <div className="font-heading italic text-4xl text-earth">{stat.value}</div>
            <div className="font-body text-[11px] text-[#6B6257] uppercase tracking-widest mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Journey Map */}
      {trip.stops && trip.stops.length > 0 && (
        <div className="bg-white rounded-[24px] p-10 shadow-premium border border-earth-muted/10">
          <h3 className="font-heading text-2xl italic text-earth mb-12">Journey Map</h3>
          <div className="relative flex items-center justify-between px-8 py-6">
            <div className="absolute left-8 right-8 top-1/2 h-px bg-[#B08968]/30 -translate-y-1/2" />
            {trip.stops.map((stop: any, index: number) => {
              const totalStops = trip.stops.length;
              const position = totalStops > 1 ? (index / (totalStops - 1)) * 100 : 50;
              
              return (
                <div key={stop.id} className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#B08968] border-[3px] border-white shadow-md mb-4" />
                  <div className="absolute top-10 whitespace-nowrap flex flex-col items-center">
                    <span className="font-body font-medium text-earth text-sm">{stop.cityName}</span>
                    {stop.startDate && (
                      <span className="text-[10px] uppercase tracking-wider text-earth-muted mt-1">{format(new Date(stop.startDate), 'MMM d')}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-16" /> {/* Spacer for labels */}
        </div>
      )}
    </div>
  );
}

// --- Itinerary Tab Component ---
function ItineraryTab({ trip, isOwner }: { trip: any, isOwner: boolean }) {
  const updateActivityCost = async (stopId: string, activityId: string, newCost: string) => {
    try {
      await fetch(`/api/trips/${trip.id}/stops/${stopId}/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost: parseFloat(newCost) || 0 }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleDone = async (stopId: string, activityId: string, currentDone: boolean) => {
    try {
      await fetch(`/api/trips/${trip.id}/stops/${stopId}/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentDone }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!trip.stops || trip.stops.length === 0) {
    return <div className="text-center py-20 text-earth-muted">No itinerary planned yet.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {trip.stops.map((stop: any) => {
        const spent = stop.activities?.reduce((acc: number, a: any) => acc + (a.cost || 0), 0) || 0;
        const budget = stop.budget || 0;
        const remaining = budget - spent;
        
        // Group activities by date
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
            {/* Header */}
            <div className="bg-earth text-paper p-6">
              <div className="flex items-center justify-between">
                <div>
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
              </div>
            </div>

            {/* Body */}
            <div className="bg-paper-dark p-6">
              <div className="grid grid-cols-[100px_1fr_100px] gap-4 mb-4 pb-2 border-b border-earth/10 text-xs font-semibold text-earth-muted uppercase tracking-wider">
                <div>Day</div>
                <div>Activity</div>
                <div className="text-right">Cost</div>
              </div>

              {sortedDates.length === 0 ? (
                <div className="text-center py-8 text-earth-muted text-sm italic">No activities added for this stop.</div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map((dateStr, dIndex) => {
                    const dayActs = activitiesByDate[dateStr];
                    const dayTotal = dayActs.reduce((acc, a) => acc + (a.cost || 0), 0);
                    
                    return (
                      <div key={dateStr} className="grid grid-cols-[100px_1fr_100px] gap-4 items-start relative group">
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
                              {isOwner ? (
                                <button onClick={() => toggleDone(stop.id, act.id, act.done)} className="mr-3 text-earth-muted hover:text-green-600 transition-colors">
                                  {act.done ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5" />}
                                </button>
                              ) : (
                                <div className="mr-3">
                                  {act.done ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-earth-muted/50" />}
                                </div>
                              )}
                              
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
                              {isOwner ? (
                                <input 
                                  type="number"
                                  defaultValue={act.cost || ''}
                                  placeholder="0"
                                  onBlur={(e) => updateActivityCost(stop.id, act.id, e.target.value)}
                                  className="w-16 text-right text-sm font-medium text-earth bg-transparent border-b border-transparent focus:border-gold outline-none transition-colors"
                                />
                              ) : (
                                <span className="text-sm font-medium text-earth">${act.cost || 0}</span>
                              )}
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

            {/* Footer */}
            <div className="bg-white p-4 text-sm flex items-center justify-between border-t border-earth-muted/10">
              <div className="text-earth-muted">
                Budget: <span className="font-medium text-earth">${budget}</span> | 
                Spent: <span className="font-medium text-earth">${spent}</span> | 
                Remaining: <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>${remaining}</span>
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
