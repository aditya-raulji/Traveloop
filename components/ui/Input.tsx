import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-earth-muted">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'h-[56px] w-full bg-white/70 border border-[#D8CBB8] rounded-pill font-body text-earth',
            'focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15',
            'placeholder:text-earth-muted/60 transition-all',
            leftIcon ? 'pl-14' : 'pl-6',
            rightIcon ? 'pr-14' : 'pr-6',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-earth-muted">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
