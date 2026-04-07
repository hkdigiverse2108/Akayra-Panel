import React, { useMemo, useState } from 'react';
import Card from '../Components/Card';
import TableToolbar from '../Components/TableToolbar';
import TableFooter from '../Components/TableFooter';
import { getSrNo } from '../Utils/tableUtils';
import { Eye } from 'lucide-react';
import { Queries } from '../Api/Queries';

const OrderManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'All'>(10);
  const [searchTerm, setSearchTerm] = useState('');

  const params = useMemo(() => ({
    page: pageSize === 'All' ? undefined : currentPage,
    limit: pageSize === 'All' ? undefined : pageSize,
    search: searchTerm?.trim() || undefined,
  }), [currentPage, pageSize, searchTerm]);

  const { data: response, isLoading: loading } = Queries.useGetOrders(params);
  const orderItems = Array.isArray(response?.data?.order_data) ? response?.data?.order_data : [];
  const total = response?.data?.totalData || 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Order Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Review recent purchases and order status at a glance.</p>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search by order id or email..."
          showActiveFilter={false}
        />

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16">Sr. No.</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Order ID</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Customer</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Phone</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Total Amount</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Payment</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Order Status</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Created</th>
                <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
              {loading && orderItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading orders...</td>
                </tr>
              ) : orderItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">No orders found.</td>
                </tr>
              ) : (
                orderItems.map((order: any, index: number) => {
                  const orderId = order?.orderId || '--';
                  const itemCount = order?.items?.length ?? 0;
                  const createdAt = order?.createdAt
                    ? new Date(order.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : '--';
                  const paymentStatus = order?.paymentStatus || 'Pending';
                  const orderStatus = order?.orderStatus || 'Pending';
                  const totalAmount = order?.total;
                  const customerName = order?.userId?.firstName
                    ? `${order?.userId?.firstName} ${order?.userId?.lastName || ''}`.trim()
                    : '--';
                  const customerEmail = order?.userId?.email || '--';
                  const phone = order?.phone;
                  const customerPhone = typeof phone === 'object' && phone?.countryCode && phone?.number
                    ? `${phone.countryCode} ${phone.number}`
                    : (typeof phone === 'string' || typeof phone === 'number' ? phone : 'N/A');

                  return (
                    <tr key={orderId} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                      <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm">
                        {getSrNo(currentPage, pageSize, index)}
                      </td>
                      <td className="px-4 sm:px-8 py-5">
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">#{orderId}</p>
                          <p className="text-xs font-medium text-slate-400">{itemCount} items</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5">
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{customerName}</p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {customerPhone}
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-sm font-black text-slate-900 dark:text-white">
                        {typeof totalAmount === 'number'
                          ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalAmount)
                          : '--'}
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {paymentStatus}
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {orderStatus}
                      </td>
                      <td className="px-4 sm:px-8 py-5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          <span className="text-slate-400">Created:</span>
                          {createdAt}
                        </span>
                      </td>
                      <td className="px-4 sm:px-8 py-5 text-right">
                        <button type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-bold border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TableFooter
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          resourceName="orders"
        />
      </Card>
    </div>
  );
};

export default OrderManagement;
