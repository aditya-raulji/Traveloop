'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function NotesTab({ trip, isOwner }: { trip: any, isOwner: boolean }) {
  const [notes, setNotes] = useState<any[]>(trip.notes || []);
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState<'All' | 'By Day'>('All');
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  
  // Add Note state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [day, setDay] = useState('');
  const [stopId, setStopId] = useState('');

  const toggleNote = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = {
      title,
      content,
      day: day ? parseInt(day) : null,
      stopId: stopId || null
    };

    try {
      const url = editingId ? `/api/trips/${trip.id}/notes/${editingId}` : `/api/trips/${trip.id}/notes`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const { note } = await res.json();
        if (editingId) {
          setNotes(notes.map(n => n.id === note.id ? note : n));
        } else {
          setNotes([note, ...notes]);
        }
        setIsAdding(false);
        setEditingId(null);
        setTitle('');
        setContent('');
        setDay('');
        setStopId('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note: any) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setDay(note.day?.toString() || '');
    setStopId(note.stopId || '');
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await fetch(`/api/trips/${trip.id}/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const groupedNotes = useMemo(() => {
    if (groupBy === 'All') return { 'All Notes': filteredNotes };
    
    const groups: Record<string, any[]> = {};
    filteredNotes.forEach(n => {
      const groupKey = n.day ? `Day ${n.day}` : 'General';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(n);
    });
    return groups;
  }, [filteredNotes, groupBy]);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-muted" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-earth/20 rounded-full text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex bg-paper-dark p-1 rounded-full border border-earth/10">
            <button 
              onClick={() => setGroupBy('All')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${groupBy === 'All' ? 'bg-white shadow-sm text-earth' : 'text-earth-muted hover:text-earth'}`}
            >
              All
            </button>
            <button 
              onClick={() => setGroupBy('By Day')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${groupBy === 'By Day' ? 'bg-white shadow-sm text-earth' : 'text-earth-muted hover:text-earth'}`}
            >
              By Day
            </button>
          </div>
          
          {isOwner && (
            <button 
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                setTitle('');
                setContent('');
              }}
              className="px-4 py-2 bg-gold text-white rounded-full text-sm font-medium hover:bg-gold-dark transition-colors shadow-sm flex items-center gap-2 ml-auto"
            >
              <Plus size={16} /> Add Note
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Inline Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-white rounded-[20px] p-6 shadow-sm border-l-[4px] border-l-gold border-y border-r border-y-earth/10 border-r-earth/10 animate-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif italic text-xl text-earth">{editingId ? 'Edit Note' : 'New Note'}</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-earth-muted hover:text-earth text-sm">Cancel</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <input type="text" placeholder="Note Title (e.g., Hotel check-in details)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold font-medium text-earth" />
            </div>
            <div className="flex gap-4">
              <input type="number" placeholder="Day (e.g., 1)" value={day} onChange={e => setDay(e.target.value)} className="w-32 p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold text-earth" />
              <select value={stopId} onChange={e => setStopId(e.target.value)} className="flex-1 p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold text-earth">
                <option value="">Select a stop (Optional)</option>
                {trip.stops?.map((s: any) => <option key={s.id} value={s.id}>{s.cityName}</option>)}
              </select>
            </div>
            <div>
              <textarea placeholder="Write your notes here..." value={content} onChange={e => setContent(e.target.value)} required className="w-full p-4 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold min-h-[120px] text-earth" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 bg-gold text-white rounded-xl font-medium hover:bg-gold-dark transition-colors shadow-sm">
                Save note
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="space-y-8">
        {Object.entries(groupedNotes).map(([group, groupNotes]) => (
          <div key={group} className="space-y-4">
            {groupBy !== 'All' && <h3 className="font-serif italic text-xl text-earth border-b border-earth/10 pb-2">{group}</h3>}
            
            {groupNotes.length === 0 ? (
              <p className="text-earth-muted text-sm italic">No notes found.</p>
            ) : (
              groupNotes.map(note => (
                <div key={note.id} className="bg-white/60 hover:bg-white transition-colors rounded-r-[12px] p-5 border-l-[3px] border-l-gold shadow-sm relative group cursor-pointer" onClick={() => toggleNote(note.id)}>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-earth text-lg mb-1">{note.title}</h4>
                      
                      <div className={`text-earth-muted leading-[1.8] text-sm overflow-hidden transition-all ${expandedNotes[note.id] ? '' : 'line-clamp-1'}`}>
                        {note.content}
                      </div>

                      <div className="mt-3 flex items-center gap-3 text-xs text-earth-muted/60 font-medium">
                        {note.day && <span>Day {note.day}</span>}
                        {note.day && <span>•</span>}
                        <span>{format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
                        {note.stopId && trip.stops?.find((s: any) => s.id === note.stopId) && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={10} /> {trip.stops.find((s: any) => s.id === note.stopId)?.cityName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity mr-2" onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleEdit(note)} className="p-1.5 text-earth-muted hover:text-earth hover:bg-earth/5 rounded-full"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(note.id)} className="p-1.5 text-earth-muted hover:text-error hover:bg-error/5 rounded-full"><Trash2 size={14} /></button>
                        </div>
                      )}
                      <div className="text-earth-muted">
                        {expandedNotes[note.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
