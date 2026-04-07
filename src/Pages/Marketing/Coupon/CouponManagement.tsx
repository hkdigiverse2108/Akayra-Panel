import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Card from "../../../Components/Card";
import TableToolbar from "../../../Components/TableToolbar";
import TableFooter from "../../../Components/TableFooter";
import ConfirmModal from "../../../Components/ConfirmModal";
import Button from "../../../Components/Button";
import { useManagementData } from "../../../Utils/Hooks/useManagementData";
import { getSrNo } from "../../../Utils/tableUtils";
import { Ticket, Tag, Calendar, Users, Trash2, ToggleLeft, ToggleRight, Edit, Plus, CheckCircle, XCircle } from "lucide-react";
import { Tooltip } from "antd";
import { KEYS, URL_KEYS, ROUTES } from "../../../Constants";
import { Mutations } from "../../../Api/Mutations";
import { cn } from "../../../Utils/cn";

const CouponManagement: React.FC = () => {
  //state and hooks
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("list");

  //data fetching
  const {
    items: coupons,
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
    resourceKey: KEYS.COUPON.ALL,
    resourceUrl: URL_KEYS.COUPON.ALL,
    dataKey: "coupon_data",
    useActiveFilter: true,
  });

  //mutations delete / edit / add
  const deleteMutation = Mutations.useDeleteCoupon();
  const editMutation = Mutations.useEditCoupon();
  const isActionLoading = editMutation.isPending;

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.COUPON.ALL] });
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const handleToggleStatus = (item: any) => {
    const couponId = item?.couponId || item?._id || item?.id;
    if (!couponId) return;
    editMutation.mutate({ couponId, isActive: !item?.isActive });
  };

  const getCode = (item: any) => item?.code || item?.couponCode || item?.coupon_code || item?.name || "N/A";
  const getDiscountPercent = (item: any) => item?.discountPercent ?? item?.discount_percent ?? null;
  const getDiscountAmount = (item: any) => item?.discountAmount ?? item?.discount_amount ?? null;
  const getTypeLabel = (item: any) => {
    const type = (item?.type || "").toString();
    if (type === "percentOff") return "Percent Off";
    if (type === "flatOff") return "Flat Off";
    if (type === "buyXgetY") return "Buy X Get Y";
    if (type === "prepaidDiscount") return "Prepaid Discount";
    return type || "-";
  };
  const getDiscountValue = (item: any) => {
    const type = (item?.type || "").toString();
    if (type === "percentOff") {
      const val = getDiscountPercent(item);
      return val !== null && val !== undefined && val !== "" ? `${val}%` : "-";
    }
    if (type === "flatOff" || type === "prepaidDiscount") {
      const val = getDiscountAmount(item);
      return val !== null && val !== undefined && val !== "" ? `₹${val}` : "-";
    }
    return "-";
  };
  const badgeTone = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  const getProductsLabel = (item: any) => {
    const list = Array.isArray(item?.productIds) ? item.productIds : [];
    if (list.length === 0) return "-";
    const names = list.map((p: any) => p?.title || p?.name || p?._id || p).filter(Boolean);
    const head = names.slice(0, 4);
    const extra = names.length - head.length;
    return extra > 0 ? `${head.join(", ")} +${extra}` : head.join(", ");
  };
  const getProductsCount = (item: any) => (Array.isArray(item?.productIds) ? item.productIds.length : 0);
  const getValidity = (item: any) => {
    const start = item?.startDate || item?.validFrom || item?.startAt;
    const end = item?.endDate || item?.validTill || item?.expireAt || item?.expiryDate;
    const format = (date: any) => (date ? new Date(date).toLocaleDateString() : null);
    const startLabel = format(start);
    const endLabel = format(end);
    if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
    if (endLabel) return `Till ${endLabel}`;
    if (startLabel) return `From ${startLabel}`;
    return item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-";
  };
  const getUsage = (item: any) => {
    const used = item?.usedCount ?? item?.usageCount ?? item?.used ?? 0;
    const limit = item?.usageLimit ?? item?.maxUsage ?? item?.limit;
    if (limit === undefined || limit === null || limit === "") return `${used} / -`;
    return `${used} / ${limit}`;
  };
  const isActive = (item: any) => !!item?.isActive;

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Coupon Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Manage discount codes, usage limits, and validity.</p>
        </div>
        <Button onClick={() => navigate(`${ROUTES.COUPONS}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto">
          <Plus size={20} /> Add Coupon
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
        <TableToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search coupons..." showActiveFilter activeFilter={activeFilter} onActiveFilterChange={setActiveFilter} showViewToggle viewType={viewType} onViewTypeChange={setViewType} />

        {viewType === "list" ? (
          <div className="overflow-x-auto scrollbar-hide w-full max-w-full pb-2">
            <table className="w-full text-left border-collapse min-w-[2000px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">Sr. No.</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort("code")}>
                      Coupon
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">{getSortIcon("code")}</div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Type</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Discount</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Buy Qty</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Free Qty</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Min Order</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Max Cap</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Products</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Expiry</th>
                  <th className="px-4 sm:px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                {loading && coupons.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">
                      Loading coupons...
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">
                      No coupons found.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon: any, index: number) => {
                    const couponId = coupon?._id || coupon?.id;
                    return (
                      <tr key={couponId || index} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                        <td className="px-4 sm:px-8 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">{getSrNo(currentPage, pageSize, index)}</td>
                        <td className="px-4 sm:px-8 py-5">
                          <div className="flex items-center gap-3 sm:gap-4 text-left">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                              <Ticket className="text-slate-300" size={20} />
                            </div>
                            <div className="text-left overflow-hidden">
                              <p className="text-sm font-black text-slate-900 dark:text-white leading-snug pb-0.5 uppercase tracking-widest truncate max-w-[200px] sm:max-w-xs">{getCode(coupon)}</p>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 truncate max-w-[220px] sm:max-w-xs">
                                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", badgeTone)}>
                                  <Tag size={10} /> {getTypeLabel(coupon)}
                                </span>
                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", badgeTone)}>{getDiscountValue(coupon)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 md:hidden truncate max-w-[220px] sm:max-w-xs">
                                {isActive(coupon) ? <CheckCircle size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-400" />}
                                <span className="truncate">{isActive(coupon) ? "Active" : "Inactive"}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>
                            <Tag size={12} /> {getTypeLabel(coupon)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>{getDiscountValue(coupon)}</span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>{coupon?.type === "buyXgetY" ? (coupon?.buyQty ?? "-") : "-"}</span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>{coupon?.type === "buyXgetY" ? (coupon?.getFreeQty ?? "-") : "-"}</span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>{coupon?.minOrderAmount ?? "-"}</span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>{coupon?.maxDiscountCap ?? "-"}</span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>{getProductsCount(coupon)} Items</span>
                        </td>
                        <td className="px-4 sm:px-8 py-5">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", badgeTone)}>
                            <Calendar size={12} /> {getValidity(coupon)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                            <Tooltip title={isActive(coupon) ? "Deactivate" : "Activate"}>
                              <button onClick={() => handleToggleStatus(coupon)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", isActive(coupon) ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                                {isActive(coupon) ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                              </button>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <button onClick={() => couponId && navigate(`${ROUTES.COUPONS}/edit/${couponId}`, { state: { coupon } })} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                                <Edit size={18} className="sm:w-5 sm:h-5" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <button onClick={() => couponId && handleDeleteClick(couponId)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
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
            {loading && coupons.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading coupons...</div>
            ) : coupons.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No coupons found.</div>
            ) : (
              coupons.map((coupon: any, index: number) => {
                const couponId = coupon?._id || coupon?.id;
                return (
                  <div key={couponId || index} className="group relative bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center">
                          <Ticket className="text-slate-300" size={22} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest line-clamp-1">{getCode(coupon)}</h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                            <Tag size={12} />
                            Discount {getDiscountValue(coupon)}
                          </p>
                        </div>
                      </div>
                      <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", isActive(coupon) ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-400 bg-slate-100 dark:bg-slate-800")}>{isActive(coupon) ? "Active" : "Inactive"}</div>
                    </div>

                    <div className="mt-4 space-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} /> {getValidity(coupon)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={12} /> Usage {getUsage(coupon)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5">
                      <Tooltip title={isActive(coupon) ? "Deactivate" : "Activate"}>
                        <button onClick={() => handleToggleStatus(coupon)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", isActive(coupon) ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                          {isActive(coupon) ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <button onClick={() => couponId && navigate(`${ROUTES.COUPONS}/edit/${couponId}`, { state: { coupon } })} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                          <Edit size={18} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <button onClick={() => couponId && handleDeleteClick(couponId)} disabled={deleteMutation.isPending} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
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

        <TableFooter currentPage={currentPage} pageSize={pageSize} total={total} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} resourceName="coupons" />
      </Card>
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={deleteMutation.isPending} message="Are you sure you want to delete this coupon? This action cannot be undone." />
    </div>
  );
};

export default CouponManagement;
