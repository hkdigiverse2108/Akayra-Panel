import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../Components/Card";
import Button from "../../../Components/Button";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, ShoppingCart, TrendingUp, Zap, ImageIcon, X, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useManagementData } from "../../../Utils/Hooks/useManagementData";
import TableToolbar from "../../../Components/TableToolbar";
import TableFooter from "../../../Components/TableFooter";
import ConfirmModal from "../../../Components/ConfirmModal";
import { getSrNo } from "../../../Utils/tableUtils";
import { cn } from "../../../Utils/cn";
import { Image, Tag, Badge, Tooltip, Modal } from "antd";
import ProductFilters, { type ProductFilterValues } from "../../../Components/ProductFilters";
import { Queries } from "../../../Api/Queries";
import { KEYS, URL_KEYS, ROUTES } from "../../../Constants";

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [filterValues, setFilterValues] = useState<ProductFilterValues>({});

  const { data: catRes } = Queries.useGetCategory();
  const { data: brandRes } = Queries.useGetBrand();
  const { data: sizeRes } = Queries.useGetSize();
  const { data: colorRes } = Queries.useGetColor();

  const categories = useMemo(() => catRes?.data?.category_data || [], [catRes]);
  const brands = useMemo(() => brandRes?.data?.brand_data || [], [brandRes]);
  const sizes = useMemo(() => sizeRes?.data?.size_data || [], [sizeRes]);
  const colors = useMemo(() => colorRes?.data?.color_data || [], [colorRes]);

  const {
    items: products,
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
    setSortFilter,
    handleDeleteClick,
    confirmDelete,
    handleToggleStatus,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isActionLoading,
    toggleSort,
    getSortIcon,
  } = useManagementData({
    resourceKey: KEYS.PRODUCT.ALL,
    resourceUrl: URL_KEYS.PRODUCT.ALL,
    idField: "productId",
    dataKey: "product_data",
    extraParams: {
      categoryId: filterValues.categoryId,
      brandId: filterValues.brandId,
      sizeIds: filterValues.sizeIds,
      colorIds: filterValues.colorIds,
      minPrice: filterValues.minPrice,
      maxPrice: filterValues.maxPrice,
      inStockOnly: filterValues.inStock ? 1 : undefined,
      isTrending: filterValues.isTrending ? 1 : undefined,
      isDealOfDay: filterValues.isDealOfDay ? 1 : undefined,
    },
  });

  const getCoverImage = (product: any) => product?.thumbnail || product?.image || product?.thumbnailUrl;

  const handleImageError = (id: string | undefined) => {
    if (!id) return;
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const openImageModal = (imageUrl: string, title?: string, images?: string[]) => {
    const list = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];
    const startIndex = Math.max(0, list.indexOf(imageUrl));
    setActiveImages(list);
    setActiveImageIndex(startIndex);
    setActiveImage(imageUrl || list[0] || null);
    setActiveTitle(title || "Product Image");
    setIsImageModalOpen(true);
  };

  const handleThumbClick = (index: number) => {
    const next = activeImages[index];
    if (!next) return;
    setActiveImage(next);
    setActiveImageIndex(index);
  };

  const handlePrevImage = () => {
    if (!activeImages.length) return;
    const nextIndex = (activeImageIndex - 1 + activeImages.length) % activeImages.length;
    handleThumbClick(nextIndex);
  };

  const handleNextImage = () => {
    if (!activeImages.length) return;
    const nextIndex = (activeImageIndex + 1) % activeImages.length;
    handleThumbClick(nextIndex);
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Product Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Manage your catalog, stock, and pricing.</p>
        </div>
        <Button onClick={() => navigate(`${ROUTES.PRODUCTS}/add`)} className="h-10 sm:h-12 px-6 rounded-2xl flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black shadow-lg shadow-primary-500/20 w-full md:w-auto">
          <Plus size={20} /> Add Product
        </Button>
      </div>

      <ProductFilters
        value={filterValues}
        onApply={(next) => {
          setFilterValues(next);
          setSortFilter(next.sortFilter || "");
          setCurrentPage(1);
        }}
        onClear={() => {
          setFilterValues({});
          setSortFilter("");
          setCurrentPage(1);
        }}
        categories={categories}
        brands={brands}
        sizes={sizes}
        colors={colors}
      />

      <Card className="!p-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border-0 bg-white dark:bg-slate-900">
        <TableToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search products..." activeFilter={activeFilter} onActiveFilterChange={setActiveFilter} showViewToggle viewType={viewType} onViewTypeChange={setViewType} />

        {viewType === "list" ? (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-4 sm:px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 w-16 hidden sm:table-cell">Sr. No.</th>
                  <th className="px-4 sm:px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort("title")}>
                      Product
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">{getSortIcon("title")}</div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden lg:table-cell">SKU</th>
                  <th className="px-4 sm:px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 hidden md:table-cell">Stock</th>
                  <th className="px-4 sm:px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 group cursor-pointer select-none" onClick={() => toggleSort("price")}>
                      Price
                      <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-800 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-slate-700">{getSortIcon("price")}</div>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-left">
                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic tracking-wider">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product: any, index: number) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                      <td className="px-4 sm:px-6 py-5 font-black text-slate-400 text-sm hidden sm:table-cell">{getSrNo(currentPage, pageSize, index)}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3 sm:gap-4 text-left">
                          <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-700 shrink-0">
                            {getCoverImage(product) && !brokenImages[product._id] ? (
                              <button type="button" onClick={() => openImageModal(getCoverImage(product), product.title, [getCoverImage(product), ...(product.images || [])].filter(Boolean))} className="relative h-full w-full cursor-pointer group/thumb" title="View image">
                                <Image src={getCoverImage(product)} alt={product.title} className="h-full w-full object-cover" preview={false} onError={() => handleImageError(product._id)} />
                                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                                    <ImageIcon size={14} />
                                  </div>
                                </div>
                              </button>
                            ) : (
                              <ShoppingCart size={20} className="text-slate-300" />
                            )}
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mb-1 truncate max-w-[120px] sm:max-w-[200px]">{product.title}</p>
                            <div className="flex items-center gap-2">
                              {product.isTrending && <Badge status="processing" text={<span className="text-[10px] font-bold text-orange-500 uppercase">Trend</span>} />}
                              {product.isDealOfDay && <Badge status="warning" text={<span className="text-[10px] font-bold text-yellow-500 uppercase">Deal</span>} />}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400 uppercase hidden lg:table-cell">{product.sku}</td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <Tag color={product.stock > 10 ? "green" : product.stock > 0 ? "orange" : "red"} className="border-0 font-bold rounded-full px-2 text-[10px]">
                          {product.stock} IN STOCK
                        </Tag>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-left">
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-black text-primary-600">₹{product.sellingPrice}</span>
                          <span className="text-[10px] text-slate-400 line-through">₹{product.mrp}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <Tooltip title={product.isActive ? "Deactivate" : "Activate"}>
                            <button onClick={() => handleToggleStatus(product)} disabled={isActionLoading} className={cn("p-2 rounded-xl transition-all shadow-sm", product.isActive ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20" : "text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700")}>
                              {product.isActive ? <ToggleRight size={20} className="sm:w-6 sm:h-6" /> : <ToggleLeft size={20} className="sm:w-6 sm:h-6" />}
                            </button>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <button onClick={() => navigate(`${ROUTES.PRODUCTS}/edit/${product._id}`)} className="p-2 bg-primary-50 hover:bg-primary-100 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl transition-all shadow-sm">
                              <Edit size={18} className="sm:w-5 sm:h-5" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <button onClick={() => handleDeleteClick(product._id)} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all shadow-sm">
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
          <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {loading && products.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider animate-pulse">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic tracking-wider">No products found.</div>
            ) : (
              products.map((product: any) => (
                <div key={product._id} className="group bg-gray-50/50 dark:bg-slate-800/30 rounded-[32px] border border-gray-100 dark:border-slate-800 overflow-hidden hover:border-primary-500/30 transition-all flex flex-col h-full shadow-sm">
                  <div className="relative aspect-square overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                    {getCoverImage(product) && !brokenImages[product._id] ? (
                      <button type="button" onClick={() => openImageModal(getCoverImage(product), product.title, [getCoverImage(product), ...(product.images || [])].filter(Boolean))} className="relative h-full w-full cursor-pointer group/thumb" title="View image">
                        <Image src={getCoverImage(product)} alt={product.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" preview={false} onError={() => handleImageError(product._id)} />
                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                          <div className="h-8 w-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                            <ImageIcon size={16} />
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                        <ShoppingCart size={48} className="text-slate-200" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isTrending && (
                        <div className="bg-orange-500 text-white p-2 rounded-xl shadow-lg ring-4 ring-orange-500/20 animate-bounce">
                          <TrendingUp size={16} />
                        </div>
                      )}
                      {product.isDealOfDay && (
                        <div className="bg-yellow-500 text-white p-2 rounded-xl shadow-lg ring-4 ring-yellow-500/20">
                          <Zap size={16} />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button onClick={() => navigate(`${ROUTES.PRODUCTS}/edit/${product._id}`)} className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-primary-600 rounded-2xl shadow-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteClick(product._id)} className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-red-600 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Tag color={product.stock > 0 ? "green" : "red"} className="border-0 font-black rounded-full px-3 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px]">
                        {product.stock > 0 ? `${product.stock} UNITS` : "OUT OF STOCK"}
                      </Tag>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 text-left">
                    <div className="mb-4 text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.sku}</p>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight line-clamp-2">{product.title}</h3>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-left">
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-black text-primary-600 tracking-tight">₹{product.sellingPrice}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{product.mrp}</span>
                      </div>
                      <button onClick={() => handleToggleStatus(product)} disabled={isActionLoading} className={cn("h-10 w-10 rounded-2xl flex items-center justify-center transition-all shadow-sm", product.isActive ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20" : "bg-slate-100 text-slate-400 dark:bg-slate-800")} title={product.isActive ? "Deactivate" : "Activate"}>
                        {product.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <TableFooter currentPage={currentPage} pageSize={pageSize} total={total} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} resourceName="products" />
      </Card>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={isActionLoading} message="Are you sure you want to delete this product? This action cannot be undone." />

      <Modal open={isImageModalOpen} onCancel={() => setIsImageModalOpen(false)} footer={null} centered closable closeIcon={<X size={16} />} width={520} destroyOnClose className="product-image-modal">
        <div className="space-y-3">
          <div className="text-base font-black text-slate-900 dark:text-white">{activeTitle}</div>
          {activeImage ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Image src={activeImage} alt={activeTitle} preview={false} className="rounded-2xl object-contain max-h-[60vh] max-w-full" />
              </div>
              {activeImages.length > 1 && (
                <div className="relative px-4">
                  <button type="button" onClick={handlePrevImage} className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center" style={{ width: 34, height: 34, fontSize: 20, lineHeight: 1 }}>
                    <ArrowLeftCircle />
                  </button>
                  <div className="mx-auto flex w-full flex-nowrap gap-2 overflow-x-auto pb-2 pr-2 scrollbar-hide scroll-smooth" style={{ maxWidth: 320 }}>
                    {activeImages.map((img, index) => (
                      <button key={`${img}-${index}`} type="button" onClick={() => handleThumbClick(index)} className={`h-16 w-16 shrink-0 rounded-xl overflow-hidden border ${img === activeImage ? "border-primary-500" : "border-slate-200 dark:border-slate-800"}`}>
                        <img src={img} alt="thumb" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={handleNextImage} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center" style={{ width: 34, height: 34, fontSize: 20, lineHeight: 1 }}>
                    <ArrowRightCircle />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">No image available.</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;
