'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, DollarSign, Plus } from 'lucide-react';

const CATEGORIES = ['All', 'Sightseeing', 'Food', 'Adventure', 'Culture', 'Shopping', 'Transport', 'Stay'];

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dayHeader?: string;
  onAddActivity: (activity: any) => void;
  city?: string;
}

export default function ActivityDrawer({ isOpen, onClose, dayHeader, onAddActivity, city }: ActivityDrawerProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  // Custom Form State
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Sightseeing');
  const [customCost, setCustomCost] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [customTime, setCustomTime] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (city) query.append('city', city);
        if (category && category !== 'All') query.append('category', category);
        if (search) query.append('q', search);

        const res = await fetch(`/api/activities?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchActivities();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, category, city, isOpen]);

  const handleAddCustom = async () => {
    if (!customName) return;
    
    // First create global activity
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customName,
          category: customCategory,
          city: city || 'Unknown',
          description: customNotes,
          avgCost: customCost,
        })
      });
      
      if (res.ok) {
        const newActivity = await res.json();
        onAddActivity({
          activity: newActivity,
          cost: parseFloat(customCost) || 0,
          notes: customNotes,
          time: customTime
        });
        setShowCustom(false);
        setCustomName('');
        setCustomCost('');
        setCustomNotes('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-earth/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-earth-muted/10 flex items-center justify-between">
              <h2 className="font-serif italic text-xl text-earth">
                Add Activity {dayHeader ? `to ${dayHeader}` : ''}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-earth-light rounded-full text-earth-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-earth-light/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-muted" />
                <input
                  type="text"
                  placeholder={`Search activities in ${city || 'anywhere'}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-earth-muted/20 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm bg-white"
                />
              </div>

              <div className="mt-3">
                <label className="text-xs text-earth-muted block mb-1">Time (Optional)</label>
                <input 
                  type="time" 
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-earth-muted/20 focus:outline-none focus:border-gold text-sm bg-white"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      category === c ? 'bg-gold text-white' : 'bg-white text-earth-muted hover:bg-white/80 border border-earth-muted/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-earth-light/10">
              {showCustom ? (
                <div className="bg-white p-4 rounded-xl border border-earth-muted/20 space-y-4">
                  <h3 className="font-medium text-earth text-sm">Create Custom Activity</h3>
                  
                  <div>
                    <label className="text-xs text-earth-muted block mb-1">Name</label>
                    <input value={customName} onChange={e => setCustomName(e.target.value)} type="text" className="w-full text-sm p-2 border border-earth-muted/20 rounded-lg" placeholder="Dinner at local spot" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-earth-muted block mb-1">Category</label>
                      <select value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="w-full text-sm p-2 border border-earth-muted/20 rounded-lg">
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-earth-muted block mb-1">Cost ($)</label>
                      <input value={customCost} onChange={e => setCustomCost(e.target.value)} type="number" className="w-full text-sm p-2 border border-earth-muted/20 rounded-lg" placeholder="0.00" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-earth-muted block mb-1">Time (Optional)</label>
                    <input value={customTime} onChange={e => setCustomTime(e.target.value)} type="time" className="w-full text-sm p-2 border border-earth-muted/20 rounded-lg" />
                  </div>

                  <div>
                    <label className="text-xs text-earth-muted block mb-1">Notes</label>
                    <textarea value={customNotes} onChange={e => setCustomNotes(e.target.value)} className="w-full text-sm p-2 border border-earth-muted/20 rounded-lg h-20" placeholder="Confirmation numbers, etc." />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setShowCustom(false)} className="flex-1 py-2 text-sm text-earth-muted border border-earth-muted/20 rounded-lg">Cancel</button>
                    <button onClick={handleAddCustom} className="flex-1 py-2 text-sm bg-earth text-white rounded-lg hover:bg-earth-dark transition-colors">Save Activity</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8 text-sm text-earth-muted">Searching...</div>
                  ) : results.length === 0 ? (
                    <div className="text-center py-8 text-sm text-earth-muted">No activities found.</div>
                  ) : (
                    results.map((activity) => (
                      <div key={activity.id} className="bg-white rounded-xl border border-earth-muted/20 overflow-hidden hover:border-gold/50 transition-colors flex group">
                        {activity.imageUrl && (
                          <div className="w-20 h-20 shrink-0">
                            <img src={activity.imageUrl} alt={activity.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-earth text-sm line-clamp-1">{activity.name}</h4>
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-earth-light text-earth rounded-full">
                                {activity.category}
                              </span>
                            </div>
                            <div className="flex gap-3 mt-1.5 text-xs text-earth-muted">
                              {activity.avgCost > 0 && (
                                <span className="flex items-center"><DollarSign className="w-3 h-3 mr-0.5" />{activity.avgCost}</span>
                              )}
                              {activity.duration && (
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-0.5" />{activity.duration}m</span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => onAddActivity({ activity, cost: activity.avgCost, time: selectedTime })}
                              className="text-xs bg-gold text-white px-3 py-1 rounded-lg flex items-center hover:bg-gold-dark"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <button 
                    onClick={() => setShowCustom(true)}
                    className="w-full mt-4 py-3 border border-dashed border-earth-muted/30 text-earth-muted text-sm rounded-xl hover:bg-white hover:text-earth hover:border-earth/30 transition-colors"
                  >
                    Can't find it? Add custom &rarr;
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
