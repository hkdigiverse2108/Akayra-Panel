import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type Layout = 'vertical' | 'horizontal';
type SideMenuStyles = 'default' | 'closed' | 'icontext' | 'detached';

interface ThemeContextType {
  mode: ThemeMode;
  layout: Layout;
  sideMenu: SideMenuStyles;
  setMode: (mode: ThemeMode) => void;
  setLayout: (layout: Layout) => void;
  setSideMenu: (style: SideMenuStyles) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarMobile: () => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(
    (localStorage.getItem('akayra_theme_mode') as ThemeMode) || 'light'
  );
  const [layout, setLayout] = useState<Layout>(
    (localStorage.getItem('akayra_layout') as Layout) || 'vertical'
  );
  const [sideMenu, setSideMenu] = useState<SideMenuStyles>(
    (localStorage.getItem('akayra_sidemenu') as SideMenuStyles) || 'default'
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('akayra_theme_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('akayra_layout', layout);
  }, [layout]);

  useEffect(() => {
    localStorage.setItem('akayra_sidemenu', sideMenu);
  }, [sideMenu]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const toggleSidebarMobile = () => setSidebarOpen((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        layout,
        sideMenu,
        setMode,
        setLayout,
        setSideMenu,
        isSidebarOpen,
        setSidebarOpen,
        toggleSidebarMobile,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
