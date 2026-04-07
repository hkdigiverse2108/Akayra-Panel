import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Search, Settings, Menu, ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import Switcher from "../Components/Switcher";
import { ROUTES } from "../Constants";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../Components/ConfirmModal";
import Avatar from "../Components/Avatar";
import { Queries } from "../Api/Queries";
import { STORAGE_KEYS } from "../Constants/StorageKeys";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { mode, toggleMode, toggleSidebarMobile, layout } = useTheme();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
  const userId = storedUser ? JSON.parse(storedUser)?._id : undefined;
  const { data: userData } = Queries.useGetSingleUser(userId);

  const profileUser = useMemo(() => {
    if (userData?.data) return userData.data;
    return user || {};
  }, [userData, user]);

  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!profileRef.current) return;
      if (profileRef.current.contains(event.target as Node)) return;
      setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isProfileOpen]);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebarMobile} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg lg:hidden">
          <Menu className="text-gray-600 dark:text-slate-400" size={20} />
        </button>

        {/* Logo for Horizontal Layout */}
        {layout === "horizontal" && (
          <div className="flex items-center gap-3 mr-4 cursor-pointer hidden lg:flex" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold shrink-0">A</div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">Akayra Panel</span>
          </div>
        )}

        <div className="relative max-w-md w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </span>
          <input type="text" className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 text-gray-900 dark:text-slate-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all" placeholder="Search dashboard..." />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={toggleMode} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 transition-colors" title="Toggle Dark Mode">
          {mode === "light" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="18.36" x2="5.64" y2="16.94"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        <button onClick={() => setIsSwitcherOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 transition-colors" title="Open Switcher">
          <Settings size={20} />
        </button>

        <button className="hidden xs:flex p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>

        <div className="relative pl-2 border-l border-gray-200 dark:border-slate-800" ref={profileRef}>
          <button onClick={() => setIsProfileOpen((prev) => !prev)} className="relative flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 px-3 py-2 shadow-sm shadow-gray-200/40 dark:shadow-slate-950/40 backdrop-blur" aria-expanded={isProfileOpen} aria-haspopup="menu">
            <Avatar firstName={profileUser?.firstName} lastName={profileUser?.lastName} name={profileUser?.name || profileUser?.email} imageUrl={profileUser?.image} className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700" textClassName="text-base text-gray-700 dark:text-slate-200" />
            <div className="relative hidden text-left md:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none capitalize">
                {profileUser?.firstName || profileUser?.name || "Admin"} {profileUser?.lastName || ""}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-tight">{profileUser?.role || "Administrator"}</p>
            </div>
            <div className="relative flex items-center gap-2"></div>
          </button>

          <div className={`absolute right-0 top-full mt-3 w-72 rounded-3xl border border-gray-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-gray-200/50 dark:shadow-slate-950/70 transition-all ${isProfileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`} role="menu">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="relative px-4 pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar firstName={profileUser?.firstName} lastName={profileUser?.lastName} name={profileUser?.name || profileUser?.email} imageUrl={profileUser?.image} className="h-11 w-11 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-gray-200/70 dark:border-slate-700/70 shrink-0" textClassName="text-base text-gray-700 dark:text-slate-200" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {profileUser?.firstName || profileUser?.name || "Admin"} {profileUser?.lastName || ""}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{profileUser?.email || "admin@akayra.com"}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">{profileUser?.role || "Administrator"}</span>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">Active</span>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200/80 dark:bg-slate-700/80" />
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-gray-700 dark:text-slate-200" type="button" onClick={() => navigate(ROUTES.PROFILE)}>
                  <span className="h-10 w-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300 flex items-center justify-center">
                    <UserCircle2 size={18} />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Visit Profile</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">View your personal page</p>
                  </div>
                </button>
                <button className="mt-2 w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-red-600 dark:text-red-400" type="button" onClick={() => setIsLogoutOpen(true)}>
                  <span className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center">
                    <LogOut size={18} />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Logout</p>
                    <p className="text-xs text-red-500/80 dark:text-red-300/80">Sign out of the dashboard</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Switcher isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} />
      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          setIsProfileOpen(false);
          logout();
        }}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="warning"
        icon={<LogOut size={28} />}
      />
    </header>
  );
};

export default Header;
