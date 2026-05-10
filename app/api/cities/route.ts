import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/data/cities';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() ?? '';
  const continent = searchParams.get('continent') ?? '';
  const budget = searchParams.get('budget') ?? '';
  const bestFor = searchParams.get('bestFor') ?? '';
  const sort = searchParams.get('sort') ?? '';

  let results = [...CITIES];

  // Filter by search query
  if (q && q.length >= 1) {
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q)
    );
  }

  // Filter by continent
  if (continent && continent !== 'All') {
    results = results.filter((c) => c.continent === continent);
  }

  // Filter by budget level
  if (budget && budget !== 'Any') {
    results = results.filter((c) => c.budgetLevel === budget);
  }

  // Filter by bestFor tag
  if (bestFor && bestFor !== 'All') {
    results = results.filter((c) =>
      c.bestFor.some((tag) => tag.toLowerCase() === bestFor.toLowerCase())
    );
  }

  // Sort
  if (sort === 'budget-asc') {
    results.sort((a, b) => a.avgDailyBudget - b.avgDailyBudget);
  } else if (sort === 'budget-desc') {
    results.sort((a, b) => b.avgDailyBudget - a.avgDailyBudget);
  } else if (sort === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name-desc') {
    results.sort((a, b) => b.name.localeCompare(a.name));
  }

  return NextResponse.json({ cities: results, total: results.length });
}
