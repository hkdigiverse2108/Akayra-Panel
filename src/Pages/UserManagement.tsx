import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/Card";
import Button from "../Components/Button";
import { UserPlus, Edit, Trash2, Phone, ToggleLeft, ToggleRight } from "lucide-react";
import { useManagementData } from "../Utils/Hooks/useManagementData";
import TableToolbar from "../Components/TableToolbar";
import TableFooter from "../Components/TableFooter";
import ConfirmModal from "../Components/ConfirmModal";
import { getSrNo } from "../Utils/tableUtils";
import { cn } from "../Utils/cn";
import { Avatar, Tooltip } from "antd";
import { KEYS, URL_KEYS, ROUTES } from "../Constants";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<"grid" | "list">("list");

  const {
    items: users,
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
    getSortIcon,
  } = useManagementData({
    resourceKey: KEYS.USER.ALL,
    resourceUrl: URL_KEYS.USER.ALL,
    idField: "userId",
    dataKey: "user_data",
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage platform users, roles and permissions.</p>
        </div>
        <Button onClick={() => navigate(`${ROUTES.USERS}/add`)} className="h-12 px-6 rounded-2xl flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20">
          <UserPlus size={20} /> Add New User
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900 text-left">
        <TableToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search by name or email..." activeFilter={activeFilter} onActiveFilterChange={setActiveFilter} showViewToggle viewType={viewType} onViewTypeChange={setViewType} />

        {viewType === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16">Sr. No.</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort("name")}>
                      User Details
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">{getSortIcon("name")}</div>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Contact</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse font-black uppercase text-xs">
                      Accessing User Database...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any, index: number) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                      <td className="px-8 py-5 font-black text-slate-400 text-sm">{getSrNo(currentPage, pageSize, index)}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-left">
                          <Avatar className="bg-primary-100 text-primary-700 font-black border-2 border-primary-200" size={48} shape="square" style={{ borderRadius: "14px" }}>
                            {user.firstName?.charAt(0).toUpperCase()}
                          </Avatar>
                          <div className="text-left">
                            <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 text-left">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-left">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 text-left">
                          <Phone size={14} className="text-slate-400" />
                          {user.contact?.phoneNo || "N/A"}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                            <button onClick={() => handleToggleStatus(user)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", user.isActive ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                              {user.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            </button>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <button onClick={() => navigate(`${ROUTES.USERS}/edit/${user._id}`)} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                              <Edit size={20} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <button onClick={() => handleDeleteClick(user._id)} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
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
          <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {loading && users.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Accessing User Database...</div>
            ) : users.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No users found.</div>
            ) : (
              users.map((user: any) => (
                <div key={user._id} className="group bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Avatar className="bg-primary-100 text-primary-700 font-black border-2 border-primary-200" size={56} shape="square" style={{ borderRadius: "16px" }}>
                      {user.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Phone size={14} className="text-slate-400" />
                    {user.contact?.phoneNo || "N/A"}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                      <button onClick={() => handleToggleStatus(user)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", user.isActive ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                        {user.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </Tooltip>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Edit">
                        <button onClick={() => navigate(`${ROUTES.USERS}/edit/${user._id}`)} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                          <Edit size={20} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <button onClick={() => handleDeleteClick(user._id)} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
                          <Trash2 size={20} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <TableFooter currentPage={currentPage} pageSize={pageSize} total={total} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} resourceName="users" />
      </Card>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={isActionLoading} message="Are you sure you want to delete this user? This action cannot be undone." />
    </div>
  );
};

export default UserManagement;
