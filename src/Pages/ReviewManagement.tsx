import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, User as UserIcon } from 'lucide-react';
import { useManagementData } from '../Utils/Hooks/useManagementData';
import TableToolbar from '../Components/TableToolbar';
import TableFooter from '../Components/TableFooter';
import ConfirmModal from '../Components/ConfirmModal';
import { getSrNo } from '../Utils/tableUtils';
import { cn } from '../Utils/cn';
import { Rate, Avatar, Tooltip } from 'antd';
import { KEYS, URL_KEYS, ROUTES } from '../Constants';

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
        handleDeleteClick,
        confirmDelete,
        handleToggleStatus,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isActionLoading,
        toggleSort,
        getSortIcon
    } = useManagementData({
        resourceKey: KEYS.REVIEW.ALL,
        resourceUrl: URL_KEYS.REVIEW.ALL,
        idField: 'reviewId',
        dataKey: 'review_data',
    });

    return (
        <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="text-left px-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Review Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Moderate user experience feedback and ratings.</p>
                </div>
                <Button onClick={() => navigate(`${ROUTES.REVIEWS}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto">
                    <Plus size={20} /> Add Review
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
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
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">Sr. No.</th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('personName')}>
                                            User
                                            <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                                {getSortIcon('personName')}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden md:table-cell">Product</th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden lg:table-cell">Date</th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden xs:table-cell">Rating</th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                                {loading && reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading reviews...</td>
                                    </tr>
                                ) : reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No reviews found.</td>
                                    </tr>
                                ) : (
                                    reviews.map((review: any, index: number) => (
                                        <tr key={review._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                            <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">
                                                {getSrNo(currentPage, pageSize, index)}
                                            </td>
                                            <td className="px-4 sm:px-8 py-5">
                                                <div className="flex items-center gap-3 text-left">
                                                    <Avatar icon={<UserIcon size={14} />} className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 shrink-0" />
                                                    <div className="text-left overflow-hidden">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white capitalize truncate max-w-[120px] sm:max-w-none leading-none mb-1">{review.personName || 'Anonymous'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{review.email || 'No email provided'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 md:hidden truncate max-w-[120px] mt-1">{review.productId?.title || 'Unknown Product'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-8 py-5 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter truncate max-w-[150px] hidden md:table-cell">{review.productId?.title || 'Unknown Product'}</td>
                                            <td className="px-4 sm:px-8 py-5 text-[10px] sm:text-xs font-black text-slate-900 dark:text-white hidden lg:table-cell italic">{review.date ? new Date(review.date).toLocaleDateString('en-GB') : 'N/A'}</td>
                                            <td className="px-4 sm:px-8 py-5 hidden xs:table-cell"><Rate disabled value={review.rating} className="text-yellow-500 scale-75 origin-left" /></td>
                                             <td className="px-4 sm:px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                                                    <Tooltip title={review.isActive ? "Deactivate" : "Activate"}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(review)} 
                                                            disabled={isActionLoading}
                                                            className={cn(
                                                                "p-2 rounded-xl transition-all shadow-sm",
                                                                review.isActive 
                                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {review.isActive ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button 
                                                            onClick={() => navigate(`${ROUTES.REVIEWS}/edit/${review._id}`)} 
                                                            className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Edit size={18} className="sm:w-5 sm:h-5" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <button 
                                                            onClick={() => handleDeleteClick(review._id)} 
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
                    <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {loading && reviews.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading reviews...</div>
                        ) : reviews.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No reviews found.</div>
                        ) : (
                            reviews.map((review: any) => (
                                <div key={review._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-[32px] border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-6 shadow-sm h-full">
                                    <div className="flex items-start justify-between mb-6 text-left">
                                        <div className="flex items-center gap-3 text-left">
                                            <Avatar size={48} icon={<UserIcon size={24} />} className="bg-white dark:bg-slate-900 text-primary-600 shadow-sm ring-4 ring-primary-500/5 text-xs font-black uppercase tracking-widest text-[10px]" />
                                            <div className="text-left">
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize leading-tight">{review.personName || 'Anonymous'}</h3>
                                                <p className="text-[10px] font-medium text-slate-500 truncate max-w-[120px] lowercase">{review.email}</p>
                                                <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest mt-0.5">{review.date ? new Date(review.date).toLocaleDateString('en-GB') : ''}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleStatus(review)} 
                                            disabled={isActionLoading}
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

                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-slate-700/50 flex flex-col flex-1 text-left">
                                        <div className="flex items-center gap-1 mb-3">
                                            <Rate disabled value={review.rating} className="text-yellow-500 scale-75 origin-left" />
                                            <span className="text-xs font-black text-slate-300 ml-1">/ 5.0</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed italic flex-1 text-left">
                                            "{review.description || review.comment || 'No textual feedback provided.'}"
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-2">
                                        <button onClick={() => navigate(`${ROUTES.REVIEWS}/edit/${review._id}`)} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-900 text-primary-600 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-primary-600 hover:text-white transition-all"><Edit size={16} /></button>
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
                message="Are you sure you want to delete this review?"
            />
        </div>
    );
};

export default ReviewManagement;
