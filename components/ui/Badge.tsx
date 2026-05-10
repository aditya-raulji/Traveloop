import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'gold-light' | 'forest' | 'earth';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'gold', ...props }, ref) => {
    const variants = {
      gold: 'bg-[#B08968] text-paper',
      'gold-light': 'bg-[#B08968]/10 text-[#B08968]',
      forest: 'bg-[#606C38] text-paper',
      earth: 'bg-[#2B241D] text-paper',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-pill text-xs font-body tracking-wide uppercase font-semibold transition-colors',
          variants[variant as keyof typeof variants] || variants.gold,
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
