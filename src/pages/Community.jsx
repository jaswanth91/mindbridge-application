import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Plus, 
  X, 
  Shield, 
  MoreVertical,
  Flag,
  Loader2,
  Users,
  Send,
  MessageCircle,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

const Community = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Support');
  const [posting, setPosting] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({}); 
  const [userProfile, setUserProfile] = useState(null);
  const [userLikes, setUserLikes] = useState([]); 
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchUserProfile();
    fetchUserLikes();
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id);
    };
    fetchUser();

    const postSubscription = supabase
      .channel('forum_posts_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setPosts(prev => prev.map(p => p.id === payload.new.id ? { ...p, likes: payload.new.likes } : p));
        } else if (payload.eventType === 'DELETE') {
          setPosts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    const commentSubscription = supabase
      .channel('forum_comments_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_comments' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setComments(prev => ({
            ...prev,
            [payload.new.post_id]: [...(prev[payload.new.post_id] || []), payload.new]
          }));
        } else if (payload.eventType === 'UPDATE') {
          setComments(prev => ({
            ...prev,
            [payload.new.post_id]: (prev[payload.new.post_id] || []).map(c => c.id === payload.new.id ? payload.new : c)
          }));
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => {
            const newComments = { ...prev };
            Object.keys(newComments).forEach(postId => {
              newComments[postId] = newComments[postId].filter(c => c.id !== payload.old.id);
            });
            return newComments;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postSubscription);
      supabase.removeChannel(commentSubscription);
    };
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      setUserProfile(data);
    }
  };

  const fetchUserLikes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id);
      if (data) setUserLikes(data.map(l => l.post_id));
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      data?.forEach(post => fetchComments(post.id));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    const { data } = await supabase.from('forum_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    if (data) setComments(prev => ({ ...prev, [postId]: data }));
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('forum_posts').insert([{
        user_id: user.id,
        author_name: userProfile?.full_name || 'Student',
        category: selectedCategory,
        content_en: newPostContent,
        likes: 0
      }]);
      setNewPostContent('');
      setIsModalOpen(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const isLiked = userLikes.includes(postId);

      if (isLiked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
        setUserLikes(prev => prev.filter(id => id !== postId));
        // Count will update via trigger + subscription
      } else {
        await supabase.from('post_likes').insert([{ post_id: postId, user_id: user.id }]);
        setUserLikes(prev => [...prev, postId]);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleCommentLike = async (postId, commentId, currentLikes) => {
    try {
      await supabase.from('forum_comments').update({ likes: (currentLikes || 0) + 1 }).eq('id', commentId);
    } catch (error) {
      console.error('Comment like error:', error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('forum_comments').insert([{
        post_id: postId,
        user_id: user.id,
        author_name: userProfile?.full_name || 'Student',
        content: newComment,
        likes: 0
      }]);
      setNewComment('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm(t('Are you sure you want to delete this post?', 'இந்த பதிவை நீக்க விரும்புகிறீர்களா?'))) return;
    try {
      const { error } = await supabase.from('forum_posts').delete().eq('id', postId);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t('Delete this comment?', 'இந்த கருத்தை நீக்கவா?'))) return;
    try {
      const { error } = await supabase.from('forum_comments').delete().eq('id', commentId);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-8 pb-12 pt-4">
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-dm-serif text-white">{t('Community', 'சமூகம்')}</h1>
            <Users className="text-mb-lavender/40" size={24} />
          </div>
          <p className="text-white/40 text-sm">{t('Share your journey and connect with others.', 'உங்கள் பயணத்தைப் பகிர்ந்து கொள்ளுங்கள்.')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary px-8 py-3.5 rounded-full flex items-center gap-2 shadow-xl font-bold text-sm">
          <Plus size={18} /> {t('New Post', 'புதிய பதிவு')}
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-mb-indigo" size={32} /></div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div key={post.id} className="glass-card p-6 border-white/5 hover:border-white/10 transition-all bg-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-mb-indigo/20 flex items-center justify-center text-xl">🌿</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{post.author_name}</h4>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                      {new Date(post.created_at).toLocaleDateString()} • {post.category}
                    </p>
                  </div>
                </div>
                {post.user_id === currentUserId && (
                  <button onClick={() => handleDeletePost(post.id)} className="p-2 text-white/10 hover:text-red-400 transition-all">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-6">{post.content_en}</p>

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 transition-all ${userLikes.includes(post.id) ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}>
                  <Heart size={18} className={userLikes.includes(post.id) ? 'fill-red-400' : ''} />
                  <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-2 text-white/40 hover:text-mb-indigo transition-all">
                  <MessageCircle size={18} />
                  <span className="text-xs font-bold">{comments[post.id]?.length || 0}</span>
                </button>
              </div>

              <AnimatePresence>
                {expandedPost === post.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 pt-6 border-t border-white/5 space-y-6 overflow-hidden">
                    <div className="space-y-4">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3 bg-white/5 p-4 rounded-2xl group/comment relative">
                          <div className="w-8 h-8 rounded-lg bg-mb-sky/20 flex items-center justify-center text-xs text-mb-sky font-bold shrink-0">{comment.author_name.charAt(0)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h5 className="text-xs font-bold text-white">{comment.author_name}</h5>
                              <div className="flex items-center gap-3">
                                <button onClick={() => handleCommentLike(post.id, comment.id, comment.likes)} className="flex items-center gap-1.5 text-white/20 hover:text-red-400 transition-all">
                                  <Heart size={12} className={comment.likes > 0 ? 'fill-red-400 text-red-400' : ''} />
                                  <span className="text-[10px] font-bold">{comment.likes || 0}</span>
                                </button>
                                {comment.user_id === currentUserId && (
                                  <button onClick={() => handleDeleteComment(comment.id)} className="text-white/10 hover:text-red-400 transition-all">
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={t('Write a supportive comment...', 'ஒரு கருத்தை எழுதுங்கள்...')} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                      <button onClick={() => handleAddComment(post.id)} className="w-12 h-12 rounded-xl bg-mb-indigo flex items-center justify-center text-white shadow-lg"><Send size={18} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-mb-dark-bg/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card w-full max-w-lg p-8 border-mb-indigo/30 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-dm-serif text-white">{t('Create New Post', 'புதிய பதிவு')}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-6">
                <div className="flex gap-2 flex-wrap">
                  {['SUPPORT', 'ANXIETY', 'STUDY', 'DEPRESSION', 'STRESS'].map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${selectedCategory === cat ? 'bg-mb-indigo border-mb-indigo text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>{cat}</button>
                  ))}
                </div>
                <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder={t("What's on your mind?", "உங்கள் மனதில் என்ன இருக்கிறது?")} className="input-field min-h-[150px] py-4 bg-white/5 border-white/10 resize-none text-sm" />
                <button onClick={handleCreatePost} disabled={posting || !newPostContent.trim()} className="btn-primary w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3">
                  {posting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> {t('Post Asynchronously', 'பதிவு செய்யவும்')}</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
