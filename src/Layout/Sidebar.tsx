import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ChevronRight, Package, Tag, Layers, MessageSquare, Image, HelpCircle, FileText, Info, LogOut, ChevronDown, TrendingUp, ShieldCheck, Settings, Ruler, Palette, ListTree, Mail, Instagram, Ticket, Send } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { cn } from "../Utils/cn";
import ConfirmModal from "../Components/ConfirmModal";

import { menuItems, MenuItem, SubMenuItem } from "./MenuItems";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { sideMenu, isSidebarOpen, setSidebarOpen } = useTheme();
  const location = useLocation();
  const isCollapsed = sideMenu === "closed" || sideMenu === "icontext";
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Auto-expand submenu if a child is active
  useEffect(() => {
    const activeSubmenu = menuItems.find((item) => item.subItems?.some((sub) => location.pathname.startsWith(sub.path)));
    if (activeSubmenu) {
      setOpenSubmenu(activeSubmenu.label);
    }
  }, [location.pathname]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <aside className={cn("fixed top-0 left-0 h-full bg-slate-900 text-slate-300 z-50 transition-all duration-300 border-r border-slate-800 flex flex-col", isCollapsed ? "w-20" : "w-64", isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        {/* Sidebar Header/Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold shrink-0">A</div>
            {!isCollapsed && <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">Akayra Panel</span>}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openSubmenu === item.label;
              const isParentActive = hasSubItems && item.subItems!.some((sub) => location.pathname.startsWith(sub.path));

              if (hasSubItems) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button onClick={() => toggleSubmenu(item.label)} className={cn("flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all group outline-none", isParentActive && !isOpen ? "bg-primary-500/10 text-primary-400" : "hover:bg-slate-800 text-slate-400 hover:text-white")}>
                      <span className={cn("shrink-0", isParentActive ? "text-primary-400" : "")}>{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                          <div className="transition-transform duration-200" style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}>
                            <ChevronDown size={14} className="opacity-50" />
                          </div>
                        </>
                      )}
                    </button>

                    {isOpen && !isCollapsed && (
                      <div className="ml-4 pl-4 border-l border-slate-800 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {item.subItems!.map((sub) => (
                          <NavLink key={sub.path} to={sub.path} className={({ isActive }) => cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group", isActive ? "bg-primary-500/10 text-primary-400 font-bold" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50")}>
                            <span className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">{sub.icon}</span>
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink key={item.path} to={item.path!} className={({ isActive }) => cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group", isActive ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "hover:bg-slate-800 text-slate-400 hover:text-white")}>
                  {({ isActive }) => (
                    <>
                      <span className="shrink-0">{item.icon}</span>
                      {!isCollapsed && <span className="text-sm font-medium flex-1">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button onClick={() => setIsLogoutOpen(true)} className={cn("flex items-center justify-center gap-3 w-full py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group overflow-hidden", isCollapsed ? "px-0" : "px-4")}>
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          logout();
        }}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="warning"
        icon={<LogOut size={28} />}
      />
    </>
  );
};

export default Sidebar;
