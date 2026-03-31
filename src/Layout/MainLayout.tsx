import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../Context/ThemeContext';
import { cn } from '../Utils/cn';

const MainLayout: React.FC = () => {
  const { sideMenu, isSidebarOpen, setSidebarOpen } = useTheme();

  const getSidebarWidth = () => {
    if (sideMenu === 'closed' || sideMenu === 'icontext') return 'lg:pl-20';
    return 'lg:pl-64';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn('flex flex-col min-h-screen transition-all duration-300', getSidebarWidth())}>
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full overflow-hidden">
          <React.Suspense fallback={
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-pulse"></div>
                <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-4 border-primary-500 animate-spin"></div>
              </div>
              <p className="text-slate-400 font-black animate-pulse uppercase tracking-[0.2em] text-[10px]">Synchronizing Matrix...</p>
            </div>
          }>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Outlet />
            </div>
          </React.Suspense>
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
