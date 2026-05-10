import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'forest' | 'earth';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'gold', ...props }, ref) => {
    const variants = {
      gold: 'bg-gold/10 text-gold-dark',
      forest: 'bg-forest/10 text-forest',
      earth: 'bg-earth/10 text-earth',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-pill text-xs font-body tracking-wide uppercase font-semibold',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
