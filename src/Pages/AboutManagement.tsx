import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Card from '../Components/Card';
import Button from '../Components/Button';
import TableToolbar from '../Components/TableToolbar';
import TableFooter from '../Components/TableFooter';
import ConfirmModal from '../Components/ConfirmModal';
import { useManagementData } from '../Utils/Hooks/useManagementData';
import { getSrNo } from '../Utils/tableUtils';
import { Info, ImageIcon, Hash, Trash2, ToggleLeft, ToggleRight, Edit, Plus, CheckCircle, XCircle, X } from 'lucide-react';
import { Tooltip, Image, Modal } from 'antd';
import { KEYS, URL_KEYS, ROUTES } from '../Constants';
import { Mutations } from '../Api/Mutations';
import { cn } from '../Utils/cn';

const AboutManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const { items: aboutSections, loading, total, currentPage, pageSize, searchTerm, activeFilter, setSearchTerm, setCurrentPage, setPageSize, setActiveFilter, toggleSort, getSortIcon } = useManagementData({
    resourceKey: KEYS.ABOUT.ALL,
    resourceUrl: URL_KEYS.ABOUT.ALL,
    dataKey: 'about_section_data',
    useActiveFilter: true,
  });

  const deleteMutation = Mutations.useDeleteAboutSection();
  const editMutation = Mutations.useEditAboutSection();
  const isActionLoading = editMutation.isPending;

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.ABOUT.ALL] });
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }
      });
    }
  };

  const handleToggleStatus = (item: any) => {
    const sectionId = item?.sectionId || item?._id || item?.id;
    if (!sectionId) return;
    editMutation.mutate({ sectionId, isActive: !item?.isActive });
  };

  const handleImageError = (id: string | undefined) => {
    if (!id) return;
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const openImageModal = (imageUrl: string, title?: string) => {
    setActiveImage(imageUrl);
    setActiveTitle(title || 'About Section Image');
    setIsImageModalOpen(true);
  };

  const getTitle = (item: any) => item?.title || 'Untitled Section';
  const getSubtitle = (item: any) => item?.subtitle || '-';
  const getDescription = (item: any) => item?.description || '-';
  const getPriority = (item: any) => (item?.priority ?? '-');
  const isActive = (item: any) => !!item?.isActive;
  const badgeTone = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            About Page Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">
            Manage About sections, highlights, and priorities.
          </p>
        </div>
        <Button onClick={() => navigate(`${ROUTES.ABOUT}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto" >
          <Plus size={20} /> Add Section
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
        <TableToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search about sections..." showActiveFilter activeFilter={activeFilter} onActiveFilterChange={setActiveFilter} showViewToggle viewType={viewType} onViewTypeChange={setViewType} />

        {viewType === 'list' ? (
          <div className="overflow-x-auto scrollbar-hide w-full max-w-full pb-2">
            <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">
                    Sr. No.
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('title')}>
                      Section
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                        {getSortIcon('title')}
                      </div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    Description
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    Priority
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                {loading && aboutSections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">
                      Loading about sections...
                    </td>
                  </tr>
                ) : aboutSections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">
                      No about sections found.
                    </td>
                  </tr>
                ) : (
                  aboutSections.map((section: any, index: number) => {
                    const sectionId = section?._id || section?.id;
                    return (
                      <tr key={sectionId || index} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                        <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">
                          {getSrNo(currentPage, pageSize, index)}
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <div className="flex items-center gap-3 sm:gap-4 text-left">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                              {section.image && !brokenImages[sectionId] ? (
                                <button type="button" onClick={() => openImageModal(section.image, getTitle(section))} className="relative block h-full w-full cursor-pointer group/thumb" title="View image" >
                                  <Image src={section.image} alt={getTitle(section)} className="h-full w-full object-cover" preview={false} onError={() => handleImageError(sectionId)} />
                                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                                      <ImageIcon size={14} />
                                    </div>
                                  </div>
                                </button>
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="text-slate-300" size={20} />
                                </div>
                              )}
                            </div>
                            <div className="text-left overflow-hidden">
                              <p className="text-sm font-black text-slate-900 dark:text-white leading-snug pb-0.5 truncate max-w-[220px] sm:max-w-xs">
                                {getTitle(section)}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 truncate max-w-[220px] sm:max-w-xs">
                                {getSubtitle(section)}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 md:hidden truncate max-w-[220px] sm:max-w-xs">
                                {isActive(section) ? <CheckCircle size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-400" />}
                                <span className="truncate">{isActive(section) ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2 max-w-[320px]">
                            {getDescription(section)}
                          </p>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>
                            <Hash size={12} /> {getPriority(section)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                            <Tooltip title={isActive(section) ? "Deactivate" : "Activate"}>
                              <button onClick={() => handleToggleStatus(section)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", isActive(section) ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                                {isActive(section) ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                              </button>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <button onClick={() => sectionId && navigate(`${ROUTES.ABOUT}/edit/${sectionId}`, { state: { aboutSection: section } })} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                                <Edit size={18} className="sm:w-5 sm:h-5" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <button onClick={() => sectionId && handleDeleteClick(sectionId)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
                                <Trash2 size={18} className="sm:w-5 sm:h-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {loading && aboutSections.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading about sections...</div>
            ) : aboutSections.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No about sections found.</div>
            ) : (
              aboutSections.map((section: any, index: number) => {
                const sectionId = section?._id || section?.id;
                return (
                  <div key={sectionId || index} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-4 shadow-sm">
                    <div className="aspect-[4/4] w-full rounded-2xl bg-white dark:bg-slate-900 overflow-hidden mb-4 border border-gray-100 dark:border-slate-800">
                      {section.image && !brokenImages[sectionId] ? (
                        <button type="button" onClick={() => openImageModal(section.image, getTitle(section))} className="relative h-full w-full cursor-pointer group/thumb" title="View image" >
                          <Image src={section.image} alt={getTitle(section)} preview={false} className="h-full w-full object-cover transition-transform group-hover:scale-105" onError={() => handleImageError(sectionId)} />
                          <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                            <div className="h-8 w-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                              <ImageIcon size={16} />
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><ImageIcon className="text-slate-200" size={32} /></div>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-3 text-left">
                      <div className="text-left">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">{getTitle(section)}</h3>
                        <p className="text-[10px] font-bold text-slate-400 truncate max-w-[180px] flex items-center gap-2 mt-1">
                          <Info size={12} /> {getSubtitle(section)}
                        </p>
                      </div>
                      <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", isActive(section) ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-400 bg-slate-100 dark:bg-slate-800")}>
                        {isActive(section) ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-3">
                      {getDescription(section)}
                    </p>

                    <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Hash size={12} /> Priority {getPriority(section)}
                    </div>

                    <div className="mt-4 flex items-center gap-1.5">
                      <Tooltip title={isActive(section) ? "Deactivate" : "Activate"}>
                        <button onClick={() => handleToggleStatus(section)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", isActive(section) ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                          {isActive(section) ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <button onClick={() => sectionId && navigate(`${ROUTES.ABOUT}/edit/${sectionId}`, { state: { aboutSection: section } })} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                          <Edit size={18} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <button onClick={() => sectionId && handleDeleteClick(sectionId)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        <TableFooter currentPage={currentPage} pageSize={pageSize} total={total} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} resourceName="about sections" />
      </Card>

      <ConfirmModal  isOpen={isDeleteModalOpen}  onClose={() => setIsDeleteModalOpen(false)}  onConfirm={confirmDelete}  loading={deleteMutation.isPending}  message="Are you sure you want to delete this about section? This action cannot be undone." />

      <Modal open={isImageModalOpen} onCancel={() => setIsImageModalOpen(false)} footer={null} centered closable closeIcon={<X size={16} />} width={520} destroyOnClose className="product-image-modal" >
        <div className="space-y-3">
          <div className="text-base font-black text-slate-900 dark:text-white">{activeTitle}</div>
          {activeImage ? (
            <div className="flex justify-center">
              <Image src={activeImage} alt={activeTitle} preview={false} className="rounded-2xl object-contain max-h-[60vh] max-w-full" />
            </div>
          ) : (
            <div className="h-48 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              No image available.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AboutManagement;
