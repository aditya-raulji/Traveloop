'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { CityCard } from '@/components/explore/CityCard';
import { FilterBar } from '@/components/explore/FilterBar';
import { CityData } from '@/lib/data/cities';

const CONTINENTS = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
const BUDGETS = ['Any', 'Budget', 'Mid-range', 'Luxury'];
const BEST_FOR_OPTIONS = ['Adventure', 'Culture', 'Food', 'Beach', 'City', 'Nature', 'History', 'Romance'];

const SORT_OPTIONS = [
  { label: 'Name (A–Z)', value: 'name-asc' },
  { label: 'Name (Z–A)', value: 'name-desc' },
  { label: 'Budget (Low)', value: 'budget-asc' },
  { label: 'Budget (High)', value: 'budget-desc' },
];

export default function CitiesPage() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [continent, setContinent] = useState('All');
  const [budget, setBudget] = useState('Any');
  const [bestFor, setBestFor] = useState('');
  const [sort, setSort] = useState('name-asc');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (continent !== 'All') params.set('continent', continent);
    if (budget !== 'Any') params.set('budget', budget);
    if (bestFor) params.set('bestFor', bestFor);
    if (sort) params.set('sort', sort);

    try {
      const res = await fetch(`/api/cities?${params.toString()}`);
      const data = await res.json();
      setCities(data.cities ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [q, continent, budget, bestFor, sort]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchCities, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [fetchCities]);

  function clearFilters() {
    setQ('');
    setContinent('All');
    setBudget('Any');
    setBestFor('');
    setSort('name-asc');
  }

  const hasActiveFilters = continent !== 'All' || budget !== 'Any' || bestFor !== '';

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-['Cormorant_Garamond'] italic text-5xl text-[var(--text-primary)] mb-2">
            Discover Destinations
          </h1>
          <p className="text-[var(--text-muted)] text-base">
            Explore our curated collection of the world's most captivating cities.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-[#1a1814] border border-[rgba(212,175,55,0.2)] rounded-full pl-11 pr-11 py-3.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors text-base"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            sortOptions={SORT_OPTIONS}
            selectedSort={sort}
            onSortChange={setSort}
            showMapToggle={false}
          >
            <div className="space-y-4">
              {/* Continent */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Continent</p>
                <div className="flex flex-wrap gap-2">
                  {CONTINENTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setContinent(c)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                        continent === c
                          ? 'bg-[var(--gold)] text-white border-[var(--gold)]'
                          : 'border-[rgba(212,175,55,0.25)] text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Budget Level</p>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                        budget === b
                          ? 'bg-[var(--gold)] text-white border-[var(--gold)]'
                          : 'border-[rgba(212,175,55,0.25)] text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Best For</p>
                <div className="flex flex-wrap gap-2">
                  {BEST_FOR_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setBestFor(bestFor === tag ? '' : tag)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                        bestFor === tag
                          ? 'bg-[var(--gold)] text-white border-[var(--gold)]'
                          : 'border-[rgba(212,175,55,0.25)] text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-[var(--text-muted)] underline hover:text-[var(--gold)]">
                  Clear all filters
                </button>
              )}
            </div>
          </FilterBar>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[var(--text-muted)]">
            {loading ? 'Searching...' : `Showing ${total} destination${total !== 1 ? 's' : ''}`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs flex items-center gap-1 text-[var(--gold)] hover:underline"
            >
              <X size={11} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[380px] rounded-[20px] bg-[#1a1814] animate-pulse" />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <div className="text-center py-20">
            <MapPin size={40} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)] text-lg">No destinations found</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
