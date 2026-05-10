'use client';

import { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronUp, X, Printer, RefreshCw } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const TEMPLATES = {
  Beach: [
    { name: 'Swimsuit', category: 'Clothing' },
    { name: 'Sunscreen', category: 'Medicine' },
    { name: 'Beach Towel', category: 'Essentials' },
    { name: 'Sunglasses', category: 'Essentials' },
  ],
  Winter: [
    { name: 'Heavy Coat', category: 'Clothing' },
    { name: 'Gloves', category: 'Clothing' },
    { name: 'Thermals', category: 'Clothing' },
    { name: 'Lip Balm', category: 'Medicine' },
  ],
  Business: [
    { name: 'Suit / Formal wear', category: 'Clothing' },
    { name: 'Laptop & Charger', category: 'Electronics' },
    { name: 'Business Cards', category: 'Documents' },
  ]
};

const CATEGORIES = [
  { name: '✈ Essentials', key: 'Essentials' },
  { name: '📋 Documents', key: 'Documents' },
  { name: '👕 Clothing', key: 'Clothing' },
  { name: '💊 Medicine', key: 'Medicine' },
  { name: '🔌 Electronics', key: 'Electronics' },
  { name: '📦 Misc', key: 'Misc' }
];

export default function ChecklistTab({ trip, isOwner }: { trip: any, isOwner: boolean }) {
  const [items, setItems] = useState<any[]>(trip.checklist?.[0]?.items || []);
  const [search, setSearch] = useState('');
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({});
  
  // Add state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Essentials');

  const packedCount = items.filter(i => i.isPacked).length;
  const totalCount = items.length;
  const progressPercent = totalCount === 0 ? 0 : (packedCount / totalCount) * 100;

  const toggleCategory = (cat: string) => {
    setCollapsedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleToggleItem = async (item: any) => {
    if (!isOwner) return;
    const nextState = !item.isPacked;
    setItems(items.map(i => i.id === item.id ? { ...i, isPacked: nextState } : i));
    try {
      await fetch(`/api/trips/${trip.id}/checklist/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPacked: nextState })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!isOwner) return;
    setItems(items.filter(i => i.id !== id));
    try {
      await fetch(`/api/trips/${trip.id}/checklist/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !isOwner) return;

    try {
      const res = await fetch(`/api/trips/${trip.id}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName, category: newItemCategory })
      });
      if (res.ok) {
        const { item } = await res.json();
        setItems([...items, item]);
        setNewItemName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUseTemplate = async (templateKey: keyof typeof TEMPLATES) => {
    if (!isOwner) return;
    const templateItems = TEMPLATES[templateKey];
    
    try {
      const res = await fetch(`/api/trips/${trip.id}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: templateItems })
      });
      if (res.ok) {
        const { checklist } = await res.json();
        setItems(checklist.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!isOwner) return;
    if (confirm('Are you sure you want to delete all items?')) {
      try {
        await fetch(`/api/trips/${trip.id}/checklist`, { method: 'DELETE' });
        setItems([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 print:max-w-none print:m-0 print:bg-white print:p-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-muted" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-earth/20 rounded-full text-sm text-earth focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isOwner && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="px-4 py-2 border border-earth/20 rounded-full text-sm text-earth hover:bg-white transition-colors bg-paper-dark">
                  Use template ▾
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white border border-earth/10 rounded-xl shadow-xl p-1 z-50 min-w-[150px]">
                  {Object.keys(TEMPLATES).map(k => (
                    <DropdownMenu.Item key={k} onSelect={() => handleUseTemplate(k as any)} className="px-3 py-2 text-sm text-earth cursor-pointer hover:bg-paper rounded-lg outline-none">
                      {k} Trip
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}

          <button onClick={() => window.print()} className="px-4 py-2 border border-earth/20 rounded-full text-sm text-earth hover:bg-white transition-colors bg-paper-dark flex items-center gap-2">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-earth/10">
        <div className="flex justify-between items-end mb-3">
          <p className="text-sm font-medium text-earth-muted">Overall Progress</p>
          <p className="font-serif italic text-2xl text-gold">{packedCount} of {totalCount} items packed</p>
        </div>
        <div className="h-3 bg-paper-dark rounded-full overflow-hidden border border-earth/5">
          <div className="h-full bg-gold transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Add Item Row */}
      {isOwner && (
        <form onSubmit={handleAddItem} className="flex gap-2 print:hidden">
          <input 
            type="text" 
            placeholder="Add new item..." 
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-earth/20 rounded-xl text-sm focus:outline-none focus:border-gold"
          />
          <select 
            value={newItemCategory} 
            onChange={e => setNewItemCategory(e.target.value)}
            className="w-32 px-3 py-3 bg-white border border-earth/20 rounded-xl text-sm focus:outline-none focus:border-gold"
          >
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
          </select>
          <button type="submit" className="w-12 h-12 bg-gold hover:bg-gold-dark text-white rounded-xl flex items-center justify-center transition-colors shadow-sm">
            <Plus size={20} />
          </button>
        </form>
      )}

      {/* Category Groups */}
      <div className="space-y-6">
        {CATEGORIES.map(category => {
          const catItems = filteredItems.filter(i => i.category === category.key);
          if (catItems.length === 0) return null;

          const catPacked = catItems.filter(i => i.isPacked).length;
          const isCollapsed = collapsedCats[category.key];

          return (
            <div key={category.key} className="bg-white rounded-[20px] shadow-sm border border-earth/10 overflow-hidden break-inside-avoid">
              {/* Category Header */}
              <button 
                onClick={() => toggleCategory(category.key)}
                className="w-full p-4 flex items-center justify-between hover:bg-paper/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-earth text-lg">{category.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-paper-dark text-earth-muted rounded-full">
                    {catPacked}/{catItems.length}
                  </span>
                </div>
                <div className="text-earth-muted">
                  {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </div>
              </button>

              {/* Progress Line */}
              <div className="h-0.5 w-full bg-paper">
                <div className="h-full bg-gold transition-all duration-300" style={{ width: `${(catPacked/catItems.length)*100}%` }} />
              </div>

              {/* Items List */}
              {!isCollapsed && (
                <div className="p-2">
                  {catItems.map(item => (
                    <div key={item.id} className="group flex items-center justify-between px-4 py-3 hover:bg-paper/50 rounded-xl transition-colors">
                      <div 
                        className="flex items-center gap-4 cursor-pointer flex-1"
                        onClick={() => handleToggleItem(item)}
                      >
                        <div className={`w-5 h-5 rounded-full flex flex-shrink-0 items-center justify-center border-[1.5px] transition-colors ${
                          item.isPacked ? 'bg-gold border-gold' : 'border-gold/50'
                        }`}>
                          {item.isPacked && (
                            <svg viewBox="0 0 14 10" fill="none" className="w-3 h-3 text-white">
                              <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm transition-all ${item.isPacked ? 'line-through text-earth-muted' : 'text-earth font-medium'}`}>
                          {item.name}
                        </span>
                      </div>
                      
                      {isOwner && (
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-earth-muted hover:text-error hover:bg-error/10 rounded-full transition-all print:hidden"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length > 0 && isOwner && (
        <div className="text-center pt-8 print:hidden">
          <button onClick={handleReset} className="text-sm text-error/80 hover:text-error hover:underline flex items-center justify-center gap-1 mx-auto">
            <RefreshCw size={14} /> Reset checklist
          </button>
        </div>
      )}
    </div>
  );
}
