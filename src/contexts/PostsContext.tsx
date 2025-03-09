
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';

// Types
export type Post = {
  id: string;
  title: string;
  description: string;
  category: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  likes: string[]; // Array of user IDs who liked the post
};

export type Comment = {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

export type PostInput = {
  title: string;
  description: string;
  category: string;
};

export type CommentInput = {
  postId: string;
  content: string;
};

type PostsContextType = {
  posts: Post[];
  loading: boolean;
  createPost: (postData: PostInput) => Promise<void>;
  updatePost: (id: string, postData: PostInput) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostById: (id: string) => Post | undefined;
  addComment: (commentData: CommentInput) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  searchPosts: (query: string) => Post[];
  categories: string[];
};

// Initial mock data
const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    title: "Welcome to the Online Notice Board",
    description: "This is the official announcement board for our organization. Here you'll find important updates, announcements, and information.",
    category: "Announcements",
    authorId: "1",
    authorName: "Admin User",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: "1",
        postId: "1",
        content: "Great to have this platform for communication!",
        authorId: "2",
        authorName: "Regular User",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    likes: ["2"]
  },
  {
    id: "2",
    title: "Upcoming System Maintenance",
    description: "The system will be down for maintenance this weekend from Saturday 10PM to Sunday 2AM. Please plan accordingly.",
    category: "Maintenance",
    authorId: "1",
    authorName: "Admin User",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
    likes: []
  },
  {
    id: "3",
    title: "Annual Company Picnic",
    description: "Join us for the annual company picnic on July 15th at Central Park. Food, games, and activities will be provided for all employees and their families.",
    category: "Events",
    authorId: "1",
    authorName: "Admin User",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: "2",
        postId: "3",
        content: "Looking forward to it! Will there be vegetarian options?",
        authorId: "2",
        authorName: "Regular User",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      }
    ],
    likes: ["2"]
  }
];

// Available categories
const CATEGORIES = [
  "Announcements", 
  "Events", 
  "Maintenance", 
  "News", 
  "Policies", 
  "General"
];

// Create context
const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Context provider component
export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = CATEGORIES;

  // Load initial posts
  useEffect(() => {
    const loadPosts = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we have posts in localStorage
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      } else {
        setPosts(INITIAL_POSTS);
        localStorage.setItem('posts', JSON.stringify(INITIAL_POSTS));
      }
      
      setLoading(false);
    };
    
    loadPosts();
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts, loading]);

  // Get a post by ID
  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
  };

  // Create a new post
  const createPost = async (postData: PostInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPost: Post = {
        id: `${Date.now()}`,
        ...postData,
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        likes: []
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update an existing post
  const updatePost = async (id: string, postData: PostInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a post",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id
          ? { 
              ...post, 
              ...postData, 
              updatedAt: new Date().toISOString() 
            }
          : post
      ));
      
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a post
  const deletePost = async (id: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a post",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a comment to a post
  const addComment = async (commentData: CommentInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to comment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        ...commentData,
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString(),
      };
      
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === commentData.postId
          ? { 
              ...post, 
              comments: [...post.comments, newComment] 
            }
          : post
      ));
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const deleteComment = async (postId: string, commentId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a comment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId
          ? { 
              ...post, 
              comments: post.comments.filter(comment => comment.id !== commentId) 
            }
          : post
      ));
      
      toast({
        title: "Comment deleted",
        description: "The comment has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle like on a post
  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to like posts",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(user.id);
          
          return { 
            ...post, 
            likes: hasLiked
              ? post.likes.filter(id => id !== user.id)
              : [...post.likes, user.id]
          };
        }
        return post;
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search posts by title, description, or category
  const searchPosts = (query: string) => {
    if (!query) return posts;
    
    const lowerCaseQuery = query.toLowerCase();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      post.description.toLowerCase().includes(lowerCaseQuery) ||
      post.category.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <PostsContext.Provider 
      value={{ 
        posts, 
        loading, 
        createPost, 
        updatePost, 
        deletePost, 
        getPostById, 
        addComment, 
        deleteComment, 
        toggleLike, 
        searchPosts,
        categories
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

// Custom hook to use the posts context
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
