
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Calendar, Edit, Trash } from 'lucide-react';
import { usePosts, Post } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from 'date-fns';

type PostCardProps = {
  post: Post;
  isDetailed?: boolean;
};

const PostCard: React.FC<PostCardProps> = ({ post, isDetailed = false }) => {
  const { user, isAdmin } = useAuth();
  const { toggleLike, deletePost } = usePosts();

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const hasLiked = user ? post.likes.includes(user.id) : false;
  const canManagePost = isAdmin || (user && post.authorId === user.id);
  
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-medium">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <Badge variant="outline" className="mb-2">{post.category}</Badge>
            <CardTitle className="text-xl font-bold leading-tight">
              {isDetailed ? post.title : (
                <Link to={`/post/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              )}
            </CardTitle>
          </div>
          
          {canManagePost && !isDetailed && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/edit-post/${post.id}`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this post and all its comments.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deletePost(post.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Posted by {post.authorName}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {formattedDate}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground">
          {isDetailed ? post.description : truncate(post.description, 150)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-3 border-t flex justify-between">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 ${hasLiked ? 'text-red-500' : ''}`}
            onClick={() => toggleLike(post.id)}
          >
            <Heart className="h-4 w-4" fill={hasLiked ? "currentColor" : "none"} /> 
            <span>{post.likes.length}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            asChild
          >
            <Link to={`/post/${post.id}`}>
              <MessageSquare className="h-4 w-4" /> 
              <span>{post.comments.length}</span>
            </Link>
          </Button>
        </div>
        
        {!isDetailed && (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/post/${post.id}`}>Read more</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
