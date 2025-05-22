import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Home,
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Heart
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Hero from '../ui/Hero';
import Testimonials from '../ui/Testimonials';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isHomePage = location.pathname === '/';

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: Home,
      roles: ['customer', 'vendor', 'admin']
    },
    {
      path: '/events',
      name: 'Events',
      icon: Calendar,
      roles: ['customer', 'vendor']
    },
    {
      path: '/vendors',
      name: 'Vendors',
      icon: Users,
      roles: ['customer']
    },
    {
      path: '/bookings',
      name: 'My Bookings',
      icon: Heart,
      roles: ['customer']
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: Users,
      roles: ['admin']
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: Settings,
      roles: ['customer', 'vendor', 'admin']
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo.svg" alt="ShaadiSetGo" className="h-8 transition-transform group-hover:scale-110" />
              <span className="font-heading font-bold text-xl hidden sm:inline-block group-hover:text-primary transition-colors">
                ShaadiSetGo
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-accent rounded-full relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2 group cursor-pointer">
              <img
                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName}`}
                alt={user?.fullName}
                className="h-8 w-8 rounded-full ring-2 ring-transparent group-hover:ring-primary transition-all"
              />
              <span className="hidden sm:inline-block font-medium group-hover:text-primary transition-colors">
                {user?.fullName}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="fixed left-0 z-40 h-[calc(100vh-4rem)] border-r bg-background"
            >
              <div className="flex h-full flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-semibold">Navigation</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-accent rounded-md lg:hidden transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 transition-all ${isSidebarOpen ? 'lg:ml-[280px]' : ''}`}>
          {isHomePage && (
            <>
              <Hero />
              <Testimonials />
            </>
          )}
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default MainLayout; 