import React, { useState } from 'react';
import { Bell, Search, Settings, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Switcher from '../components/Switcher';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { mode, toggleMode, toggleSidebarMobile } = useTheme();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebarMobile}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
        >
          <Menu className="text-gray-600 dark:text-slate-400" size={20} />
        </button>
        
        <div className="relative max-w-md w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 text-gray-900 dark:text-slate-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all"
            placeholder="Search dashboard..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 transition-colors"
          title="Toggle Dark Mode"
        >
          {mode === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="18.36" x2="5.64" y2="16.94"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          )}
        </button>

        <button
          onClick={() => setIsSwitcherOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 transition-colors"
          title="Open Switcher"
        >
          <Settings size={20} />
        </button>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-slate-800">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none capitalize">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-tight">
              {user?.role || 'Administrator'}
            </p>
          </div>
          <button className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-all hover:ring-2 hover:ring-primary-500/20">
            {user?.image ? (
              <img src={user.image} alt="User avatar" className="h-full w-full object-cover" />
            ) : (
              <User size={20} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <Switcher isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
    </header>
  );
};

export default Header;
