import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Pages that have a dark hero image and need white text initially
  const isHeroPage = pathname === '/' || pathname.startsWith('/explore/cities/');
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/dashboard' },
    { label: 'My Trips', href: '/trips' },
    { label: 'Explore', href: '/explore/cities' },
    { label: 'Community', href: '/community' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center',
        isScrolled
          ? 'backdrop-blur-md bg-paper/70 border-b border-gold/20'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className={cn(
            "font-heading italic text-2xl transition-colors duration-300",
            (isHeroPage && !isScrolled) ? 'text-white' : 'text-earth'
          )}>
            Traveloop
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "uppercase tracking-widest text-xs font-body transition-colors duration-300",
                    (isHeroPage && !isScrolled) ? 'text-white/80 hover:text-white' : 'text-earth-muted hover:text-earth'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {session?.user ? (
            <Link href="/profile" className="w-10 h-10 rounded-full border border-gold/20 overflow-hidden flex items-center justify-center bg-gold/10 text-gold font-serif italic hover:scale-105 transition-transform">
              {session.user.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                session.user.name?.charAt(0) || 'U'
              )}
            </Link>
          ) : (
            <Link href="/login">
              <Button 
                variant={isHeroPage && !isScrolled ? 'outline' : 'ghost'} 
                className={cn(
                  isHeroPage && !isScrolled && "text-white border-white/30 hover:bg-white/10"
                )}
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className={cn(
            "lg:hidden transition-colors duration-300 z-[60]",
            isMobileOpen ? 'text-paper' : (isHeroPage && !isScrolled ? 'text-white' : 'text-earth')
          )}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#2B241D]/97 backdrop-blur-xl flex flex-col items-center justify-center gap-8 lg:hidden animate-in fade-in">
          <ul className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="font-heading italic text-[32px] text-paper hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="w-16 h-px bg-gold/30 my-4" />

          {session?.user ? (
            <Link href="/profile" onClick={() => setIsMobileOpen(false)} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-gold/40 overflow-hidden flex items-center justify-center bg-gold/10 text-gold font-serif italic text-2xl">
                {session.user.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  session.user.name?.charAt(0) || 'U'
                )}
              </div>
              <span className="text-paper font-heading italic text-xl">My Profile</span>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setIsMobileOpen(false)}>
              <Button className="bg-gold text-white rounded-pill px-10 py-4 text-lg">
                Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
