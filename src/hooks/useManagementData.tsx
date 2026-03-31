// Standardized Management Data Hook
import { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

interface UseManagementDataProps {
    apiMethod: (params: any) => Promise<any>;
    deleteMethod?: (id: string) => Promise<any>;
    toggleMethod?: (data: any) => Promise<any>;
    idField?: string;
    dataKey: string;
    initialPageSize?: number | 'All';
    initialSort?: string;
    initialActiveFilter?: boolean;
    extraParams?: any;
    resourceName?: string;
}

export const useManagementData = ({
    apiMethod,
    deleteMethod,
    toggleMethod,
    idField = '_id',
    dataKey,
    initialPageSize = 10,
    initialSort = '',
    initialActiveFilter = true,
    extraParams = {},
}: UseManagementDataProps) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<number | 'All'>(initialPageSize);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean>(initialActiveFilter);
    const [sortFilter, setSortFilter] = useState(initialSort);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchData = useCallback(async (isSearch = false) => {
        try {
            setLoading(true);
            const params: any = { ...extraParams };

            if (searchTerm.trim()) {
                params.search = searchTerm;
            }

            if (pageSize !== 'All') {
                params.page = isSearch ? 1 : currentPage;
                params.limit = pageSize;
            }

            params.activeFilter = activeFilter;
            
            if (sortFilter) {
                params.sortFilter = sortFilter;
            }

            const response = await apiMethod(params);
            if (response.data.status === 200) {
                const data = response.data.data;
                setItems(data[dataKey] || []);
                setTotal(data.totalData || 0);
            }
        } catch (error) {
            console.error('Fetch data error:', error);
            setItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiMethod, dataKey, currentPage, pageSize, searchTerm, activeFilter, sortFilter, JSON.stringify(extraParams)]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, searchTerm ? 500 : 50); // Minimal delay for initial load/filters, 500ms only for search typing
        
        return () => clearTimeout(timer);
    }, [fetchData, searchTerm, currentPage, pageSize, activeFilter, sortFilter]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number | 'All') => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const refresh = () => fetchData();

    // --- Action Handlers ---

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete || !deleteMethod) return;
        try {
            setIsActionLoading(true);
            const response = await deleteMethod(itemToDelete);
            if (response.data.status === 200) {
                refresh();
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            }
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleToggleStatus = async (item: any) => {
        if (!toggleMethod) return;
        try {
            setIsActionLoading(true);
            const payload = {
                [idField]: item._id,
                isActive: !item.isActive
            };
            const response = await toggleMethod(payload);
            if (response.data.status === 200) {
                refresh();
            }
        } catch (error) {
            console.error('Toggle status error:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    // --- Sorting logic ---

    const toggleSort = (field: string = 'name') => {
        const asc = `${field}Asc`;
        const desc = `${field}Desc`;
        
        if (sortFilter === asc) setSortFilter(desc);
        else if (sortFilter === desc) setSortFilter('');
        else setSortFilter(asc);
        setCurrentPage(1);
    };

    const getSortIcon = (field: string = 'name') => {
        const asc = `${field}Asc`;
        const desc = `${field}Desc`;
        
        if (sortFilter === asc) return <ArrowUp size={14} className="text-primary-500" />;
        if (sortFilter === desc) return <ArrowDown size={14} className="text-primary-500" />;
        return <ArrowUpDown size={14} className="text-slate-400 group-hover:text-slate-600" />;
    };

    return {
        items,
        loading,
        total,
        currentPage,
        pageSize,
        searchTerm,
        activeFilter,
        sortFilter,
        setItems,
        setSearchTerm: handleSearch,
        setCurrentPage: handlePageChange,
        setPageSize: handlePageSizeChange,
        setActiveFilter: (val: boolean) => {
            setActiveFilter(val);
            setCurrentPage(1);
        },
        setSortFilter,
        refresh,
        
        // Actions
        handleDeleteClick,
        confirmDelete,
        handleToggleStatus,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isActionLoading,
        
        // Sorting
        toggleSort,
        getSortIcon
    };
};
