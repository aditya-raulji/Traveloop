import { NextResponse } from 'next/server';

const CITIES = [
  { city: "Paris", country: "France" },
  { city: "London", country: "United Kingdom" },
  { city: "Tokyo", country: "Japan" },
  { city: "New York", country: "United States" },
  { city: "Bali", country: "Indonesia" },
  { city: "Rome", country: "Italy" },
  { city: "Barcelona", country: "Spain" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Dubai", country: "UAE" },
  { city: "Singapore", country: "Singapore" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Vienna", country: "Austria" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Kyoto", country: "Japan" },
  { city: "Sydney", country: "Australia" },
  { city: "Cape Town", country: "South Africa" },
  { city: "Rio de Janeiro", country: "Brazil" },
  { city: "Mexico City", country: "Mexico" },
  { city: "Marrakech", country: "Morocco" },
  { city: "Santorini", country: "Greece" },
  { city: "Reykjavik", country: "Iceland" },
  { city: "Zurich", country: "Switzerland" },
  { city: "Seoul", country: "South Korea" },
  { city: "Athens", country: "Greece" },
  { city: "Budapest", country: "Hungary" },
  { city: "Florence", country: "Italy" },
  { city: "Venice", country: "Italy" },
  { city: "Copenhagen", country: "Denmark" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Oslo", country: "Norway" },
  { city: "Dubrovnik", country: "Croatia" },
  { city: "Petra", country: "Jordan" },
  { city: "Machu Picchu", country: "Peru" },
  { city: "Cairo", country: "Egypt" },
  { city: "Mumbai", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Jaipur", country: "India" },
  { city: "Kathmandu", country: "Nepal" },
  { city: "Colombo", country: "Sri Lanka" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Ho Chi Minh City", country: "Vietnam" },
  { city: "Chiang Mai", country: "Thailand" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "Manila", country: "Philippines" },
  { city: "Taipei", country: "Taiwan" },
  { city: "Shanghai", country: "China" },
  { city: "Beijing", country: "China" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Casablanca", country: "Morocco" },
  { city: "Accra", country: "Ghana" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Toronto", country: "Canada" },
  { city: "Vancouver", country: "Canada" },
  { city: "Montreal", country: "Canada" },
  { city: "Los Angeles", country: "United States" },
  { city: "Miami", country: "United States" },
  { city: "Chicago", country: "United States" },
  { city: "San Francisco", country: "United States" },
  { city: "Buenos Aires", country: "Argentina" },
  { city: "Santiago", country: "Chile" },
  { city: "Bogotá", country: "Colombia" },
  { city: "Lima", country: "Peru" },
  { city: "Havana", country: "Cuba" },
  { city: "Cancún", country: "Mexico" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() ?? '';

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const results = CITIES
    .filter(c =>
      c.city.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    )
    .slice(0, 8);

  return NextResponse.json(results);
}
