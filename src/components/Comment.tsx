
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts, Comment as CommentType } from '@/contexts/PostsContext';
import { formatDistanceToNow } from 'date-fns';
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

type CommentProps = {
  comment: CommentType;
};

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { user, isAdmin } = useAuth();
  const { deleteComment } = usePosts();
  
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const canDelete = isAdmin || (user && user.id === comment.authorId);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex gap-4 py-4 animate-in slide-in-bottom">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{comment.authorName}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete comment</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this comment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteComment(comment.postId, comment.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <div className="mt-2">
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
