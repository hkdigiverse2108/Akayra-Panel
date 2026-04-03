import React, { useEffect, useMemo, useState } from "react";
import { Select, Switch, InputNumber } from "antd";
import { ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import Button from "./Button";
import { cn } from "../Utils/cn";

const { Option } = Select;

export interface ProductFilterValues {
  categoryId?: string;
  brandId?: string;
  sizeIds?: string[];
  colorIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isTrending?: boolean;
  isDealOfDay?: boolean;
  sortFilter?: string;
}

interface ProductFiltersProps {
  value: ProductFilterValues;
  onApply: (value: ProductFilterValues) => void;
  onClear: () => void;
  categories: any[];
  brands: any[];
  sizes: any[];
  colors: any[];
}

const buildLabel = (item: any) => item?.name || item?.title || "Unnamed";

const countActiveFilters = (value: ProductFilterValues) => {
  return [  value.categoryId,  value.brandId,  value.sizeIds?.length,  value.colorIds?.length,  value.minPrice !== undefined && value.minPrice !== null,  value.maxPrice !== undefined && value.maxPrice !== null,  value.inStock,  value.isTrending,  value.isDealOfDay, ].filter(Boolean).length;
};

const ProductFilters: React.FC<ProductFiltersProps> = ({ value, onApply, onClear, categories, brands, sizes, colors, }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<ProductFilterValues>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const activeCount = useMemo(() => countActiveFilters(value), [value]);

  const applyFilters = () => {
    const next = { ...draft };
    if (next.minPrice !== undefined && next.maxPrice !== undefined && next.minPrice > next.maxPrice) {
      const temp = next.minPrice;
      next.minPrice = next.maxPrice;
      next.maxPrice = temp;
    }
    onApply(next);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-lg overflow-hidden">
      <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left" >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Advanced Filters</p>
              {activeCount > 0 && (
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-primary-500/10 text-primary-600">
                  {activeCount} Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-semibold">Refine catalog with premium filters.</p>
          </div>
        </div>
        <div className={cn("h-9 w-9 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 transition-all", isOpen && "rotate-180 bg-slate-50 dark:bg-slate-800")}>
          <ChevronDown size={16} />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-6 pb-5 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
              <Select value={draft.categoryId} onChange={(val) => setDraft((prev) => ({ ...prev, categoryId: val }))} allowClear showSearch placeholder="Select category" size="large" className="w-full" >
                {categories.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {buildLabel(item)}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand</p>
              <Select value={draft.brandId} onChange={(val) => setDraft((prev) => ({ ...prev, brandId: val }))} allowClear showSearch placeholder="Select brand" size="large" className="w-full" >
                {brands.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {buildLabel(item)}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sizes</p>
              <Select mode="multiple" value={draft.sizeIds} onChange={(val) => setDraft((prev) => ({ ...prev, sizeIds: val }))} showSearch placeholder="Select sizes" size="large" className="w-full" >
                {sizes.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {buildLabel(item)}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Colors</p>
              <Select mode="multiple" value={draft.colorIds} onChange={(val) => setDraft((prev) => ({ ...prev, colorIds: val }))} showSearch placeholder="Select colors" size="large" className="w-full" >
                {colors.map((item) => (
                  <Option key={item._id} value={item._id}>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full border border-slate-200" style={{ backgroundColor: item.hexCode || "#cbd5f5" }} />
                      {buildLabel(item)}
                    </span>
                  </Option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By</p>
              <Select value={draft.sortFilter} onChange={(val) => setDraft((prev) => ({ ...prev, sortFilter: val }))} allowClear showSearch placeholder="Default" size="large" className="w-full" >
                <Option value="titleAsc">Name (A-Z)</Option>
                <Option value="titleDesc">Name (Z-A)</Option>
                <Option value="priceAsc">Price (Low to High)</Option>
                <Option value="priceDesc">Price (High to Low)</Option>
                <Option value="ratingDesc">Rating (High to Low)</Option>
              </Select>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Range</p>
              <div className="grid grid-cols-2 gap-3">
                <InputNumber  controls={false}  value={draft.minPrice}  onChange={(val) => setDraft((prev) => ({ ...prev, minPrice: val ?? undefined }))}  placeholder="Min"  className="w-full h-11 rounded-xl" />
                <InputNumber controls={false} value={draft.maxPrice} onChange={(val) => setDraft((prev) => ({ ...prev, maxPrice: val ?? undefined }))} placeholder="Max" className="w-full h-11 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
              <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">In Stock Only</span>
                <Switch checked={!!draft.inStock} onChange={(checked) => setDraft((prev) => ({ ...prev, inStock: checked }))} className={draft.inStock ? "bg-primary-500" : "bg-slate-300"} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highlights</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Trending</span>
                  <Switch checked={!!draft.isTrending} onChange={(checked) => setDraft((prev) => ({ ...prev, isTrending: checked }))} className={draft.isTrending ? "bg-primary-500" : "bg-slate-300"} />
                </div>
                <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Deal of Day</span>
                  <Switch checked={!!draft.isDealOfDay} onChange={(checked) => setDraft((prev) => ({ ...prev, isDealOfDay: checked }))} className={draft.isDealOfDay ? "bg-primary-500" : "bg-slate-300"} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <Sparkles size={14} className="text-primary-500" />
              Tip: Apply filters to refresh the product list instantly.
            </div>
            <div className="flex items-center gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => { setDraft({}); onClear(); }} className="h-10 px-5 rounded-xl border border-slate-200 dark:border-slate-700" >
                Clear
              </Button>
              <Button type="button" onClick={applyFilters} className="h-10 px-6 rounded-xl shadow-lg shadow-primary-500/20" >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;