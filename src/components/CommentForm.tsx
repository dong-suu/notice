
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';

type CommentFormProps = {
  postId: string;
};

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const { user } = useAuth();
  const { addComment } = usePosts();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addComment({
        postId,
        content: content.trim()
      });
      setContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 border rounded-md text-center text-muted-foreground">
        Please log in to add a comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none min-h-[80px]"
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
