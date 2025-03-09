
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';
import { useEffect } from 'react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Filter posts created by the current user
  const userPosts = posts.filter(post => post.authorId === user.id);
  
  // Count comments made by the user
  const userComments = posts.flatMap(post => 
    post.comments.filter(comment => comment.authorId === user.id)
  );
  
  // Count likes given by the user
  const userLikes = posts.filter(post => post.likes.includes(user.id)).length;

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              
              <div className="text-center space-y-2">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge>{user.role}</Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-md">
                  <div className="text-3xl font-bold">{userPosts.length}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                
                <div className="text-center p-4 border rounded-md">
                  <div className="text-3xl font-bold">{userComments.length}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
                
                <div className="text-center p-4 border rounded-md">
                  <div className="text-3xl font-bold">{userLikes}</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log Out
              </Button>
            </CardFooter>
          </Card>
          
          {userPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">My Posts</h2>
              <div className="grid gap-4">
                {userPosts.map(post => (
                  <Card key={post.id} className="p-4">
                    <div className="font-medium">
                      <a href={`/post/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.comments.length} comments
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.likes.length} likes
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
