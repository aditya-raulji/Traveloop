import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-paper-dark shadow-[0_10px_40px_rgba(0,0,0,0.06)]',
      elevated: 'bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]',
      flat: 'bg-paper-dark border border-gold/10',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-card overflow-hidden', variants[variant], className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export { Card };
