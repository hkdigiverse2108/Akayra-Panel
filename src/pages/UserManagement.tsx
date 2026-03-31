import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { UserPlus, Edit, Trash2, Phone, ToggleLeft, ToggleRight } from 'lucide-react';
import { useManagementData } from '../hooks/useManagementData';
import TableToolbar from '../components/TableToolbar';
import TableFooter from '../components/TableFooter';
import ConfirmModal from '../components/ConfirmModal';
import { getSrNo } from '../utils/tableUtils';
import { cn } from '../utils/cn';
import { Avatar, Tooltip } from 'antd';

const UserManagement: React.FC = () => {
    const navigate = useNavigate();

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
        apiMethod: userAPI.getAll,
        deleteMethod: userAPI.delete,
        toggleMethod: userAPI.edit,
        idField: 'userId',
        dataKey: 'user_data',
        resourceName: 'User'
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage platform users, roles and permissions.</p>
                </div>
                <Button onClick={() => navigate('/users/add')} className="h-12 px-6 rounded-2xl flex items-center gap-2">
                    <UserPlus size={20} /> Add New User
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search by name or email..."
                    activeFilter={activeFilter}
                    onActiveFilterChange={setActiveFilter}
                />

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16">Sr. No.</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('name')}>
                                        User Details
                                        <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                            {getSortIcon('name')}
                                        </div>
                                    </div>
                                </th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Contact</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                        <td className="px-8 py-5 font-black text-slate-400 text-sm">
                                            {getSrNo(currentPage, pageSize, index)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <Avatar 
                                                    className="bg-primary-100 text-primary-700 font-black border-2 border-primary-200" 
                                                    size={48}
                                                    shape="square"
                                                    style={{ borderRadius: '14px' }}
                                                >
                                                    {user.firstName.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                <Phone size={14} className="text-slate-400" />
                                                {user.contact?.phoneNo || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                                                    <button 
                                                        onClick={() => handleToggleStatus(user)} 
                                                        className={cn(
                                                            "p-2 rounded-xl transition-all shadow-sm",
                                                            user.isActive 
                                                                ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                        )}
                                                    >
                                                        {user.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <button 
                                                        onClick={() => navigate(`/users/edit/${user._id}`)} 
                                                        className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <button 
                                                        onClick={() => handleDeleteClick(user._id)} 
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

                <TableFooter
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    resourceName="users"
                />
            </Card>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={isActionLoading}
                message="Are you sure you want to delete this user? This action cannot be undone."
            />
        </div>
    );
};

export default UserManagement;
