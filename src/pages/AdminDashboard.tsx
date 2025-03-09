
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, PlusCircle, Trash } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { posts, deletePost } = usePosts();
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

  // Mock users data (in a real app, this would come from an API)
  const users = [
    { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
    { id: "2", name: "Regular User", email: "user@example.com", role: "user" },
    // Additional mock users
    { id: "3", name: "John Doe", email: "john@example.com", role: "user" },
    { id: "4", name: "Jane Smith", email: "jane@example.com", role: "user" },
  ];

  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage posts and users</p>
        </div>
        
        <div className="grid gap-8">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{posts.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {posts.reduce((total, post) => total + post.comments.length, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for Posts and Users */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            {/* Posts Tab */}
            <TabsContent value="posts" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Posts Management</CardTitle>
                      <CardDescription>Manage all posts on the notice board</CardDescription>
                    </div>
                    <Button asChild>
                      <Link to="/create-post">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Posted</TableHead>
                          <TableHead>Comments</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.length > 0 ? (
                          posts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{post.category}</Badge>
                              </TableCell>
                              <TableCell>{post.authorName}</TableCell>
                              <TableCell>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                              </TableCell>
                              <TableCell>{post.comments.length}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link to={`/post/${post.id}`}>
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Link>
                                  </Button>
                                  
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
                                          This action cannot be undone. This will permanently delete the post and all its comments.
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
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No posts found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  Change Role
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
