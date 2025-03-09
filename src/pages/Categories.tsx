
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/contexts/PostsContext';

const Categories = () => {
  const { categories, posts } = usePosts();
  
  // Count posts per category
  const getCategoryCount = (category: string) => {
    return posts.filter(post => post.category === category).length;
  };

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Browse posts by category</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category} className="overflow-hidden transition-all duration-200 hover:shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle>{category}</CardTitle>
                <CardDescription>
                  {getCategoryCount(category)} {getCategoryCount(category) === 1 ? 'post' : 'posts'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to={`/?category=${category}`}>
                    View Posts
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
