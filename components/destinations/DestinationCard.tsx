import Image from 'next/image';
import Link from 'next/link';

const destinations = [
  { city: "Paris", country: "France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
  { city: "Bali", country: "Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400" },
  { city: "Kyoto", country: "Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400" },
  { city: "Reykjavik", country: "Iceland", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
  { city: "Marrakech", country: "Morocco", img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400" },
];

export interface DestinationCardProps {
  city: string;
  country: string;
  img: string;
  size?: 'sm' | 'md';
}

export function DestinationCard({ city, country, img }: DestinationCardProps) {
  return (
    <div className="relative w-full h-[280px] rounded-[20px] overflow-hidden group cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url("${img}")` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2B241D]/80 via-transparent to-transparent" />
      
      {/* City name */}
      <div className="absolute bottom-5 left-5 z-10">
        <h3 className="font-heading italic text-white text-[24px] leading-tight">{city}</h3>
        <p className="font-body text-white/70 text-[12px] uppercase tracking-wider">{country}</p>
      </div>
    </div>
  );
}

export { destinations };
