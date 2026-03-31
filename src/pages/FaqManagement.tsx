import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faqAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, HelpCircle, MessageCircle } from 'lucide-react';
import { useManagementData } from '../hooks/useManagementData';
import TableToolbar from '../components/TableToolbar';
import TableFooter from '../components/TableFooter';
import ConfirmModal from '../components/ConfirmModal';
import { getSrNo } from '../utils/tableUtils';
import { cn } from '../utils/cn';
import { Tag, Tooltip } from 'antd';

const FaqManagement: React.FC = () => {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState<'grid' | 'list'>('list');

    const {
        items: faqs,
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
        apiMethod: faqAPI.getAll,
        deleteMethod: faqAPI.delete,
        toggleMethod: faqAPI.edit,
        idField: 'faqId',
        dataKey: 'faq_data',
        resourceName: 'FAQ'
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Question Portfolio</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage common user inquiries and automated support content.</p>
                </div>
                <Button onClick={() => navigate('/faqs/add')} className="h-12 px-6 rounded-2xl flex items-center gap-2">
                    <Plus size={20} /> Add New FAQ
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search questions or answers..."
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
                                            Question
                                            <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                                {getSortIcon('name')}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Category</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading faqs...</td>
                                    </tr>
                                ) : faqs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No faqs found.</td>
                                    </tr>
                                ) : (
                                    faqs.map((faq, index) => (
                                        <tr key={faq._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                            <td className="px-8 py-5 font-black text-slate-400 text-sm">
                                                {getSrNo(currentPage, pageSize, index)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:scale-110">
                                                        <HelpCircle size={16} />
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize truncate max-w-[300px]">{faq.question}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Tag className="border-0 bg-primary-50 dark:bg-primary-900/20 text-[10px] font-black text-primary-600 uppercase tracking-widest px-3 rounded-full">
                                                    {faq.faqCategoryId?.name || 'General'}
                                                </Tag>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Tooltip title={faq.isActive ? "Deactivate" : "Activate"}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(faq)} 
                                                            className={cn(
                                                                "p-2 rounded-xl transition-all shadow-sm",
                                                                faq.isActive 
                                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {faq.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button 
                                                            onClick={() => navigate(`/faqs/edit/${faq._id}`)} 
                                                            className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <button 
                                                            onClick={() => handleDeleteClick(faq._id)} 
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
                    <div className="p-8 space-y-6">
                        {loading ? (
                            <div className="py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading faqs...</div>
                        ) : faqs.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-bold italic tracking-wider">No faqs found.</div>
                        ) : (
                            faqs.map((faq) => (
                                <div key={faq._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-[32px] border border-gray-100 dark:border-slate-800 overflow-hidden p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-primary-500/30 shadow-sm hover:shadow-md">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="h-10 w-10 flex-shrink-0 bg-white dark:bg-slate-900 text-primary-500 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-800">
                                            <MessageCircle size={20} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize tracking-tight leading-tight">{faq.question}</h3>
                                                <Tag className="border-0 bg-primary-50 dark:bg-primary-900/20 text-[10px] font-black text-primary-600 uppercase tracking-widest px-3 rounded-full">
                                                    {faq.faqCategoryId?.name || 'General'}
                                                </Tag>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic leading-relaxed flex-1">"{faq.answer}"</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleToggleStatus(faq)} 
                                            className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                                                faq.isActive ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/10" : "bg-white dark:bg-slate-900 text-slate-300"
                                            )}
                                        >
                                            {faq.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        </button>
                                        <button onClick={() => navigate(`/faqs/edit/${faq._id}`)} className="h-10 w-10 bg-white dark:bg-slate-900 text-primary-600 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-primary-600 hover:text-white transition-all"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteClick(faq._id)} className="h-10 w-10 bg-white dark:bg-slate-900 text-red-600 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
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
                    resourceName="questions"
                />
            </Card>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={isActionLoading}
                message="Are you sure you want to delete this FAQ? This action cannot be undone."
            />
        </div>
    );
};

export default FaqManagement;
