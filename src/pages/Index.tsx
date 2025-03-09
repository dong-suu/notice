
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, MessageSquare, Bell, ArrowRight } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { posts, loading, categories } = usePosts();
  const { user, isAdmin } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredPosts = categoryFilter === 'all' 
    ? posts 
    : posts.filter(post => post.category === categoryFilter);

  // Take the 3 most recent posts for the featured section
  const featuredPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-background">
        <div className="container py-16 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Welcome to the{" "}
                  <span className="text-primary">Community Notice Board</span>
                </h1>
                <p className="text-muted-foreground max-w-[600px] md:text-xl">
                  Stay informed with the latest announcements, updates, and community news all in one place.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to={user ? (isAdmin ? "/create-post" : "/categories") : "/login"}>
                    {user ? (isAdmin ? "Create Post" : "Browse Categories") : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!user && (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/register">Create Account</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl bg-muted flex items-center justify-center shadow-xl overflow-hidden">
              <div className="px-8 py-12 text-center space-y-4">
                <Bell className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-medium">Stay Updated</h3>
                <p className="text-muted-foreground">
                  Get notified about important announcements and community events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="bg-background">
        <div className="container py-12 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Announcements</h2>
              <p className="text-muted-foreground mt-1">The latest and most important updates</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/categories">
                <Filter className="mr-2 h-4 w-4" />
                View All Categories
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center p-8 border rounded-lg">
                <h3 className="text-lg font-medium">No featured posts yet</h3>
                <p className="text-muted-foreground mt-1">
                  Check back soon for new announcements!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Posts Section */}
      <div className="bg-accent/30 dark:bg-accent/10">
        <div className="container py-12 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">All Notices</h2>
              <p className="text-muted-foreground mt-1">View the latest announcements and updates</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Category filter */}
              <div className="w-full sm:w-[200px]">
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Create post button (Admin only) */}
              {isAdmin && (
                <Button asChild>
                  <Link to="/create-post">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Post
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Posts list */}
          <div className="grid gap-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-muted-foreground mt-1">
                  {categoryFilter !== 'all' 
                    ? `There are no posts in the '${categoryFilter}' category.` 
                    : 'There are no posts yet.'}
                </p>
                {isAdmin && (
                  <Button className="mt-4" asChild>
                    <Link to="/create-post">Create the first post</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      {!user && (
        <div className="bg-primary/5 dark:bg-primary/10">
          <div className="container py-12 px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Join Our Community</h2>
              <p className="text-muted-foreground text-lg">
                Create an account to comment on posts, react to announcements, and stay updated with the latest information.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild>
                  <Link to="/register">Create An Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Info Section */}
      <div className="bg-background">
        <div className="container py-12 px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bell className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium">Important Announcements</h3>
                  <p className="text-muted-foreground">
                    Stay informed about critical community updates and important notices.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium">Join the Discussion</h3>
                  <p className="text-muted-foreground">
                    Engage with the community by commenting on posts and sharing your thoughts.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Filter className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium">Browse Categories</h3>
                  <p className="text-muted-foreground">
                    Find information relevant to your interests by exploring our organized categories.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
