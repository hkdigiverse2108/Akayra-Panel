import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, FolderTree } from 'lucide-react';
import { useManagementData } from '../Utils/Hooks/useManagementData';
import TableToolbar from '../Components/TableToolbar';
import TableFooter from '../Components/TableFooter';
import ConfirmModal from '../Components/ConfirmModal';
import { getSrNo } from '../Utils/tableUtils';
import { cn } from '../Utils/cn';
import { Tooltip } from 'antd';
import { KEYS, URL_KEYS, ROUTES } from '../Constants';

const FAQCategoryManagement: React.FC = () => {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState<'grid' | 'list'>('list');

    const {
        items: categories,
        loading,
        total,
        currentPage,
        pageSize,
        searchTerm,
        activeFilter,
        setSearchTerm,
        setCurrentPage,
        setPageSize,
        setActiveFilter,
        handleDeleteClick,
        confirmDelete,
        handleToggleStatus,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isActionLoading,
        toggleSort,
        getSortIcon
    } = useManagementData({
        resourceKey: KEYS.FAQ_CATEGORY.ALL,
        resourceUrl: URL_KEYS.FAQ_CATEGORY.ALL,
        idField: 'faqCategoryId',
        dataKey: 'faq_category_data',
    });

    return (
        <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="text-left px-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">FAQ Categories</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Organize help content and common questions into logical sections.</p>
                </div>
                <Button onClick={() => navigate(`${ROUTES.FAQ_CATEGORIES}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto">
                    <Plus size={20} /> Add Category
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search faq categories..."
                    activeFilter={activeFilter}
                    onActiveFilterChange={setActiveFilter}
                    showViewToggle
                    viewType={viewType}
                    onViewTypeChange={setViewType}
                />

                {viewType === 'list' ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[400px] md:min-w-full">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">Sr. No.</th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('name')}>
                                            Category Name
                                            <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                                {getSortIcon('name')}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                                {loading && categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading categories...</td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No categories found.</td>
                                    </tr>
                                ) : (
                                    categories.map((category: any, index: number) => (
                                        <tr key={category._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                            <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">
                                                {getSrNo(currentPage, pageSize, index)}
                                            </td>
                                            <td className="px-4 sm:px-8 py-5">
                                                <div className="flex items-center gap-3 sm:gap-4 text-left">
                                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-gray-100 dark:border-slate-700 font-black text-xs text-slate-400 shadow-sm transition-transform group-hover:scale-110 shrink-0">
                                                        <FolderTree size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize truncate max-w-[150px] sm:max-w-xs">{category.name}</p>
                                                </div>
                                            </td>
                                             <td className="px-4 sm:px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                                                    <Tooltip title={category.isActive ? "Deactivate" : "Activate"}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(category)} 
                                                            disabled={isActionLoading}
                                                            className={cn(
                                                                "p-2 rounded-xl transition-all shadow-sm",
                                                                category.isActive 
                                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {category.isActive ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button 
                                                            onClick={() => navigate(`${ROUTES.FAQ_CATEGORIES}/edit/${category._id}`)} 
                                                            className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Edit size={18} className="sm:w-5 sm:h-5" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <button 
                                                            onClick={() => handleDeleteClick(category._id)} 
                                                            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Trash2 size={18} className="sm:w-5 sm:h-5" />
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-4 sm:p-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {loading && categories.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading categories...</div>
                        ) : categories.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No categories found.</div>
                        ) : (
                            categories.map((category: any) => (
                                <div key={category._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-[32px] border border-gray-100 dark:border-slate-800 p-8 flex flex-col items-center text-center transition-all hover:border-primary-500/30 shadow-sm hover:shadow-md h-full">
                                    <div className="h-16 w-16 mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-primary-500 shadow-sm transition-transform group-hover:scale-110">
                                        <FolderTree size={24} />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize tracking-tighter mb-6">{category.name}</h3>
                                    
                                    <div className="mt-auto flex items-center gap-2">
                                        <button 
                                            onClick={() => handleToggleStatus(category)} 
                                            disabled={isActionLoading}
                                            className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                                                category.isActive ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/10" : "bg-white dark:bg-slate-900 text-slate-300"
                                            )}
                                        >
                                            {category.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        </button>
                                        <button onClick={() => navigate(`${ROUTES.FAQ_CATEGORIES}/edit/${category._id}`)} className="h-10 w-10 bg-white dark:bg-slate-900 text-primary-600 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-primary-600 hover:text-white transition-all"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteClick(category._id)} className="h-10 w-10 bg-white dark:bg-slate-900 text-red-600 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <TableFooter
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    resourceName="categories"
                />
            </Card>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={isActionLoading}
                message="Are you sure you want to delete this category? This action cannot be undone."
            />
        </div>
    );
};

export default FAQCategoryManagement;
