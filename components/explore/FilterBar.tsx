'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, Map } from 'lucide-react';

export type SortOption = {
  label: string;
  value: string;
};

interface FilterBarProps {
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (val: string) => void;
  showMapToggle?: boolean;
  onMapToggle?: () => void;
  children?: React.ReactNode; // for filter panel slot
}

function DropdownButton({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-4 py-2 border border-[rgba(212,175,55,0.3)] rounded-full text-sm text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)] transition-all duration-200"
      >
        {icon}
        {label}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 min-w-[180px] bg-[#1a1814] border border-[rgba(212,175,55,0.2)] rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  sortOptions,
  selectedSort,
  onSortChange,
  showMapToggle,
  onMapToggle,
  children,
}: FilterBarProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort */}
        <DropdownButton
          label={sortOptions.find((s) => s.value === selectedSort)?.label ?? 'Sort by'}
          icon={<SlidersHorizontal size={13} />}
        >
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`w-full px-4 py-2.5 text-sm text-left hover:bg-[rgba(212,175,55,0.08)] transition-colors ${
                selectedSort === opt.value ? 'text-[var(--gold)] font-semibold' : 'text-[var(--text-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </DropdownButton>

        {/* Filter toggle */}
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-sm transition-all duration-200 ${
            filterOpen
              ? 'bg-[rgba(212,175,55,0.15)] border-[var(--gold)] text-[var(--gold)]'
              : 'border-[rgba(212,175,55,0.3)] text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)]'
          }`}
        >
          Filter
          <ChevronDown size={13} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Map view toggle */}
        {showMapToggle && (
          <button
            onClick={onMapToggle}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 border border-[rgba(212,175,55,0.3)] rounded-full text-sm text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)] transition-all duration-200"
          >
            <Map size={13} />
            Map view
          </button>
        )}
      </div>

      {/* Collapsible filter panel */}
      {filterOpen && children && (
        <div className="bg-[rgba(26,24,20,0.8)] border border-[rgba(212,175,55,0.15)] rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
