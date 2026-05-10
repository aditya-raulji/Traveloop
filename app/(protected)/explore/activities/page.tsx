'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { ActivityListCard } from '@/components/explore/ActivityListCard';
import { FilterBar } from '@/components/explore/FilterBar';

const CATEGORY_PILLS = [
  { label: 'All', value: 'All' },
  { label: '🏛 Sightseeing', value: 'Sightseeing' },
  { label: '🍜 Food & Dining', value: 'Food & Dining' },
  { label: '🧗 Adventure', value: 'Adventure' },
  { label: '🎭 Culture', value: 'Culture' },
  { label: '🛍 Shopping', value: 'Shopping' },
  { label: '🚌 Transport', value: 'Transport' },
  { label: '🏨 Stay', value: 'Stay' },
  { label: '🌿 Nature', value: 'Nature' },
];

const SORT_OPTIONS = [
  { label: 'Top Rated', value: 'rating' },
  { label: 'Cost (Low → High)', value: 'cost-asc' },
  { label: 'Cost (High → Low)', value: 'cost-desc' },
  { label: 'Duration', value: 'duration' },
];

const PAGE_SIZE = 20;

interface Activity {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  city: string;
  country?: string | null;
  avgCost?: number | null;
  duration?: number | null;
  imageUrl?: string | null;
  rating: number;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('rating');
  const [offset, setOffset] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchActivities = useCallback(
    async (reset = true) => {
      if (reset) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const params = new URLSearchParams({
        sort,
        limit: String(PAGE_SIZE),
        offset: String(currentOffset),
      });
      if (q) params.set('q', q);
      if (category !== 'All') params.set('category', category);

      try {
        const res = await fetch(`/api/activities?${params.toString()}`);
        const data = await res.json();
        const newItems: Activity[] = data.activities ?? [];
        setTotal(data.total ?? 0);
        if (reset) {
          setActivities(newItems);
        } else {
          setActivities((prev) => [...prev, ...newItems]);
          setOffset(currentOffset + PAGE_SIZE);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [q, category, sort, offset]
  );

  // Trigger on filter/sort/search changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchActivities(true), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, sort]);

  function handleLoadMore() {
    fetchActivities(false);
  }

  const hasMore = activities.length < total;

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-['Cormorant_Garamond'] italic text-5xl text-[var(--text-primary)] mb-2">
            Explore Activities
          </h1>
          <p className="text-[var(--text-muted)] text-base">
            Browse thousands of experiences across the globe.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search activities, cities, categories..."
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

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setCategory(pill.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-all duration-200 font-medium ${
                category === pill.value
                  ? 'bg-[var(--gold)] text-white border-[var(--gold)]'
                  : 'border-[rgba(212,175,55,0.3)] text-[var(--gold)] bg-transparent hover:bg-[rgba(212,175,55,0.08)]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Sort bar */}
        <div className="mb-5">
          <FilterBar
            sortOptions={SORT_OPTIONS}
            selectedSort={sort}
            onSortChange={setSort}
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-[var(--text-muted)] mb-4">
          {loading ? 'Searching...' : `Showing ${activities.length} of ${total} activities`}
        </p>

        {/* Activity list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[120px] rounded-[20px] bg-[#1a1814] animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-lg">No activities found</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {activities.map((activity) => (
                <ActivityListCard key={activity.id} activity={activity} />
              ))}
            </div>

            {/* Load more / pagination */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full border border-[rgba(212,175,55,0.3)] text-[var(--gold)] hover:bg-[rgba(212,175,55,0.08)] transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : `Load more (${total - activities.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
