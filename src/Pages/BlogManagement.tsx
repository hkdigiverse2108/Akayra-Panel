import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Newspaper } from 'lucide-react';
import { useManagementData } from '../Utils/Hooks/useManagementData';
import TableToolbar from '../Components/TableToolbar';
import TableFooter from '../Components/TableFooter';
import ConfirmModal from '../Components/ConfirmModal';
import { getSrNo } from '../Utils/tableUtils';
import { cn } from '../Utils/cn';
import { Image, Tooltip } from 'antd';
import { KEYS, URL_KEYS, ROUTES } from '../Constants';

const BlogManagement: React.FC = () => {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState<'grid' | 'list'>('list');

    const {
        items: blogs,
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
        resourceKey: KEYS.BLOG.ALL,
        resourceUrl: URL_KEYS.BLOG.ALL,
        idField: 'blogId',
        dataKey: 'blog_data',
    });

    return (
        <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="text-left px-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Blog Articles</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Manage your storefront's editorial content and news.</p>
                </div>
                <Button onClick={() => navigate(`${ROUTES.BLOGS}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto">
                    <Plus size={20} /> Add Article
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search articles..."
                    activeFilter={activeFilter}
                    onActiveFilterChange={setActiveFilter}
                    showViewToggle
                    viewType={viewType}
                    onViewTypeChange={setViewType}
                />

                {viewType === 'list' ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">Sr. No.</th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('title')}>
                                            Article Details
                                            <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                                {getSortIcon('title')}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                                {loading && blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading articles...</td>
                                    </tr>
                                ) : blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No articles found.</td>
                                    </tr>
                                ) : (
                                    blogs.map((blog: any, index: number) => (
                                        <tr key={blog._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                            <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">
                                                {getSrNo(currentPage, pageSize, index)}
                                            </td>
                                            <td className="px-4 sm:px-8 py-5">
                                                <div className="flex items-center gap-3 sm:gap-4 text-left">
                                                    <div className="h-10 w-16 sm:h-12 sm:w-20 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                                                        {blog.image ? (
                                                            <Image src={blog.image} alt={blog.title} className="h-full w-full object-cover" preview={false} />
                                                        ) : (
                                                            <Newspaper className="text-slate-300" size={20} />
                                                        )}
                                                    </div>
                                                    <div className="text-left overflow-hidden">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-1 truncate max-w-[150px] sm:max-w-xs">{blog.title}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                             <td className="px-4 sm:px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                                                    <Tooltip title={blog.isActive ? "Deactivate" : "Activate"}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(blog)} 
                                                            disabled={isActionLoading}
                                                            className={cn(
                                                                "p-2 rounded-xl transition-all shadow-sm",
                                                                blog.isActive 
                                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {blog.isActive ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button 
                                                            onClick={() => navigate(`${ROUTES.BLOGS}/edit/${blog._id}`)} 
                                                            className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Edit size={18} className="sm:w-5 sm:h-5" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <button 
                                                            onClick={() => handleDeleteClick(blog._id)} 
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
                    <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        {loading && blogs.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading articles...</div>
                        ) : blogs.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No articles found.</div>
                        ) : (
                            blogs.map((blog: any) => (
                                <div key={blog._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col h-full shadow-sm">
                                    <div className="aspect-[16/10] w-full bg-white dark:bg-slate-900 overflow-hidden border-b border-gray-50 dark:border-slate-800 relative">
                                        {blog.image ? (
                                            <Image src={blog.image} alt={blog.title} preview={false} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Newspaper className="text-slate-200" size={48} /></div>
                                        )}
                                        <div className="absolute top-4 right-4 flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <button onClick={() => navigate(`${ROUTES.BLOGS}/edit/${blog._id}`)} className="h-10 w-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-primary-600 rounded-xl shadow-xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteClick(blog._id)} className="h-10 w-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-red-600 rounded-xl shadow-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1 text-left">
                                        <div className="flex items-center justify-between mb-4 text-left">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                            <button 
                                                onClick={() => handleToggleStatus(blog)}
                                                disabled={isActionLoading}
                                                className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                                                    blog.isActive ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/10" : "bg-white dark:bg-slate-900 text-slate-300"
                                                )}
                                            >
                                                {blog.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                            </button>
                                        </div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white capitalize tracking-tight line-clamp-2 leading-tight text-left">{blog.title}</h3>
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
                    resourceName="articles"
                />
            </Card>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={isActionLoading}
                message="Are you sure you want to delete this blog article? This action cannot be undone."
            />
        </div>
    );
};

export default BlogManagement;
