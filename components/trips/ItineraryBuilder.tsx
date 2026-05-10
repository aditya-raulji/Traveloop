'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  arrayMove, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addDays, format, differenceInDays } from 'date-fns';
import { GripVertical, X, DollarSign, Clock, MapPin, Search, Filter, Plus } from 'lucide-react';
import ActivityDrawer from './ActivityDrawer';

// --- Sortable Activity Item Component ---
function SortableActivityItem({ item, onRemove }: { item: any, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 mb-2 flex items-center gap-3 border border-earth-muted/10 shadow-sm relative group">
      <div {...attributes} {...listeners} className="cursor-grab text-earth-muted/50 hover:text-earth cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-earth text-sm truncate">{item.activity?.name || 'Unknown Activity'}</h4>
        <div className="flex gap-3 mt-1 text-xs text-earth-muted">
          {item.time && <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{item.time}</span>}
          {item.cost > 0 && <span className="flex items-center"><DollarSign className="w-3 h-3 mr-0.5" />{item.cost}</span>}
          {item.activity?.category && <span className="px-1.5 py-0.5 bg-earth-light rounded text-[10px] uppercase tracking-wider">{item.activity.category}</span>}
        </div>
      </div>

      <button onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-earth-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function DroppableDay({ id, children }: { id: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className="space-y-2 min-h-[40px] pb-4">{children}</div>;
}

// --- Main Builder Component ---
export default function ItineraryBuilder({ trip }: { trip: any }) {
  const [stops, setStops] = useState<any[]>(trip.stops || []);
  const [activeTab, setActiveTab] = useState('Plan');
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerData, setActiveDrawerData] = useState<{stopId: string, date: string, city: string} | null>(null);
  
  const [activeDragItem, setActiveDragItem] = useState<any | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Generate days array for a stop
  const getDaysForStop = (stop: any) => {
    if (!stop.startDate || !stop.endDate) return [];
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const daysCount = differenceInDays(end, start) + 1;
    
    return Array.from({ length: Math.max(1, daysCount) }, (_, i) => {
      const date = addDays(start, i);
      return {
        id: `day-${stop.id}-${format(date, 'yyyy-MM-dd')}`,
        date,
        dateString: format(date, 'yyyy-MM-dd'),
        label: `Day ${i + 1} — ${format(date, 'MMM d')}`,
      };
    });
  };

  // Inline Handlers
  const handleStopUpdate = async (stopId: string, updates: any) => {
    setStops(prev => prev.map(s => s.id === stopId ? { ...s, ...updates } : s));
    try {
      await fetch(`/api/trips/${trip.id}/stops/${stopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Activity Handlers
  const handleAddActivity = async (payload: any) => {
    if (!activeDrawerData) return;
    
    // Add to state optimistically
    const newStopActivity = {
      id: `temp-${Date.now()}`,
      stopId: activeDrawerData.stopId,
      activityId: payload.activity.id,
      activity: payload.activity,
      date: new Date(activeDrawerData.date),
      cost: payload.cost,
      notes: payload.notes,
      time: payload.time,
    };

    setStops(prev => prev.map(s => {
      if (s.id === activeDrawerData.stopId) {
        return { ...s, activities: [...(s.activities || []), newStopActivity] };
      }
      return s;
    }));

    // Call API
    try {
      const res = await fetch(`/api/trips/${trip.id}/stops/${activeDrawerData.stopId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: payload.activity.id,
          date: activeDrawerData.date,
          cost: payload.cost,
          notes: payload.notes,
          time: payload.time,
        })
      });
      if (res.ok) {
        const saved = await res.json();
        // Replace temp id with real id
        setStops(prev => prev.map(s => {
          if (s.id === activeDrawerData.stopId) {
            return {
              ...s,
              activities: s.activities.map((act: any) => act.id === newStopActivity.id ? saved : act)
            };
          }
          return s;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveActivity = async (stopId: string, activityId: string) => {
    setStops(prev => prev.map(s => {
      if (s.id === stopId) {
        return { ...s, activities: s.activities.filter((a: any) => a.id !== activityId) };
      }
      return s;
    }));

    try {
      await fetch(`/api/trips/${trip.id}/stops/${stopId}/activities/${activityId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error(e);
    }
  };

  // DND Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Find item
    for (const stop of stops) {
      const item = stop.activities?.find((a: any) => a.id === active.id);
      if (item) {
        setActiveDragItem(item);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string; // Could be a dropzone (day) or another activity

    let sourceStopId = '', sourceDateStr = '', destStopId = '', destDateStr = '';
    
    // Find Source
    const sourceStop = stops.find(s => s.activities?.some((a: any) => a.id === activeId));
    if (!sourceStop) return;
    const sourceAct = sourceStop.activities.find((a: any) => a.id === activeId);
    sourceStopId = sourceStop.id;
    sourceDateStr = format(new Date(sourceAct.date), 'yyyy-MM-dd');

    // Find Dest
    if (overId.startsWith('day-')) {
      // Dropped on empty day container
      const parts = overId.split('-');
      destStopId = parts.slice(1, -3).join('-'); // stopId might have hyphens
      // Format: day-[stopId]-yyyy-MM-dd
      const datePart = parts.slice(-3).join('-');
      destDateStr = datePart;
    } else {
      // Dropped on another item
      const destStop = stops.find(s => s.activities?.some((a: any) => a.id === overId));
      if (!destStop) return;
      const destAct = destStop.activities.find((a: any) => a.id === overId);
      destStopId = destStop.id;
      destDateStr = format(new Date(destAct.date), 'yyyy-MM-dd');
    }

    if (!destStopId || !destDateStr) return;

    // Local State Update
    setStops(prev => {
      const next = prev.map(stop => ({ ...stop, activities: [...(stop.activities || [])] }));
      
      const sIndex = next.findIndex(s => s.id === sourceStopId);
      const dIndex = next.findIndex(s => s.id === destStopId);
      
      if (sIndex === -1 || dIndex === -1) return prev;

      const sActivities = next[sIndex].activities;
      const sItemIndex = sActivities.findIndex((a: any) => a.id === activeId);
      if (sItemIndex === -1) return prev;

      const movedItem = { ...sActivities[sItemIndex], date: new Date(destDateStr) };
      sActivities.splice(sItemIndex, 1);
      
      const dActivities = next[dIndex].activities;
      
      if (overId.startsWith('day-')) {
        dActivities.push(movedItem);
      } else {
        const dItemIndex = dActivities.findIndex((a: any) => a.id === overId);
        if (dItemIndex !== -1) {
          dActivities.splice(dItemIndex, 0, movedItem);
        } else {
          dActivities.push(movedItem);
        }
      }

      return next;
    });

    // API Update
    if (sourceDateStr !== destDateStr) {
      try {
        await fetch(`/api/trips/${trip.id}/stops/${destStopId}/activities/${activeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: destDateStr }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="h-16 border-b border-earth-muted/20 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex gap-4 sm:gap-6">
          {['Plan', 'View', 'Budget'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-sm font-medium relative h-16 transition-colors",
                activeTab === tab ? 'text-earth' : 'text-earth-muted hover:text-earth'
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-t-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-muted" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 border border-earth-muted/20 rounded-full text-sm bg-earth-light/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold w-32 md:w-64 transition-all"
            />
          </div>
          <button className="p-2 border border-earth-muted/20 rounded-full text-earth-muted hover:text-earth hover:bg-earth-light transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Builder Canvas */}
      <div className="flex-1 overflow-y-auto p-6 bg-earth-light/30">
        <div className="max-w-3xl mx-auto space-y-8 pb-32">
          
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            
            {stops.map((stop) => {
              const days = getDaysForStop(stop);
              const stopActivities = stop.activities || [];

              return (
                <div key={stop.id} id={`stop-${stop.id}`} className="shadow-sm rounded-2xl overflow-hidden">
                  
                  {/* Section Header */}
                  <div className="bg-earth text-paper p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-serif italic text-2xl mb-1">{stop.cityName}</h2>
                      <div className="flex items-center text-sm text-paper/80 gap-3">
                        <input 
                          type="date" 
                          value={stop.startDate ? format(new Date(stop.startDate), 'yyyy-MM-dd') : ''}
                          onChange={e => handleStopUpdate(stop.id, { startDate: e.target.value })}
                          className="bg-transparent border-b border-paper/30 hover:border-paper/80 focus:border-gold outline-none"
                        />
                        <span>to</span>
                        <input 
                          type="date" 
                          value={stop.endDate ? format(new Date(stop.endDate), 'yyyy-MM-dd') : ''}
                          onChange={e => handleStopUpdate(stop.id, { endDate: e.target.value })}
                          className="bg-transparent border-b border-paper/30 hover:border-paper/80 focus:border-gold outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
                      <span className="text-paper/80 text-sm mr-2">Budget:</span>
                      <span className="text-gold mr-1">$</span>
                      <input 
                        type="number" 
                        value={stop.budget || ''}
                        onChange={e => handleStopUpdate(stop.id, { budget: e.target.value })}
                        placeholder="0.00"
                        className="bg-transparent text-paper w-20 outline-none font-medium placeholder-paper/30"
                      />
                    </div>
                  </div>

                  {/* Section Body (Days) */}
                  <div className="bg-[#fcfbf9] p-5">
                    {days.length === 0 ? (
                      <div className="text-center py-6 text-earth-muted text-sm">Please set start and end dates to plan days.</div>
                    ) : (
                      <div className="space-y-6">
                        {days.map((day) => {
                          const dayActivities = stopActivities.filter((a: any) => {
                            if (!a.date) return false;
                            return format(new Date(a.date), 'yyyy-MM-dd') === day.dateString;
                          });

                          return (
                            <div key={day.id} id={day.id} className="min-h-[100px]">
                              <h3 className="text-earth-muted italic text-sm mb-3 pb-1 border-b border-gold/20 flex justify-between items-center">
                                <span>{day.label}</span>
                              </h3>
                              
                              <SortableContext items={dayActivities.map((a:any) => a.id)} strategy={verticalListSortingStrategy}>
                                <DroppableDay id={day.id}>
                                  {dayActivities.map((act: any) => (
                                    <SortableActivityItem 
                                      key={act.id} 
                                      item={act} 
                                      onRemove={(id) => handleRemoveActivity(stop.id, id)}
                                    />
                                  ))}
                                </DroppableDay>
                              </SortableContext>

                              <button 
                                onClick={() => {
                                  setActiveDrawerData({ stopId: stop.id, date: day.dateString, city: stop.cityName });
                                  setDrawerOpen(true);
                                }}
                                className="mt-2 w-full py-2.5 border border-dashed border-gold/30 rounded-xl text-gold text-sm font-medium flex items-center justify-center hover:bg-gold/5 transition-colors"
                              >
                                <Plus className="w-4 h-4 mr-1.5" /> Add Activity
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <DragOverlay>
              {activeDragItem ? (
                <div className="bg-white rounded-xl p-3 shadow-xl border border-gold/50 flex items-center gap-3 opacity-90 scale-105">
                  <GripVertical className="w-4 h-4 text-earth-muted" />
                  <span className="font-medium text-sm text-earth">{activeDragItem.activity?.name}</span>
                </div>
              ) : null}
            </DragOverlay>

          </DndContext>

          <button className="w-full py-4 border-2 border-dashed border-gold/40 rounded-2xl text-gold font-medium hover:bg-gold/5 transition-colors flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Another Section
          </button>
        </div>
      </div>

      <ActivityDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        dayHeader={activeDrawerData ? format(new Date(activeDrawerData.date), 'MMM d') : ''}
        city={activeDrawerData?.city}
        onAddActivity={handleAddActivity}
      />
    </>
  );
}
