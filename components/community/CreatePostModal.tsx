'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Star, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function CreatePostModal({ 
  open, 
  onOpenChange, 
  onSuccess 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
}) {
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Fetch user's trips to populate dropdown
      fetch('/api/trips')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTrips(data);
        })
        .catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || content.length < 10) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: selectedTrip,
          content,
          rating,
          images
        })
      });

      if (res.ok) {
        onSuccess();
        setContent('');
        setRating(0);
        setImages([]);
        setSelectedTrip('');
        onOpenChange(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDummyImage = () => {
    if (images.length >= 4) return;
    const dummyImages = [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a', // Paris
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', // Japan
      'https://images.unsplash.com/photo-1522083115901-1e1ae4f1270c', // Beach
      'https://images.unsplash.com/photo-1516483638261-f40889aba61b'  // Mountains
    ];
    setImages([...images, dummyImages[images.length]]);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-earth/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-earth/10 bg-paper p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-[24px]">
          
          <div className="flex justify-between items-center mb-2">
            <Dialog.Title className="font-serif italic text-3xl text-earth">Share your experience</Dialog.Title>
            <Dialog.Close className="text-earth-muted hover:text-earth rounded-full p-1 hover:bg-paper-dark transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-earth-muted mb-1">Select a Trip</label>
              <select 
                value={selectedTrip} 
                onChange={e => setSelectedTrip(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-earth/20 bg-white text-earth focus:outline-none focus:border-gold"
              >
                <option value="" disabled>Choose a completed trip...</option>
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-muted mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-colors"
                  >
                    <Star 
                      size={28} 
                      className={`${(hoverRating || rating) >= star ? 'fill-gold text-gold' : 'text-earth/20'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-muted mb-1">Story</label>
              <textarea 
                required
                minLength={10}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Tell the community about your journey..."
                className="w-full p-3 rounded-xl border border-earth/20 bg-white text-earth focus:outline-none focus:border-gold min-h-[140px] resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-muted mb-2">Photos (max 4)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-paper-dark group">
                    <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImages(images.filter((_, index) => index !== i))}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <button 
                    type="button" 
                    onClick={handleAddDummyImage}
                    className="aspect-square rounded-xl border-2 border-dashed border-earth/20 flex flex-col items-center justify-center text-earth-muted hover:bg-earth/5 hover:border-gold transition-colors"
                  >
                    <ImageIcon size={20} className="mb-1" />
                    <span className="text-xs">Add</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Dialog.Close asChild>
                <button type="button" className="flex-1 py-3 rounded-xl border border-earth/20 text-earth font-medium hover:bg-earth/5 transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                type="submit" 
                disabled={isLoading || !selectedTrip || content.length < 10}
                className="flex-1 py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                Share story
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
