import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Card from "../Components/Card";
import TableToolbar from "../Components/TableToolbar";
import TableFooter from "../Components/TableFooter";
import ConfirmModal from "../Components/ConfirmModal";
import Button from "../Components/Button";
import { useManagementData } from "../Utils/Hooks/useManagementData";
import { getSrNo } from "../Utils/tableUtils";
import { Mail, Phone, User, MessageSquare, Clock, Trash2, ViewIcon } from "lucide-react";
import { Tooltip, Modal } from "antd";
import { KEYS, URL_KEYS } from "../Constants";
import { Mutations } from "../Api/Mutations";

const ContactManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("list");

  const { items: inquiries, loading, total, currentPage, pageSize, searchTerm, setSearchTerm, setCurrentPage, setPageSize, toggleSort, getSortIcon } = useManagementData({ resourceKey: KEYS.CONTACT.ALL, resourceUrl: URL_KEYS.CONTACT.ALL, dataKey: "contact_data", useActiveFilter: false });

  const deleteMutation = Mutations.useDeleteContactInquiry();

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.CONTACT.ALL] });
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const handleViewClick = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsMessageModalOpen(true);
  };

  const getName = (item: any) => item?.name || "Anonymous";
  const getEmail = (item: any) => item?.email || "N/A";
  const getPhone = (item: any) => item?.mobileNumber || "N/A";
  const getSubject = (item: any) => item?.subject || "General Inquiry";
  const getMessage = (item: any) => item?.message || "No message provided.";
  const getDate = (item: any) => (item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-");

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Contact Inquiries</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Track customer messages and respond quickly.</p>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
        <TableToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search inquiries..." showActiveFilter={false} showViewToggle viewType={viewType} onViewTypeChange={setViewType} />

        {viewType === "list" ? (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">Sr. No.</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort("name")}>
                      Sender
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">{getSortIcon("name")}</div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden md:table-cell">Phone</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden md:table-cell">Subject</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Message</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden lg:table-cell">Date</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                {loading && inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">
                      Loading inquiries...
                    </td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">
                      No inquiries found.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inquiry: any, index: number) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                      <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">{getSrNo(currentPage, pageSize, index)}</td>
                      <td className="px-4 sm:px-8 py-5">
                        <div className="flex items-center gap-3 sm:gap-4 text-left">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                            <User className="text-slate-300" size={20} />
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize truncate max-w-[150px] sm:max-w-xs">{getName(inquiry)}</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 truncate max-w-[150px] sm:max-w-xs">
                              <Mail size={12} className="shrink-0" />
                              <span className="truncate">{getEmail(inquiry)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 md:hidden truncate max-w-[150px] sm:max-w-xs">
                              <Phone size={12} className="shrink-0" />
                              <span className="truncate">{getPhone(inquiry)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter truncate max-w-[140px] hidden md:table-cell">{getPhone(inquiry)}</td>
                      <td className="px-4 sm:px-8 py-5 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter truncate max-w-[180px] hidden md:table-cell">{getSubject(inquiry)}</td>
                      <td className="px-4 sm:px-8 py-5">
                        <div className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 max-w-[260px] sm:max-w-[320px]">
                          <MessageSquare size={14} className="text-slate-300 mt-0.5 shrink-0" />
                          <div>
                            <p className="line-clamp-2 italic">{getMessage(inquiry)}</p>
                            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest lg:hidden">{getDate(inquiry)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock size={12} />
                          {getDate(inquiry)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <Tooltip title="View">
                            <button onClick={() => handleViewClick(inquiry)} className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-sm">
                              <ViewIcon size={18} className="sm:w-5 sm:h-5" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <button onClick={() => handleDeleteClick(inquiry._id)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
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
            {loading && inquiries.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No inquiries found.</div>
            ) : (
              inquiries.map((inquiry: any) => (
                <div key={inquiry._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center">
                      <User className="text-slate-300" size={20} />
                    </div>
                    <div className="text-left overflow-hidden">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize tracking-tight line-clamp-1">{getName(inquiry)}</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2 truncate">
                        <Mail size={12} className="shrink-0" /> <span className="truncate">{getEmail(inquiry)}</span>
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2 truncate">
                        <Phone size={12} className="shrink-0" /> <span className="truncate">{getPhone(inquiry)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={12} /> {getSubject(inquiry)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={12} /> {getDate(inquiry)}
                    </div>
                  </div>

                  <div className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <p className="line-clamp-2 italic">{getMessage(inquiry)}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5">
                    <Tooltip title="View">
                      <button onClick={() => handleViewClick(inquiry)} className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-sm">
                        <ViewIcon size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <button onClick={() => handleDeleteClick(inquiry._id)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <TableFooter currentPage={currentPage} pageSize={pageSize} total={total} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} resourceName="inquiries" />
      </Card>
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={deleteMutation.isPending} message="Are you sure you want to delete this inquiry? This action cannot be undone." />
      <Modal open={isMessageModalOpen} onCancel={() => setIsMessageModalOpen(false)} footer={null} title={null} centered destroyOnClose closable={false} width={720} rootClassName="message-modal">
        <div className="space-y-4">
          <div className="text-left">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Inquiry Details</h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">Contact inquiry from user</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              <span className="font-semibold">Name:</span>
              <span>{getName(selectedInquiry)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-400" />
              <span className="font-semibold">Email:</span>
              <span className="break-all">{getEmail(selectedInquiry)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400" />
              <span className="font-semibold">Phone:</span>
              <span>{getPhone(selectedInquiry)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span className="font-semibold">Date:</span>
              <span>{getDate(selectedInquiry)}</span>
            </div>
          </div>
          <div className="message-scroll scrollbar-hide text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed">{getMessage(selectedInquiry)}</div>
          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsMessageModalOpen(false)} className="h-10 px-5 rounded-xl font-bold">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactManagement;
