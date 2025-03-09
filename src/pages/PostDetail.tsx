
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import Comment from '@/components/Comment';
import CommentForm from '@/components/CommentForm';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById } = usePosts();
  const { isAdmin, user } = useAuth();
  const [post, setPost] = useState(id ? getPostById(id) : undefined);
  
  // Redirect if post not found
  useEffect(() => {
    if (!post) {
      navigate('/not-found', { replace: true });
    }
  }, [post, navigate]);

  // Check if current user can edit this post
  const canEdit = post && (isAdmin || (user && user.id === post.authorId));

  if (!post) {
    return null; // Will redirect to not found page
  }

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {canEdit && (
            <Button variant="outline" asChild>
              <a href={`/edit-post/${post.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Post
              </a>
            </Button>
          )}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <PostCard post={post} isDetailed />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Comments ({post.comments.length})
            </h2>
            
            <CommentForm postId={post.id} />
            
            {post.comments.length > 0 ? (
              <div className="mt-6">
                <Separator className="my-6" />
                {post.comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <Comment comment={comment} />
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 mt-6 border rounded-lg">
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
