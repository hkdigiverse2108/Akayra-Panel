import React from 'react';
import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Switch, Tooltip } from 'antd';
import { cn } from '../Utils/cn';

interface TableToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    
    // Status Filter (Active/Inactive)
    showActiveFilter?: boolean;
    activeFilter?: boolean;
    onActiveFilterChange?: (value: boolean) => void;
    
    // View Type (Grid/List)
    showViewToggle?: boolean;
    viewType?: 'grid' | 'list';
    onViewTypeChange?: (view: 'grid' | 'list') => void;
    
    // Extra actions (optional)
    extraActions?: React.ReactNode;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
    searchTerm,
    onSearchChange,
    placeholder = "Search...",
    showActiveFilter = true,
    activeFilter = true,
    onActiveFilterChange,
    showViewToggle = false,
    viewType = 'list',
    onViewTypeChange,
    extraActions
}) => {
    return (
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col items-stretch lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 bg-gray-50/50 dark:bg-slate-800/20">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 flex-1">
                {/* Search Bar */}
                <div className="relative w-full lg:w-96">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-slate-400" size={18} />
                    </span>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl leading-5 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all shadow-sm font-medium"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Status Filter (Toggle Switch) */}
                {showActiveFilter && onActiveFilterChange && (
                    <div className="flex items-center justify-between sm:justify-start gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {activeFilter ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                            checked={activeFilter}
                            onChange={onActiveFilterChange}
                            className={activeFilter ? 'bg-primary-500' : 'bg-slate-300'}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4">
                {/* View type toggle */}
                {showViewToggle && onViewTypeChange && (
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                         <Tooltip title="Grid View">
                            <button
                                onClick={() => onViewTypeChange('grid')}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    viewType === 'grid' ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </Tooltip>
                        <Tooltip title="List View">
                            <button
                                onClick={() => onViewTypeChange('list')}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    viewType === 'list' ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <List size={18} />
                            </button>
                        </Tooltip>
                    </div>
                )}
                
                {extraActions}
            </div>
        </div>
    );
};

export default TableToolbar;
