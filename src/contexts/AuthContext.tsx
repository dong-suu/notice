
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "@/hooks/use-toast";

// Types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

// Mock data for users (In a real app, this would come from an API/database)
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin" as const
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "user123", // In a real app, this would be hashed
    role: "user" as const
  }
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching credentials (mock authentication)
      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Create user object without the password
        const { password, ...userWithoutPassword } = foundUser;
        
        // Save to state and localStorage
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${userWithoutPassword.name}!`,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      // In a real app, we would make an API call to create the user
      // For this demo, we'll just create a new user object
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role: 'user' as const
      };
      
      // Add to mock users (in a real app, this would be saved to a database)
      MOCK_USERS.push({ ...newUser, password });
      
      // Save to state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Check if the current user is an admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
