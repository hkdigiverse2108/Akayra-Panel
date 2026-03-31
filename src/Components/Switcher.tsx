import React from 'react';
import { X, Sun, Moon, Layout as LayoutIcon, Menu, Type, Maximize } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';
import { cn } from '../Utils/cn';

interface SwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

const Switcher: React.FC<SwitcherProps> = ({ isOpen, onClose }) => {
  const { mode, layout, sideMenu, setMode, setLayout, setSideMenu } = useTheme();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 z-[70] shadow-2xl transition-transform duration-300 transform border-l border-gray-200 dark:border-gray-700 overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Switcher</h5>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <Sun size={16} /> Theme Color Mode
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('light')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                  mode === 'light'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                    : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                )}
              >
                <Sun size={18} />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setMode('dark')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                  mode === 'dark'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                    : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                )}
              >
                <Moon size={18} />
                <span className="text-sm font-medium">Dark</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <LayoutIcon size={16} /> Navigation Layout
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setLayout('vertical')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                  layout === 'vertical'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                    : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                )}
              >
                <span className="text-sm font-medium">Vertical</span>
              </button>
              <button
                onClick={() => setLayout('horizontal')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                  layout === 'horizontal'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                    : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                )}
              >
                <span className="text-sm font-medium">Horizontal</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <Menu size={16} /> Sidemenu Layout
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'default', label: 'Default', icon: <Menu size={16} /> },
                { id: 'closed', label: 'Closed', icon: <X size={16} /> },
                { id: 'icontext', label: 'Icon Text', icon: <Type size={16} /> },
                { id: 'detached', label: 'Detached', icon: <Maximize size={16} /> },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSideMenu(style.id as any)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    sideMenu === style.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                      : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-200'
                  )}
                >
                  {style.icon}
                  <span className="text-xs font-medium">{style.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-2">
          <button
            onClick={() => {
                setMode('light');
                setLayout('vertical');
                setSideMenu('default');
            }}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default Switcher;
