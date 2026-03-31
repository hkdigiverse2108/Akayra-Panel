import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Layers } from 'lucide-react';
import { useManagementData } from '../hooks/useManagementData';
import TableToolbar from '../components/TableToolbar';
import TableFooter from '../components/TableFooter';
import ConfirmModal from '../components/ConfirmModal';
import { getSrNo } from '../utils/tableUtils';
import { cn } from '../utils/cn';
import { Image, Tooltip } from 'antd';

const CategoryManagement: React.FC = () => {
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
        // New hook functions
        handleDeleteClick,
        confirmDelete,
        handleToggleStatus,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isActionLoading,
        toggleSort,
        getSortIcon
    } = useManagementData({
        apiMethod: categoryAPI.getAll,
        deleteMethod: categoryAPI.delete,
        toggleMethod: categoryAPI.edit,
        idField: 'categoryId',
        dataKey: 'category_data',
        resourceName: 'Category'
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Category Catalog</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Organize your products into nested hierarchies.</p>
                </div>
                <Button onClick={() => navigate('/categories/add')} className="h-12 px-6 rounded-2xl flex items-center gap-2">
                    <Plus size={20} /> Add New Category
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search categories..."
                    activeFilter={activeFilter}
                    onActiveFilterChange={setActiveFilter}
                    showViewToggle
                    viewType={viewType}
                    onViewTypeChange={setViewType}
                />

                {viewType === 'list' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16">Sr. No.</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('name')}>
                                            Category Name
                                            <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                                {getSortIcon('name')}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading categories...</td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No categories found.</td>
                                    </tr>
                                ) : (
                                    categories.map((category, index) => (
                                        <tr key={category._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                            <td className="px-8 py-5 font-black text-slate-400 text-sm">
                                                {getSrNo(currentPage, pageSize, index)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-110">
                                                        {category.image ? (
                                                            <Image src={category.image} alt={category.name} className="h-full w-full object-contain p-1" preview={false} />
                                                        ) : (
                                                            <Layers className="text-slate-300" size={24} />
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize">{category.name}</p>
                                                </div>
                                            </td>
                                             <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Tooltip title={category.isActive ? "Deactivate" : "Activate"}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(category)} 
                                                            className={cn(
                                                                "p-2 rounded-xl transition-all shadow-sm",
                                                                category.isActive 
                                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {category.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button 
                                                            onClick={() => navigate(`/categories/edit/${category._id}`)} 
                                                            className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <button 
                                                            onClick={() => handleDeleteClick(category._id)} 
                                                            className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Trash2 size={20} />
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
                    <div className="p-6 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading categories...</div>
                        ) : categories.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No categories found.</div>
                        ) : (
                            categories.map((category) => (
                                <div key={category._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col items-center p-6 text-center shadow-sm">
                                    <div className="h-20 w-20 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm mb-4 transition-transform group-hover:scale-110 border border-gray-50 dark:border-slate-700">
                                        {category.image ? (
                                            <Image src={category.image} alt={category.name} preview={false} className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <Layers className="text-slate-200" size={32} />
                                        )}
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize tracking-tight mb-4">{category.name}</h3>
                                    
                                     <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleToggleStatus(category)} 
                                            className={cn(
                                                "p-2 rounded-xl transition-all shadow-sm",
                                                category.isActive 
                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                            )}
                                        >
                                            {category.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        </button>
                                        <button onClick={() => navigate(`/categories/edit/${category._id}`)} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"><Edit size={20} /></button>
                                        <button onClick={() => handleDeleteClick(category._id)} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm"><Trash2 size={20} /></button>
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

export default CategoryManagement;
