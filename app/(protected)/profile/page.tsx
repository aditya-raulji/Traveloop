'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Camera, MapPin, Mail, Phone, Calendar, Globe, Bell, Map, Activity, MessageCircle, LogOut, Loader2, Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    city: '',
    country: '',
    phone: '',
    image: '',
    language: 'English'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setFormData({
            name: data.name || '',
            bio: data.bio || '',
            city: data.city || '',
            country: data.country || '',
            phone: data.phone || '',
            image: data.image || '',
            language: 'English'
          });
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [session]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const { user } = await res.json();
        setProfile({ ...profile, ...user });
        await update({ name: user.name, image: user.image });
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={40} /></div>;
  }

  const publicTrips = profile?.trips || [];

  return (
    <main className="min-h-screen bg-paper pb-20">
      {/* Profile Header */}
      <section className="bg-earth text-paper py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-paper bg-gold/20 overflow-hidden relative">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gold font-serif italic">{profile.name?.charAt(0)}</div>
              )}
            </div>
            {activeTab === 'Settings' && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="font-serif italic text-4xl md:text-5xl text-gold">{profile.name}</h1>
            <p className="text-paper/80 max-w-lg">{profile.bio || 'Wandering the globe, one city at a time.'}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-paper/60 mt-2">
              <MapPin size={14} /> 
              <span>{(profile.city && profile.country) ? `${profile.city}, ${profile.country}` : 'Location unknown'}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-center md:text-left pt-6 md:pt-0 border-t border-white/10 md:border-t-0 md:border-l md:pl-8">
            <div>
              <p className="font-serif italic text-3xl text-gold">{profile.trips?.length || 0}</p>
              <p className="text-xs text-paper/60 uppercase tracking-wider mt-1">Trips</p>
            </div>
            <div>
              <p className="font-serif italic text-3xl text-gold">{profile.reviews?.length || 0}</p>
              <p className="text-xs text-paper/60 uppercase tracking-wider mt-1">Posts</p>
            </div>
            <div>
              <p className="font-serif italic text-3xl text-gold">0</p>
              <p className="text-xs text-paper/60 uppercase tracking-wider mt-1">Days Traveled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-earth/10 sticky top-[73px] z-30">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto hide-scrollbar">
          {['Overview', 'Saved Destinations', 'Preplanned Trips', 'Previous Trips', 'Settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? 'border-gold text-earth' : 'border-transparent text-earth-muted hover:text-earth'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <h3 className="font-serif italic text-2xl text-earth">Recent Activity</h3>
              <div className="bg-white p-6 rounded-[20px] shadow-sm border border-earth/10 text-center text-earth-muted">
                Activity feed coming soon...
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="font-serif italic text-2xl text-earth">Favorite Places</h3>
              <div className="bg-white p-6 rounded-[20px] shadow-sm border border-earth/10 text-center text-earth-muted">
                No favorites yet.
              </div>
            </div>
          </div>
        )}

        {/* SAVED DESTINATIONS (New Feature) */}
        {activeTab === 'Saved Destinations' && (
          <div className="space-y-6">
            <h3 className="font-serif italic text-2xl text-earth">Saved Destinations</h3>
            {profile?.savedCities?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {profile.savedCities.map((city: string, i: number) => (
                  <div key={i} className="group relative rounded-[20px] h-[180px] overflow-hidden bg-paper-dark border border-earth/10 shadow-sm cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400`} alt={city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-5">
                      <div className="flex justify-end">
                        <button className="bg-white/20 p-2 rounded-full backdrop-blur-sm text-white hover:bg-error transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="text-white font-medium text-lg mb-1">{city}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[24px] border border-earth/10 text-center">
                <p className="text-earth-muted mb-4">You haven't saved any destinations yet.</p>
                <Link href="/explore/cities" className="px-6 py-2 bg-gold text-white rounded-full text-sm font-medium hover:bg-gold-dark transition-colors inline-block">Explore Cities</Link>
              </div>
            )}
          </div>
        )}

        {/* TRIPS TABS */}
        {(activeTab === 'Preplanned Trips' || activeTab === 'Previous Trips') && (
          <div className="space-y-6">
            <h3 className="font-serif italic text-2xl text-earth">{activeTab}</h3>
            {publicTrips.length === 0 ? (
              <div className="bg-white p-12 rounded-[24px] border border-earth/10 text-center">
                <p className="text-earth-muted mb-4">No trips found in this category.</p>
                <Link href="/trips/new" className="px-6 py-2 bg-gold text-white rounded-full text-sm font-medium hover:bg-gold-dark transition-colors inline-block">Plan a new trip</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {publicTrips.map((trip: any) => (
                  <div key={trip.id} className="group relative rounded-[20px] h-[180px] overflow-hidden bg-paper-dark border border-earth/10 shadow-sm cursor-pointer">
                    {trip.coverImage && <img src={trip.coverImage} alt={trip.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <h4 className="text-white font-medium text-lg mb-1">{trip.name}</h4>
                      <Link href={`/trips/${trip.id}`} className="text-gold text-sm font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Details →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'Settings' && (
          <div className="max-w-2xl bg-white rounded-[24px] shadow-sm border border-earth/10 overflow-hidden">
            <div className="p-8 border-b border-earth/10">
              <h3 className="font-serif italic text-2xl text-earth mb-6">User Details</h3>
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-earth-muted mb-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-muted mb-1">Email <span className="text-xs text-earth-muted/50 font-normal">(Contact support to change)</span></label>
                    <input type="email" value={session?.user?.email || ''} disabled className="w-full p-3 rounded-xl border border-earth/10 bg-paper/50 text-earth-muted cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-muted mb-1">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-muted mb-1">Profile Photo URL</label>
                    <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-muted mb-1">City</label>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-muted mb-1">Country</label>
                    <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-muted mb-1">Language Preference</label>
                    <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold">
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-muted mb-1 flex justify-between">
                    <span>Bio</span>
                    <span className="text-xs font-normal">{formData.bio.length}/300</span>
                  </label>
                  <textarea 
                    value={formData.bio} 
                    onChange={e => setFormData({...formData, bio: e.target.value})} 
                    maxLength={300}
                    className="w-full p-3 rounded-xl border border-earth/20 bg-paper focus:outline-none focus:border-gold min-h-[100px] resize-y" 
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="submit" disabled={isSaving} className="px-6 py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20 flex items-center gap-2">
                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                    Save changes
                  </button>
                </div>
              </form>
            </div>

            <div className="p-8 border-b border-earth/10 bg-paper/30">
              <h3 className="font-serif italic text-2xl text-earth mb-6">Change Password</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                  return alert("New passwords don't match!");
                }
                const res = await fetch('/api/auth/change-password', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
                });
                if (res.ok) {
                  alert('Password updated successfully');
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } else {
                  const err = await res.json();
                  alert(err.error || 'Failed to update password');
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-muted mb-1">Current Password</label>
                  <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} required className="w-full p-3 rounded-xl border border-earth/20 bg-white focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-muted mb-1">New Password</label>
                  <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength={6} className="w-full p-3 rounded-xl border border-earth/20 bg-white focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-muted mb-1">Confirm New Password</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required minLength={6} className="w-full p-3 rounded-xl border border-earth/20 bg-white focus:outline-none focus:border-gold" />
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="px-6 py-3 rounded-xl bg-earth text-white font-medium hover:bg-earth-muted transition-colors shadow-sm">
                    Update password
                  </button>
                </div>
              </form>
            </div>

            <div className="p-8 bg-error/5">
              <h3 className="font-medium text-error mb-2">Danger Zone</h3>
              <p className="text-sm text-error/80 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="px-4 py-2 border border-error text-error rounded-xl text-sm font-medium hover:bg-error hover:text-white transition-colors">
                Delete account
              </button>
            </div>
            
            <div className="p-8 border-t border-earth/10 flex justify-center">
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-earth-muted hover:text-earth font-medium">
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
