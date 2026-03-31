import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, User } from 'lucide-react';
import { useManagementData } from '../hooks/useManagementData';
import TableToolbar from '../components/TableToolbar';
import TableFooter from '../components/TableFooter';
import ConfirmModal from '../components/ConfirmModal';
import { getSrNo } from '../utils/tableUtils';
import { cn } from '../utils/cn';
import { Rate, Avatar, Tooltip } from 'antd';

const ReviewManagement: React.FC = () => {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState<'grid' | 'list'>('list');

    const {
        items: reviews,
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
        apiMethod: reviewAPI.getAll,
        deleteMethod: reviewAPI.delete,
        toggleMethod: reviewAPI.edit,
        idField: 'reviewId',
        dataKey: 'review_data',
        resourceName: 'Review'
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Review Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Moderate user experience feedback and ratings.</p>
                </div>
                <Button onClick={() => navigate('/reviews/add')} className="h-12 px-6 rounded-2xl flex items-center gap-2">
                    <Plus size={20} /> Add Placeholder Review
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search reviews..."
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
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16">Sr. No.</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('name')}>
                                            User
                                            <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                                {getSortIcon('name')}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Product</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Rating</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading reviews...</td>
                                    </tr>
                                ) : reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No reviews found.</td>
                                    </tr>
                                ) : (
                                    reviews.map((review, index) => (
                                        <tr key={review._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                            <td className="px-6 py-5 font-black text-slate-400 text-sm">
                                                {getSrNo(currentPage, pageSize, index)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar icon={<User size={14} />} className="bg-primary-50 dark:bg-primary-900/30 text-primary-600" />
                                                    <p className="text-sm font-black text-slate-900 dark:text-white capitalize">{review.userId?.fullName || 'Anonymous'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">{review.productId?.title || 'Unknown Product'}</td>
                                            <td className="px-6 py-4"><Rate disabled defaultValue={review.rating} className="text-yellow-500 scale-75 origin-left" /></td>
                                             <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Tooltip title={review.isActive ? "Deactivate" : "Activate"}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(review)} 
                                                            className={cn(
                                                                "p-2 rounded-xl transition-all shadow-sm",
                                                                review.isActive 
                                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {review.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button 
                                                            onClick={() => navigate(`/reviews/edit/${review._id}`)} 
                                                            className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <button 
                                                            onClick={() => handleDeleteClick(review._id)} 
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
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading reviews...</div>
                        ) : reviews.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No reviews found.</div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-[32px] border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-6 shadow-sm h-full">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar size={48} icon={<User size={24} />} className="bg-white dark:bg-slate-900 text-primary-600 shadow-sm ring-4 ring-primary-500/5 text-xs text-xs font-black uppercase tracking-widest text-[10px]" />
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize leading-tight">{review.userId?.fullName || 'Anonymous'}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">{review.productId?.title || 'Verified Order'}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleStatus(review)} 
                                            className={cn(
                                                "p-2 rounded-xl transition-all shadow-sm",
                                                review.isActive 
                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                            )}
                                        >
                                            {review.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        </button>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-slate-700/50 flex flex-col flex-1">
                                        <div className="flex items-center gap-1 mb-3">
                                            <Rate disabled defaultValue={review.rating} className="text-yellow-500 scale-75 origin-left" />
                                            <span className="text-xs font-black text-slate-300 ml-1">/ 5.0</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed italic flex-1">
                                            "{review.comment || 'No textual feedback provided.'}"
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-2">
                                        <button onClick={() => navigate(`/reviews/edit/${review._id}`)} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-900 text-primary-600 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-primary-600 hover:text-white transition-all"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteClick(review._id)} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-900 text-red-600 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
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
                    resourceName="reviews"
                />
            </Card>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={isActionLoading}
                message="Are you sure you want to delete this review? This action cannot be undone."
            />
        </div>
    );
};

export default ReviewManagement;
