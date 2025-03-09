
import React from 'react';
import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CreatePost = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/', { replace: true });
    } else if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <PostForm />
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
