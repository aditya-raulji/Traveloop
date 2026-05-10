import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseStyles = 'font-body text-sm tracking-wider transition-all duration-400';
    const variants = {
      primary: 'bg-gold text-white rounded-pill px-8 py-4 hover:bg-gold-dark hover:-translate-y-[2px]',
      secondary: 'border border-gold bg-transparent text-gold rounded-pill px-8 py-4 hover:bg-gold hover:text-white',
      ghost: 'bg-transparent text-earth-muted hover:text-earth border-none p-0',
      danger: 'bg-error text-white rounded-pill px-8 py-4 hover:opacity-90',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
