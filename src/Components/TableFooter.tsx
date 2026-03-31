import React from 'react';
import { Pagination, Select } from 'antd';
const { Option } = Select;

interface TableFooterProps {
    currentPage: number;
    pageSize: number | 'All';
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number | 'All') => void;
    resourceName?: string;
}

const TableFooter: React.FC<TableFooterProps> = ({
    currentPage,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    resourceName = 'records'
}) => {
    return (
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Page Size Selector */}
            <div className="flex items-center gap-4 order-2 md:order-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Show Records:</span>
                <Select
                    value={pageSize}
                    onChange={onPageSizeChange}
                    className="w-24 custom-select"
                    size="large"
                >
                    <Option value={10}>10</Option>
                    <Option value={30}>30</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                    <Option value="All">All</Option>
                </Select>
            </div>

            {/* Pagination / Record Count */}
            <div className="order-1 md:order-2">
                {pageSize !== 'All' ? (
                    <Pagination
                        current={currentPage}
                        total={total}
                        pageSize={pageSize as number}
                        onChange={onPageChange}
                        showSizeChanger={false}
                        className="custom-pagination"
                    />
                ) : (
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all animate-in fade-in zoom-in duration-300">
                        Showing {total} of {total} {resourceName}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TableFooter;
