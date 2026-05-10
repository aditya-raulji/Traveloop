'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, Heart, MessageCircle, Share, Star } from 'lucide-react';
import { format } from 'date-fns';
import CreatePostModal from '@/components/community/CreatePostModal';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/community?sort=${sort}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sort]);

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    // Optimistic UI
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: currentlyLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !currentlyLiked
        };
      }
      return p;
    }));

    try {
      await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: !currentlyLiked })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(search.toLowerCase()) || 
    p.trip?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-paper pb-20">
      {/* Header section */}
      <section className="bg-earth text-paper py-20 px-4">
        <div className="max-w-container text-center space-y-4">
          <h1 className="text-hero-heading text-gold leading-tight">Community</h1>
          <p className="font-body text-paper/80 text-lg md:text-xl font-light italic">Stories from fellow travelers</p>
        </div>
      </section>

      <div className="max-w-container -mt-8 relative z-10 space-y-8">
        {/* Top Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-earth/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-muted" />
            <input 
              type="text" 
              placeholder="Search community..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-paper rounded-full text-sm focus:outline-none border border-transparent focus:border-gold transition-colors"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-earth/20 text-sm font-medium text-earth hover:bg-paper transition-colors whitespace-nowrap">
              Group by <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-earth/20 text-sm font-medium text-earth hover:bg-paper transition-colors whitespace-nowrap">
              Filter <ChevronDown size={14} />
            </button>
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-earth/20 text-sm font-medium text-earth hover:bg-paper transition-colors whitespace-nowrap focus:outline-none appearance-none cursor-pointer bg-white"
            >
              <option value="latest">Sort by: Latest</option>
              <option value="liked">Sort by: Most liked</option>
            </select>
          </div>
        </div>

        {/* Share Button row */}
        <div className="flex justify-end">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gold text-white rounded-full font-medium hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
          >
            Share your story
          </button>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-20 text-earth-muted">Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-earth-muted bg-white rounded-[24px] border border-earth/5">
              No stories found. Be the first to share!
            </div>
          ) : (
            filteredPosts.map(post => (
              <article key={post.id} className="bg-paper-dark rounded-[20px] p-6 shadow-sm border border-earth/5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-serif italic text-xl overflow-hidden shrink-0">
                      {post.user.image ? (
                        <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
                      ) : (
                        post.user.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="text-card-heading text-earth">{post.user.name || 'Anonymous Traveler'}</h3>
                      <p className="font-body text-sm text-earth-muted mt-1">
                        Traveled to {post.trip?.stops?.[0]?.cityName || post.trip?.name || 'Unknown'} in {format(new Date(post.createdAt), 'MMM yyyy')}
                      </p>
                      {post.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < post.rating ? 'fill-gold text-gold' : 'text-earth/20'} />
                          ))}
                          <span className="text-xs text-earth-muted ml-1">{post.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-earth leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.map((img: string, i: number) => (
                      <img key={i} src={img} alt="Trip photo" className="rounded-xl h-48 w-full object-cover border border-earth/10" />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-xs font-medium">
                    📍 {post.trip?.name || 'Trip Adventure'}
                  </span>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-earth/10">
                  <button 
                    onClick={() => handleLike(post.id, post.hasLiked)}
                    className={`flex items-center gap-2 text-sm transition-colors ${post.hasLiked ? 'text-red-500' : 'text-earth-muted hover:text-earth'}`}
                  >
                    <Heart size={18} className={post.hasLiked ? 'fill-red-500' : ''} /> {post.likes} likes
                  </button>
                  <button className="flex items-center gap-2 text-sm text-earth-muted hover:text-earth transition-colors">
                    <MessageCircle size={18} /> 0 comments
                  </button>
                  <button className="flex items-center gap-2 text-sm text-earth-muted hover:text-earth transition-colors ml-auto">
                    <Share size={18} /> Share
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <CreatePostModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSuccess={fetchPosts}
      />
    </main>
  );
}
