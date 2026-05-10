import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-earth text-paper/70 py-16 mt-auto">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Link href="/">
            <span className="font-heading italic text-4xl text-paper">Traveloop</span>
          </Link>
          <p className="mt-4 font-body text-sm text-paper/50">
            Every journey tells a story.
          </p>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-heading italic text-xl text-paper mb-4">Platform</h4>
            <ul className="flex flex-col gap-2 font-body text-sm">
              <li><Link href="/trips" className="hover:text-gold transition-colors">My Trips</Link></li>
              <li><Link href="/planner" className="hover:text-gold transition-colors">AI Planner</Link></li>
              <li><Link href="/community" className="hover:text-gold transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading italic text-xl text-paper mb-4">Resources</h4>
            <ul className="flex flex-col gap-2 font-body text-sm">
              <li><Link href="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
              <li><Link href="/guides" className="hover:text-gold transition-colors">Travel Guides</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading italic text-xl text-paper mb-4">Legal</h4>
            <ul className="flex flex-col gap-2 font-body text-sm">
              <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-paper/10 text-center font-body text-xs text-paper/40">
        &copy; {new Date().getFullYear()} Traveloop. All rights reserved.
      </div>
    </footer>
  );
}
