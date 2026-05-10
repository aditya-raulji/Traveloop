import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Compass, Map, Wallet, Plus, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageTitle } from "@/components/ui/PageTitle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  let trips: any[] = [];
  let dbError = false;
  
  try {
    trips = await prisma.trip.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'asc' },
      take: 4
    });
  } catch (err) {
    console.error("Database connection error:", err);
    dbError = true;
  }

  const upcomingTrips = trips.filter(t => t.startDate && t.startDate >= new Date());

  // Mock community posts for inspiration
  const inspirations = [
    { id: 1, title: "7 Days in Kyoto", author: "Sakura M.", likes: 124 },
    { id: 2, title: "Backpacking the Alps", author: "Alex R.", likes: 89 },
    { id: 3, title: "Hidden Gems of Rome", author: "Elena V.", likes: 256 },
  ];

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 flex flex-col gap-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <PageTitle size="hero" className="mb-2">
            Welcome back, {session.user.name?.split(' ')[0] || 'Traveler'}
          </PageTitle>
          <p className="text-earth-muted font-body text-lg">
            Ready for your next adventure?
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={18} />
          Create New Trip
        </Button>
      </div>

      {dbError && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-sm font-body">
          Warning: Could not connect to the database. Make sure your DATABASE_URL is properly configured.
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="flat" className="bg-paper-dark/50 border-none">
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <Map size={24} />
            </div>
            <div>
              <p className="text-sm font-body text-earth-muted uppercase tracking-wider mb-1">Total Trips</p>
              <h3 className="font-heading italic text-3xl text-earth">{trips.length}</h3>
            </div>
          </div>
        </Card>
        <Card variant="flat" className="bg-paper-dark/50 border-none">
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-forest">
              <Compass size={24} />
            </div>
            <div>
              <p className="text-sm font-body text-earth-muted uppercase tracking-wider mb-1">Upcoming</p>
              <h3 className="font-heading italic text-3xl text-earth">{upcomingTrips.length}</h3>
            </div>
          </div>
        </Card>
        <Card variant="flat" className="bg-paper-dark/50 border-none">
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-earth/10 flex items-center justify-center text-earth">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm font-body text-earth-muted uppercase tracking-wider mb-1">Travel Fund</p>
              <h3 className="font-heading italic text-3xl text-earth">
                ${trips.reduce((acc, t) => acc + (t.budget || 0), 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Column - My Trips */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-earth-muted/20 pb-4">
            <h2 className="font-heading italic text-3xl text-earth">Your Journeys</h2>
            <Link href="/trips" className="text-gold font-medium hover:underline text-sm uppercase tracking-wide">
              View All
            </Link>
          </div>

          {!dbError && trips.length === 0 ? (
            <div className="bg-white/40 border-2 border-dashed border-earth-muted/30 rounded-[24px] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-paper-dark flex items-center justify-center text-earth-muted mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="font-heading italic text-2xl text-earth mb-2">No trips planned yet</h3>
              <p className="text-earth-muted font-body mb-6 max-w-sm">
                Every great story begins with a single step. Start planning your first cinematic journey today.
              </p>
              <Button variant="secondary" className="flex items-center gap-2">
                <Plus size={18} />
                Draft your first trip
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.map((trip) => (
                <Card key={trip.id} variant="elevated" className="overflow-hidden group cursor-pointer border-none shadow-premium hover:shadow-premium-hover transition-all duration-300">
                  <div className="h-48 bg-paper-dark relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#2B241D]/20 z-10 group-hover:bg-[#2B241D]/10 transition-colors" />
                    {/* Placeholder image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800')` }}
                    />
                  </div>
                  <div className="p-6 relative z-20 bg-white/90 backdrop-blur-sm">
                    <h3 className="font-heading italic text-2xl text-earth mb-2 line-clamp-1">{trip.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-earth-muted font-body mb-4">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium px-3 py-1 bg-gold/10 text-gold rounded-full">
                        {trip.status || 'DRAFT'}
                      </span>
                      <span className="font-heading italic text-lg text-earth">
                        ${trip.budget?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Inspiration */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-earth-muted/20 pb-4">
            <h2 className="font-heading italic text-2xl text-earth">Community Inspiration</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {inspirations.map((post) => (
              <div key={post.id} className="flex gap-4 p-4 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors cursor-pointer border border-transparent hover:border-gold/20">
                <div className="w-20 h-20 rounded-xl bg-paper-dark flex-shrink-0 overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200')` }}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-heading italic text-lg text-earth line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-earth-muted font-body uppercase tracking-wide mb-2">By {post.author}</p>
                  <div className="flex items-center gap-1 text-xs text-gold font-medium">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {post.likes}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" className="w-full text-gold hover:text-gold/80 mt-2">
            Explore more →
          </Button>
        </div>
      </div>
    </div>
  );
}
