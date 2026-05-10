import Link from 'next/link';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row w-full overflow-hidden">
      {/* Mobile Logo Header */}
      <div className="md:hidden p-6 flex justify-center border-b border-gold/20">
        <Link href="/">
          <span className="font-heading italic text-2xl text-earth">Traveloop</span>
        </Link>
      </div>

      {/* LEFT SIDE (55%) - Cinematic Image */}
      <div className="hidden md:flex md:w-[55%] relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200")' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 z-10 bg-[#2B241D]/30" />
        
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center">
          <Link href="/">
            <h1 className="font-heading italic text-4xl lg:text-5xl text-white mb-6 hover:text-white/90 transition-colors">
              Traveloop
            </h1>
          </Link>
          <p className="font-heading italic text-xl lg:text-2xl text-white/80">
            Every journey tells a story
          </p>
          
          {/* Decorative curved SVG line */}
          <svg className="w-24 h-6 mt-6 text-gold/80" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 Q 25 0, 50 10 T 100 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* RIGHT SIDE (45%) - Form Area */}
      <div className="w-full md:w-[45%] flex flex-col justify-center items-center py-12 px-6 lg:px-16 xl:px-24 overflow-y-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
