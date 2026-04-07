import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Card from "../Components/Card";
import Button from "../Components/Button";
import TableToolbar from "../Components/TableToolbar";
import TableFooter from "../Components/TableFooter";
import ConfirmModal from "../Components/ConfirmModal";
import { useManagementData } from "../Utils/Hooks/useManagementData";
import { getSrNo } from "../Utils/tableUtils";

import { Tooltip, Image } from "antd";
import { KEYS, URL_KEYS, ROUTES } from "../Constants";
import { Mutations } from "../Api/Mutations";
import { cn } from "../Utils/cn";
import { CheckCircle, Camera, Edit, Hash, ImageIcon, LinkIcon, Plus, ToggleLeft, ToggleRight, Trash2, Video, XCircle } from "lucide-react";

const IgPostManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("list");

  const {
    items: igPosts,
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
    toggleSort,
    getSortIcon,
  } = useManagementData({
    resourceKey: KEYS.IG_POST.ALL,
    resourceUrl: URL_KEYS.IG_POST.ALL,
    dataKey: "ig_post_data",
    useActiveFilter: true,
  });

  const deleteMutation = Mutations.useDeleteIgPost();
  const editMutation = Mutations.useEditIgPost();
  const isActionLoading = editMutation.isPending;

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.IG_POST.ALL] });
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const handleToggleStatus = (item: any) => {
    const igPostId = item?.igPostId || item?._id || item?.id;
    if (!igPostId) return;
    editMutation.mutate({ igPostId, isActive: !item?.isActive });
  };

  const getTitle = (item: any) => item?.title || "Untitled Post";
  const getLink = (item: any) => item?.link || "-";
  const getPriority = (item: any) => item?.priority ?? "-";
  const getType = (item: any) => (item?.type || "").toString() || "-";
  const isActive = (item: any) => !!item?.isActive;
  const badgeTone = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">IG Post Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Curate Instagram-style posts, links, and priorities.</p>
        </div>
        <Button onClick={() => navigate(`${ROUTES.IG_POSTS}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto">
          <Plus size={20} /> Add IG Post
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
        <TableToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search IG posts..." showActiveFilter activeFilter={activeFilter} onActiveFilterChange={setActiveFilter} showViewToggle viewType={viewType} onViewTypeChange={setViewType} />

        {viewType === "list" ? (
          <div className="overflow-x-auto scrollbar-hide w-full max-w-full pb-2">
            <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">Sr. No.</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort("title")}>
                      Post
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">{getSortIcon("title")}</div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Type</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Link</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Priority</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                {loading && igPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">
                      Loading IG posts...
                    </td>
                  </tr>
                ) : igPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">
                      No IG posts found.
                    </td>
                  </tr>
                ) : (
                  igPosts.map((igPost: any, index: number) => {
                    const igPostId = igPost?._id || igPost?.id;
                    return (
                      <tr key={igPostId || index} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                        <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">{getSrNo(currentPage, pageSize, index)}</td>
                        <td className="px-4 sm:px-8 py-5">
                          <div className="flex items-center gap-3 sm:gap-4 text-left">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                              {igPost.type === "video" ? (
                                igPost.video ? (
                                  <a href={igPost.video} target="_blank" rel="noopener noreferrer" className="relative block h-full w-full cursor-pointer group/thumb" title="Open video">
                                    <video className="h-full w-full object-cover" src={igPost.video} />
                                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                                        <Video size={14} />
                                      </div>
                                    </div>
                                  </a>
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Video className="text-slate-300" size={20} />
                                  </div>
                                )
                              ) : igPost.image ? (
                                <a href={igPost.image} target="_blank" rel="noopener noreferrer" className="relative block h-full w-full cursor-pointer group/thumb" title="Open image">
                                  <Image src={igPost.image} alt={getTitle(igPost)} className="h-full w-full object-cover" preview={false} />
                                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                                      <ImageIcon size={14} />
                                    </div>
                                  </div>
                                </a>
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="text-slate-300" size={20} />
                                </div>
                              )}
                            </div>
                            <div className="text-left overflow-hidden">
                              <p className="text-sm font-black text-slate-900 dark:text-white leading-snug pb-0.5 truncate max-w-[220px] sm:max-w-xs">{getTitle(igPost)}</p>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 truncate max-w-[220px] sm:max-w-xs">
                                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", badgeTone)}>
                                  <Camera size={10} /> IG Post
                                </span>
                                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", badgeTone)}>
                                  <Hash size={10} /> Priority {getPriority(igPost)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 md:hidden truncate max-w-[220px] sm:max-w-xs">
                                {isActive(igPost) ? <CheckCircle size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-400" />}
                                <span className="truncate">{isActive(igPost) ? "Active" : "Inactive"}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>
                            {getType(igPost) === "video" ? <Video size={12} /> : <ImageIcon size={12} />} {getType(igPost) === "video" ? "Video" : getType(igPost) === "image" ? "Image" : getType(igPost)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          {getLink(igPost) === "-" ? (
                            <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>
                              <LinkIcon size={12} /> -
                            </span>
                          ) : (
                            <a href={getLink(igPost)} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest max-w-[220px] sm:max-w-[260px] truncate", badgeTone, "hover:text-primary-600")} title={getLink(igPost)}>
                              <LinkIcon size={12} />
                              <span className="truncate">{getLink(igPost)}</span>
                            </a>
                          )}
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>
                            <Hash size={12} /> {getPriority(igPost)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                            <Tooltip title={isActive(igPost) ? "Deactivate" : "Activate"}>
                              <button onClick={() => handleToggleStatus(igPost)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", isActive(igPost) ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                                {isActive(igPost) ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                              </button>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <button onClick={() => igPostId && navigate(`${ROUTES.IG_POSTS}/edit/${igPostId}`, { state: { igPost } })} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                                <Edit size={18} className="sm:w-5 sm:h-5" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <button onClick={() => igPostId && handleDeleteClick(igPostId)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
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
            {loading && igPosts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading IG posts...</div>
            ) : igPosts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No IG posts found.</div>
            ) : (
              igPosts.map((igPost: any, index: number) => {
                const igPostId = igPost?._id || igPost?.id;
                return (
                  <div key={igPostId || index} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-4 shadow-sm">
                    <div className="aspect-[4/4] w-full rounded-2xl bg-white dark:bg-slate-900 overflow-hidden mb-4 border border-gray-100 dark:border-slate-800">
                      {igPost.image ? (
                        <Image src={igPost.image} alt={getTitle(igPost)} preview={false} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageIcon className="text-slate-200" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-3 text-left">
                      <div className="text-left">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">{getTitle(igPost)}</h3>
                        <p className="text-[10px] font-bold text-slate-400 truncate max-w-[160px] flex items-center gap-2 mt-1">
                          <LinkIcon size={12} /> {getLink(igPost)}
                        </p>
                      </div>
                      <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", isActive(igPost) ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-400 bg-slate-100 dark:bg-slate-800")}>{isActive(igPost) ? "Active" : "Inactive"}</div>
                    </div>

                    <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Hash size={12} /> Priority {getPriority(igPost)}
                    </div>

                    <div className="mt-4 flex items-center gap-1.5">
                      <Tooltip title={isActive(igPost) ? "Deactivate" : "Activate"}>
                        <button onClick={() => handleToggleStatus(igPost)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", isActive(igPost) ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                          {isActive(igPost) ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <button onClick={() => igPostId && navigate(`${ROUTES.IG_POSTS}/edit/${igPostId}`, { state: { igPost } })} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                          <Edit size={18} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <button onClick={() => igPostId && handleDeleteClick(igPostId)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
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

        <TableFooter currentPage={currentPage} pageSize={pageSize} total={total} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} resourceName="ig posts" />
      </Card>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={deleteMutation.isPending} message="Are you sure you want to delete this IG post? This action cannot be undone." />
    </div>
  );
};

export default IgPostManagement;
