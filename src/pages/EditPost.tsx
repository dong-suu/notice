
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById } = usePosts();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(id ? getPostById(id) : undefined);
  
  // Check authentication and permissions
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (!post) {
      navigate('/not-found', { replace: true });
      return;
    }
    
    // Check if user has permission to edit this post
    const canEdit = isAdmin || post.authorId === user.id;
    if (!canEdit) {
      navigate('/', { replace: true });
    }
  }, [post, user, isAdmin, navigate]);

  if (!post || !user) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <PostForm post={post} />
        </div>
      </div>
    </Layout>
  );
};

export default EditPost;
