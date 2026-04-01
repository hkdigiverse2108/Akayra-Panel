import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Card from '../Components/Card';
import TableToolbar from '../Components/TableToolbar';
import TableFooter from '../Components/TableFooter';
import ConfirmModal from '../Components/ConfirmModal';
import { useManagementData } from '../Utils/Hooks/useManagementData';
import { getSrNo } from '../Utils/tableUtils';
import { Mail, Clock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Tooltip } from 'antd';
import { KEYS, URL_KEYS } from '../Constants';
import { Mutations } from '../Api/Mutations';

const NewsletterManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');

  const { items: subscribers, loading, total, currentPage, pageSize, searchTerm, activeFilter, setSearchTerm, setCurrentPage, setPageSize, setActiveFilter, toggleSort, getSortIcon } = useManagementData({ resourceKey: KEYS.NEWSLETTER.ALL, resourceUrl: URL_KEYS.NEWSLETTER.ALL, dataKey: 'newsletter_data', useActiveFilter: false, });

  const deleteMutation = Mutations.useDeleteNewsletter();

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.NEWSLETTER.ALL] });
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }
      });
    }
  };

  const getEmail = (item: any) => item?.email || 'N/A';
  const getStatusLabel = (item: any) => (item?.isActive ? 'Active' : 'Inactive');
  const getDate = (item: any) => (item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-');

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Newsletter Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">
            View and manage newsletter subscribers.
          </p>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
        <TableToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search subscribers..." showActiveFilter={false} activeFilter={activeFilter} onActiveFilterChange={setActiveFilter} showViewToggle viewType={viewType} onViewTypeChange={setViewType} />

        {viewType === 'list' ? (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[640px] md:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">
                    Sr. No.
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('email')}>
                      Subscriber
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                        {getSortIcon('email')}
                      </div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                {loading && subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">
                      Loading subscribers...
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber: any, index: number) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                      <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">
                        {getSrNo(currentPage, pageSize, index)}
                      </td>
                      <td className="px-4 sm:px-8 py-5">
                        <div className="flex items-center gap-3 sm:gap-4 text-left">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                            <Mail className="text-slate-300" size={20} />
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="text-sm font-black text-slate-900 dark:text-white leading-snug pb-0.5 truncate max-w-[200px] sm:max-w-xs">
                              {getEmail(subscriber)}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 md:hidden truncate max-w-[200px] sm:max-w-xs">
                              {subscriber?.isActive ? <CheckCircle size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-400" />}
                              <span className="truncate">{getStatusLabel(subscriber)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock size={12} />
                          {getDate(subscriber)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <Tooltip title="Delete">
                            <button onClick={() => handleDeleteClick(subscriber._id)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm" >
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
            {loading && subscribers.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading subscribers...</div>
            ) : subscribers.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No subscribers found.</div>
            ) : (
              subscribers.map((subscriber: any) => (
                <div key={subscriber._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center">
                        <Mail className="text-slate-300" size={20} />
                      </div>
                      <div className="text-left overflow-hidden">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight break-all line-clamp-2">{getEmail(subscriber)}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                          <Clock size={12} /> {getDate(subscriber)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5">
                    <Tooltip title="Delete">
                      <button onClick={() => handleDeleteClick(subscriber._id)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm" >
                        <Trash2 size={18} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <TableFooter currentPage={currentPage} pageSize={pageSize} total={total} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} resourceName="subscribers" />
      </Card>
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={deleteMutation.isPending} message="Are you sure you want to delete this subscriber? This action cannot be undone." />
    </div>
  );
};

export default NewsletterManagement;
