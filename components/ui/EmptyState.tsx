import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-paper-dark rounded-[24px] border border-earth/10 shadow-sm", className)}>
      <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="font-serif italic text-2xl text-earth mb-2">{title}</h3>
      <p className="text-earth-muted max-w-sm mb-8">{message}</p>
      {action}
    </div>
  );
}
