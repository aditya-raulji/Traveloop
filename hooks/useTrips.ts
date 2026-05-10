import { useState, useEffect, useCallback } from 'react';

export interface Trip {
  id: string;
  name: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status: string;
  budget?: number | null;
  currency?: string | null;
  coverImage?: string | null;
  stops?: { id: string }[];
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/trips');
      if (!res.ok) throw new Error('Failed to fetch trips');
      const data = await res.json();
      setTrips(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTrip = async (data: Partial<Trip> & { name: string }) => {
    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create trip');
    const newTrip = await res.json();
    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  };

  const deleteTrip = async (id: string) => {
    const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete trip');
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, isLoading, error, fetchTrips, createTrip, deleteTrip };
}
