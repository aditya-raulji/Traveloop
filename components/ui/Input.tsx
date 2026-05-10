import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-[56px] w-full bg-white/70 border border-[#D8CBB8] rounded-pill px-6 font-body text-earth',
          'focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15',
          'placeholder:text-earth-muted/60 transition-all',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
