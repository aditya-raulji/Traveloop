import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';

export interface TripCardProps {
  id: string;
  name: string;
  coverImage?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status: string;
  stopsCount?: number;
  budget?: number | null;
  variant?: 'default' | 'compact';
}

const statusConfig = {
  ONGOING: { label: 'Ongoing', color: 'bg-forest/15 text-forest' },
  UPCOMING: { label: 'Upcoming', color: 'bg-gold/15 text-gold' },
  COMPLETED: { label: 'Completed', color: 'bg-earth-muted/20 text-earth-muted' },
  DRAFT: { label: 'Draft', color: 'bg-paper-dark text-earth-muted border border-earth-muted/20' },
};

export function TripCard({ id, name, coverImage, startDate, endDate, status, stopsCount = 0, budget, variant = 'default' }: TripCardProps) {
  const statusStyle = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.DRAFT;
  const imgUrl = coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';

  if (variant === 'compact') {
    return (
      <div className="bg-paper-dark rounded-[20px] p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading italic text-[20px] text-earth truncate mb-1">{name}</h3>
            <div className="flex items-center gap-4 text-sm text-earth-muted font-body">
              {(startDate || endDate) && (
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
                  {endDate ? ` – ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                </span>
              )}
              {stopsCount > 0 && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {stopsCount} {stopsCount === 1 ? 'stop' : 'stops'}
                </span>
              )}
            </div>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ml-3 flex-shrink-0 ${statusStyle.color}`}>
            {statusStyle.label}
          </span>
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-earth-muted/10">
          <Link href={`/trips/${id}`} className="text-sm text-earth-muted hover:text-earth transition-colors font-medium">
            View →
          </Link>
          <Link href={`/trips/${id}/edit`} className="text-sm text-earth-muted hover:text-earth transition-colors font-medium">
            Edit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-[32px] overflow-hidden bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)] transition-all duration-500 cursor-pointer">
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${imgUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B241D]/40 to-transparent" />
        <span className={`absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full ${statusStyle.color} backdrop-blur-sm`}>
          {statusStyle.label}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-heading italic text-[24px] text-earth mb-2 line-clamp-1">{name}</h3>
        <div className="flex items-center gap-4 text-sm text-earth-muted font-body mb-4">
          {startDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {stopsCount > 0 && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {stopsCount} stops
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          {budget && (
            <span className="font-heading italic text-xl text-earth">${budget.toLocaleString()}</span>
          )}
          <Link href={`/trips/${id}`} className="text-gold font-medium hover:underline text-sm ml-auto">
            View Trip →
          </Link>
        </div>
      </div>
    </div>
  );
}
