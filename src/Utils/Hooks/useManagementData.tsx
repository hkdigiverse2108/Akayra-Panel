import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useQueries, useMutations } from '../../Api/ReactQuery';
import { Get, Delete, Put } from '../../Api/Methods';
import { useDebounce } from './useDebounce';
import { CleanParams } from '../index';

interface UseManagementDataProps {
    resourceKey: string;
    resourceUrl: string;
    dataKey: string;
    idField?: string;
    initialPageSize?: number | 'All';
    initialSort?: string;
    initialActiveFilter?: boolean;
    useActiveFilter?: boolean;
    extraParams?: any;
    resourceName?: string; // For notifications/logging
}

export const useManagementData = ({
    resourceKey,
    resourceUrl,
    dataKey,
    idField = '_id',
    initialPageSize = 10,
    initialSort = '',
    initialActiveFilter = true,
    useActiveFilter = true,
    extraParams = {},
}: UseManagementDataProps) => {
    const queryClient = useQueryClient();
    
    // --- State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<number | 'All'>(initialPageSize);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean>(initialActiveFilter);
    const [sortFilter, setSortFilter] = useState(initialSort);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // --- Debouncing ---
    const debouncedSearch = useDebounce(searchTerm, 500);

    // --- Params ---
    const params = useMemo(() => {
        return CleanParams({
            ...extraParams,
            search: debouncedSearch.trim() || undefined,
            page: pageSize === 'All' ? undefined : currentPage,
            limit: pageSize === 'All' ? undefined : pageSize,
            activeFilter: useActiveFilter ? activeFilter : undefined,
            sortFilter: sortFilter || undefined,
        });
    }, [extraParams, debouncedSearch, currentPage, pageSize, activeFilter, sortFilter, useActiveFilter]);

    // --- Query ---
    const { data: response, isLoading: loading, refetch } = useQueries(
        [resourceKey, params],
        () => Get<any>(resourceUrl, params)
    );

    const items = response?.data?.[dataKey] || [];
    const total = response?.data?.totalData || 0;

    // --- Mutations ---
    const baseUrl = useMemo(() => {
        if (resourceUrl.endsWith('/all')) {
            return resourceUrl.replace(/\/all$/, '');
        }
        return resourceUrl;
    }, [resourceUrl]);

    const deleteMutation = useMutations(
        [resourceKey],
        (id: string) => Delete(`${baseUrl}/${id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [resourceKey] });
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            }
        }
    );

    const toggleMutation = useMutations(
        [resourceKey],
        (payload: any) => Put(`${baseUrl}/edit`, payload), // Standardized edit endpoint for toggling
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [resourceKey] });
            }
        }
    );

    // --- Handlers ---
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

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete);
        }
    };

    const handleToggleStatus = async (item: any) => {
        const recordId = item?.[idField] || item?._id || item?.id;
        if (!recordId) return;
        const payload = {
            [idField]: recordId,
            isActive: !item.isActive
        };
        toggleMutation.mutate(payload);
    };

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
        setSearchTerm: handleSearch,
        setCurrentPage: handlePageChange,
        setPageSize: handlePageSizeChange,
        setActiveFilter: (val: boolean) => {
            setActiveFilter(val);
            setCurrentPage(1);
        },
        setSortFilter,
        refresh: refetch,
        
        // Actions
        handleDeleteClick,
        confirmDelete,
        handleToggleStatus,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isActionLoading: deleteMutation.isPending || toggleMutation.isPending,
        
        // Sorting
        toggleSort,
        getSortIcon
    };
};
