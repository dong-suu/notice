
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePosts, Post } from '@/contexts/PostsContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchPosts } = usePosts();
  const [results, setResults] = useState<Post[]>([]);
  
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    if (query) {
      const foundPosts = searchPosts(query);
      setResults(foundPosts);
    } else {
      navigate('/');
    }
  }, [query, searchPosts, navigate]);

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          <p className="text-muted-foreground mt-1">
            {results.length} {results.length === 1 ? 'result' : 'results'} found for "{query}"
          </p>
        </div>
        
        <div className="grid gap-6">
          {results.length > 0 ? (
            results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground mt-1">
                Try searching with different keywords
              </p>
              <Button className="mt-4" onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;
