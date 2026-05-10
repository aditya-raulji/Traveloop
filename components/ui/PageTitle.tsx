import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: 'hero' | 'section' | 'card';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const PageTitle = forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ className, size = 'hero', as: Comp = 'h1', ...props }, ref) => {
    const sizes = {
      hero: 'text-[72px] leading-tight',
      section: 'text-[48px] leading-tight',
      card: 'text-[32px] leading-tight',
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          'font-heading italic text-earth',
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
PageTitle.displayName = 'PageTitle';

export { PageTitle };
