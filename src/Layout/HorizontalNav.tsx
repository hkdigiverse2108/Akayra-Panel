import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { menuItems } from "./MenuItems";
import { cn } from "../Utils/cn";

const HorizontalNav: React.FC = () => {
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1 px-6 h-12 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
      {menuItems.map((item) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isParentActive = hasSubItems && item.subItems!.some((sub) => location.pathname.startsWith(sub.path));
        const isActive = item.path ? location.pathname === item.path : isParentActive;

        if (hasSubItems) {
          return (
            <div key={item.label} className="relative group h-full" onMouseEnter={() => setActiveSubmenu(item.label)} onMouseLeave={() => setActiveSubmenu(null)}>
              <button className={cn("flex items-center gap-2 px-4 h-full text-sm font-medium transition-all group outline-none border-b-2 border-transparent", isParentActive ? "text-primary-500 border-primary-500 bg-primary-50/50 dark:bg-primary-500/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}>
                <span className={cn("shrink-0", isParentActive ? "text-primary-500" : "opacity-70")}>{item.icon}</span>
                <span>{item.label}</span>
                <ChevronDown size={14} className={cn("transition-transform duration-200 opacity-50", activeSubmenu === item.label && "rotate-180")} />
              </button>

              <div className={cn("absolute top-full left-0 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-xl py-2 z-[60] transition-all duration-200 origin-top", activeSubmenu === item.label ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none")}>
                {item.subItems!.map((sub) => (
                  <NavLink key={sub.path} to={sub.path} className={({ isActive }) => cn("flex items-center gap-3 px-4 py-2.5 text-sm transition-all grow group", isActive ? "bg-primary-500/10 text-primary-500 font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50")}>
                    <span className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">{sub.icon}</span>
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        }

        return (
          <NavLink key={item.path} to={item.path!} className={({ isActive }) => cn("flex items-center gap-2 px-4 h-full text-sm font-medium transition-all border-b-2 border-transparent", isActive ? "text-primary-500 border-primary-500 bg-primary-50/50 dark:bg-primary-500/5" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}>
            <span className={cn("shrink-0", location.pathname === item.path ? "text-primary-500" : "opacity-70")}>{item.icon}</span>
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default HorizontalNav;
