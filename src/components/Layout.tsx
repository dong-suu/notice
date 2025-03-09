
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Bell, Menu, Search, User } from 'lucide-react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 pt-4">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  
                  {isAdmin && (
                    <NavLink 
                      to="/admin" 
                      className={({ isActive }) => 
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                        }`
                      }
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                  
                  <NavLink 
                    to="/categories" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                      }`
                    }
                  >
                    Categories
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
            
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight"> <span className='text-primary'>AIMCA</span> Notice Board</span>
            </NavLink>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex md:gap-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  }`
                }
              >
                Home
              </NavLink>
              
              {isAdmin && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                    }`
                  }
                >
                  Admin Dashboard
                </NavLink>
              )}
              
              <NavLink 
                to="/categories" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  }`
                }
              >
                Categories
              </NavLink>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search..." 
                  className="w-[200px] lg:w-[300px] pl-8"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </form>
            
            {/* Notifications (not implemented yet) */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="cursor-pointer">
                      Profile
                    </NavLink>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/admin" className="cursor-pointer">
                        Admin Dashboard
                      </NavLink>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer" 
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <NavLink to="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </NavLink>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AIMCA Notice Board System. designed and created by <span className='text-primary'>Faiz Sayed</span>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
