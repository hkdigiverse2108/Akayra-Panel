import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

const MainLayout: React.FC = () => {
  const { sideMenu, isSidebarOpen, setSidebarOpen } = useTheme();

  const getSidebarWidth = () => {
    if (sideMenu === 'closed' || sideMenu === 'icontext') return 'lg:pl-20';
    return 'lg:pl-64';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn('flex flex-col min-h-screen transition-all duration-300', getSidebarWidth())}>
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full overflow-hidden">
          <Outlet />
        </main>
        <footer className="py-6 px-8 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Akayra Admin Panel. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
