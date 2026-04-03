import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Shield, ImageIcon, X } from 'lucide-react';
import { useManagementData } from '../Utils/Hooks/useManagementData';
import TableToolbar from '../Components/TableToolbar';
import TableFooter from '../Components/TableFooter';
import ConfirmModal from '../Components/ConfirmModal';
import { getSrNo } from '../Utils/tableUtils';
import { cn } from '../Utils/cn';
import { Image, Tooltip, Modal } from 'antd';
import { KEYS, URL_KEYS, ROUTES } from '../Constants';

const BrandManagement: React.FC = () => {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState<'grid' | 'list'>('list');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [activeTitle, setActiveTitle] = useState<string>('');
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

    const {
        items: brands,
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
        resourceKey: KEYS.BRAND.ALL,
        resourceUrl: URL_KEYS.BRAND.ALL,
        idField: 'brandId',
        dataKey: 'brand_data',
    });

    const handleImageError = (id: string | undefined) => {
        if (!id) return;
        setBrokenImages((prev) => ({ ...prev, [id]: true }));
    };

    const openImageModal = (imageUrl: string, title?: string) => {
        setActiveImage(imageUrl);
        setActiveTitle(title || 'Brand Logo');
        setIsImageModalOpen(true);
    };

    return (
        <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="text-left px-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Brand Assets</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Manage your product brands and manufacturer logos.</p>
                </div>
                <Button onClick={() => navigate(`${ROUTES.BRANDS}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto">
                    <Plus size={20} /> Add Brand
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search brands..."
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
                                        <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort('name')}>
                                            Brand Name
                                            <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">
                                                {getSortIcon('name')}
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                                {loading && brands.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading brands...</td>
                                    </tr>
                                ) : brands.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No brands found.</td>
                                    </tr>
                                ) : (
                                    brands.map((brand: any, index: number) => (
                                        <tr key={brand._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                            <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">
                                                {getSrNo(currentPage, pageSize, index)}
                                            </td>
                                            <td className="px-4 sm:px-8 py-5">
                                                <div className="flex items-center gap-3 sm:gap-4 text-left">
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-110 shrink-0">
                                                        {brand.image && !brokenImages[brand._id] ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => openImageModal(brand.image, brand.name || brand.title)}
                                                                className="relative h-full w-full cursor-pointer group/thumb"
                                                                title="View image"
                                                            >
                                                                <Image
                                                                    src={brand.image}
                                                                    alt={brand.name || brand.title}
                                                                    className="h-full w-full object-contain p-1"
                                                                    preview={false}
                                                                    onError={() => handleImageError(brand._id)}
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                                                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                                                                        <ImageIcon size={14} />
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ) : (
                                                            <Shield className="text-slate-300" size={20} />
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none capitalize truncate max-w-[150px] sm:max-w-none">{brand.name || brand.title}</p>
                                                </div>
                                            </td>
                                             <td className="px-4 sm:px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                                                    <Tooltip title={brand.isActive ? "Deactivate" : "Activate"}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(brand)} 
                                                            disabled={isActionLoading}
                                                            className={cn(
                                                                "p-2 rounded-xl transition-all shadow-sm",
                                                                brand.isActive 
                                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                            )}
                                                        >
                                                            {brand.isActive ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button 
                                                            onClick={() => navigate(`${ROUTES.BRANDS}/edit/${brand._id}`)} 
                                                            className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"
                                                        >
                                                            <Edit size={18} className="sm:w-5 sm:h-5" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <button 
                                                            onClick={() => handleDeleteClick(brand._id)} 
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
                    <div className="p-4 sm:p-6 grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {loading && brands.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading brands...</div>
                        ) : brands.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No brands found.</div>
                        ) : (
                            brands.map((brand: any) => (
                                <div key={brand._id} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col items-center p-6 text-center shadow-sm">
                                    <div className="h-20 w-20 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm mb-4 transition-transform group-hover:scale-110 border border-gray-50 dark:border-slate-700">
                                        {brand.image && !brokenImages[brand._id] ? (
                                            <button
                                                type="button"
                                                onClick={() => openImageModal(brand.image, brand.name || brand.title)}
                                                className="relative h-full w-full cursor-pointer group/thumb"
                                                title="View image"
                                            >
                                                <Image
                                                    src={brand.image}
                                                    alt={brand.name || brand.title}
                                                    preview={false}
                                                    className="h-full w-full object-contain p-2"
                                                    onError={() => handleImageError(brand._id)}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                                    <div className="h-8 w-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                </div>
                                            </button>
                                        ) : (
                                            <Shield className="text-slate-200" size={32} />
                                        )}
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize tracking-tight mb-4 text-center">{brand.name}</h3>
                                    
                                     <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleToggleStatus(brand)} 
                                            disabled={isActionLoading}
                                            className={cn(
                                                "p-2 rounded-xl transition-all shadow-sm",
                                                brand.isActive 
                                                    ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" 
                                                    : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                            )}
                                        >
                                            {brand.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        </button>
                                        <button onClick={() => navigate(`${ROUTES.BRANDS}/edit/${brand._id}`)} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm"><Edit size={20} /></button>
                                        <button onClick={() => handleDeleteClick(brand._id)} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm"><Trash2 size={20} /></button>
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
                    resourceName="brands"
                />
            </Card>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={isActionLoading}
                message="Are you sure you want to delete this brand? This action cannot be undone."
            />

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

export default BrandManagement;
