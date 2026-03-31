import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import { cn } from '../Utils/cn';

const Layout: React.FC = () => {
  const { sideMenu } = useTheme();
  const isCollapsed = sideMenu === 'closed' || sideMenu === 'icontext';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <div 
        className={cn(
          "transition-all duration-300 min-h-screen flex flex-col",
          isCollapsed ? "pl-20" : "pl-64"
        )}
      >
        <Header />
        <main className="flex-1 p-4 lg:p-8 mt-16 max-w-[1600px] mx-auto w-full">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
