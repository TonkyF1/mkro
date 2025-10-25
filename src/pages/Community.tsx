import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  Award,
  Send,
  Loader2,
  Crown
} from 'lucide-react';
import { PremiumFeatureLock } from '@/components/PremiumFeatureLock';

interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string;
  user_name?: string;
  user_level?: string;
}

const Community = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';
  
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isPremium) {
      fetchPosts();
    }
  }, [isPremium]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('kind', 'checkin')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const postsData = data?.map(event => ({
        id: event.id,
        user_id: event.user_id,
        content: event.summary,
        likes: (event.payload as any)?.likes || 0,
        created_at: event.created_at,
        user_name: (event.payload as any)?.user_name || 'Anonymous',
        user_level: (event.payload as any)?.user_level || 'Bronze',
      })) || [];

      setPosts(postsData);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load community posts',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;
    if (!isPremium) return;
    if (!user?.id) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          user_id: user.id,
          kind: 'checkin',
          summary: newPost,
          payload: {
            likes: 0,
            user_name: profile?.name || 'Anonymous',
            user_level: profile?.level || 'Bronze',
            type: 'community_post'
          }
        }]);

      if (error) throw error;

      toast({
        title: 'Posted!',
        description: 'Your post has been shared with the community',
      });

      setNewPost('');
      fetchPosts();
    } catch (error: any) {
      console.error('Error posting:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to post. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isPremium) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('events')
        .update({
          payload: {
            likes: post.likes + 1,
            user_name: post.user_name,
            user_level: post.user_level,
          }
        })
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
    } catch (error: any) {
      console.error('Error liking post:', error);
    }
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Community
                </h1>
                <p className="text-muted-foreground">Connect with other MKRO members</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-12 text-center blur-sm pointer-events-none">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                  <div className="flex-1 text-left">
                    <div className="h-4 bg-primary/20 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                  <div className="flex-1 text-left">
                    <div className="h-4 bg-primary/20 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </Card>
            <PremiumFeatureLock feature="Community Group" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                Community
              </h1>
              <p className="text-muted-foreground">Connect, share, and motivate each other</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-purple-500 mb-2" />
                <p className="text-2xl font-bold">1.2K</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20">
              <div className="flex flex-col items-center">
                <MessageCircle className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/20">
              <div className="flex flex-col items-center">
                <TrendingUp className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-2xl font-bold">Active</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Create Post */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Share with the Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your progress, tips, or ask questions..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button 
              onClick={handleSubmitPost}
              disabled={submitting || !newPost.trim()}
              className="w-full min-h-[48px]"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Post to Community
            </Button>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading posts...</p>
          </Card>
        ) : posts.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share something with the community!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{post.user_name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.user_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(post.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-foreground leading-relaxed">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="gap-2 min-h-[40px]"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 min-h-[40px]">
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
