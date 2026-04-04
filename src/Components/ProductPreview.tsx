import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Tag, Badge } from 'antd';
import { ShoppingCart, Heart, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';
import { PreviewProps } from '../Types';


const ProductPreview: React.FC<PreviewProps> = ({ title, thumbnail, images, mrp, sellingPrice, sku, categoryName, brandName, sizes, colors, longDescription, isTrending, isDealOfDay, isActive,}) => {
  const allImages = useMemo(() => { const list = [thumbnail, ...(images || [])].filter(Boolean) as string[]; return Array.from(new Set(list)); }, [thumbnail, images]);
  const [activeImage, setActiveImage] = useState<string | undefined>(allImages[0]);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeImage && allImages.includes(activeImage)) {
      return;
    }
    setActiveImage(allImages[0]);
  }, [allImages, activeImage]);

  const heroImage = activeImage || allImages[0];
  const scrollThumbs = (direction: 'prev' | 'next') => {
    const container = thumbsRef.current;
    if (!container) {
      return;
    }
    const amount = Math.round(container.clientWidth * 0.7);
    container.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
   <div className="sticky top-20 mt-0 lg:mt-[60px]">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
        <div className="relative aspect-[4/5] bg-slate-50 dark:bg-slate-950">
          {heroImage ? (
            <Image src={heroImage} alt={title || 'Product'} preview={false} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ShoppingCart size={64} className="text-slate-200" />
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isTrending && <Badge status="processing" text={<span className="text-[10px] font-bold text-orange-500 uppercase">Trend</span>} />}
            {isDealOfDay && <Badge status="warning" text={<span className="text-[10px] font-bold text-yellow-500 uppercase">Deal</span>} />}
          </div>
          <div className="absolute top-4 right-4">
            <Tag color={isActive ? 'green' : 'red'} className="border-0 font-black rounded-full px-3 text-[10px]">
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </Tag>
          </div>
        </div>

        {allImages.length > 0 ? (
          <div className="relative px-4 pt-3">
            <button type="button" onClick={() => scrollThumbs('prev')} className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center" style={{ width: 34, height: 34, fontSize: 20, lineHeight: 1 }} >
              <ArrowLeftCircle />
            </button>
            <div ref={thumbsRef} className="mx-auto flex w-full flex-nowrap gap-2 overflow-x-auto pb-2 pr-2 scrollbar-hide scroll-smooth" style={{ maxWidth: 320 }} >
              {allImages.map((img) => (
                <button key={img} type="button" onClick={() => setActiveImage(img)} className={`h-16 w-16 shrink-0 rounded-xl overflow-hidden border ${img === heroImage ? 'border-primary-500' : 'border-slate-200 dark:border-slate-800'}`} >
                  <img src={img} alt="thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => scrollThumbs('next')} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center" style={{ width: 34, height: 34, fontSize: 20, lineHeight: 1 }} >
              <ArrowRightCircle />
            </button>
          </div>
        ) : (
          <div className="px-4 pt-3">
            <div className="flex gap-2">
              {['1', '2', '3'].map((key) => (
                <div
                  key={key}
                  className="h-16 w-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sku || 'SKU'}</p>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {title || 'Product Title'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {categoryName && <Tag className="rounded-full px-2 text-[10px]">{categoryName}</Tag>}
                {brandName && <Tag className="rounded-full px-2 text-[10px]">{brandName}</Tag>}
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-black text-primary-600">
              ₹{sellingPrice ?? 0}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{mrp ?? 0}
            </span>
          </div>
          <div className="pt-1 space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {(sizes && sizes.length > 0 ? sizes : ['—']).map((size) => (
                  <Tag key={size} className="rounded-full px-3">{size}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {(colors && colors.length > 0 ? colors : [{ name: '—' }]).map((color) => (
                  <Tag key={color.name} className="rounded-full px-3">
                    <span className="inline-flex items-center gap-2">
                      {color.hexCode && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color.hexCode }} />}
                      {color.name}
                    </span>
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="button" disabled className="h-10 flex-1 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-xs uppercase tracking-widest cursor-default pointer-events-none" >
              Add to Cart
            </button>
            <button  type="button"  disabled  className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-default pointer-events-none" >
              <Heart size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-black uppercase tracking-widest">
            <button type="button" onClick={() => setActiveTab('description')} className={activeTab === 'description' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 pb-2' : 'text-slate-400'} >
              Description
            </button>
            <button type="button" onClick={() => setActiveTab('additional')} className={activeTab === 'additional' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 pb-2' : 'text-slate-400'} >
              Additional Information
            </button>
          </div>

          <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300">
            {activeTab === 'description' ? (
              longDescription ? (
                <div dangerouslySetInnerHTML={{ __html: longDescription }} />
              ) : (
                <p>No description yet.</p>
              )
            ) : (
              <div className="not-prose">
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest w-32">SKU</th>
                        <td className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">{sku || '—'}</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">Color</th>
                        <td className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">{colors && colors.length > 0 ? colors.map((color) => color.name).join(', ') : '—'}</td>
                      </tr>
                      <tr>
                        <th className="px-4 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                        <td className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">{sizes && sizes.length > 0 ? sizes.join(', ') : '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
