import React, { useMemo, useRef, useState } from "react";
import { Modal } from "antd";
import { Check, ImageIcon, UploadCloud, X } from "lucide-react";
import Button from "./Button";
import { cn } from "../Utils/cn";
import { useUpload, type UploadItem } from "../Utils/Hooks/useUpload";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (items: UploadItem[]) => void;
  existingImages?: UploadItem[];
  isLoadingExisting?: boolean;
  folder?: string;
  multiple?: boolean;
  title?: string;
}

const fileKey = (item: UploadItem) => item.url || item.path || item.fileName;

const formatBytes = (bytes: number) => {
  if (!bytes && bytes !== 0) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 100 || i === 0 ? 0 : 2)} ${sizes[i]}`;
};

const UploadImage: React.FC<UploadImageModalProps> = ({ isOpen, onClose, onSelect, existingImages = [], isLoadingExisting = false, folder, multiple = true, title = "Media Library", }) => {
  const [activeTab, setActiveTab] = useState<"existing" | "upload">("existing");
  const [selectedItems, setSelectedItems] = useState<UploadItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedItems, setUploadedItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, deleteImage, useGetAllImages } = useUpload();
  const { data: allImagesResponse, isLoading: loadingAllImages } = useGetAllImages(folder, {enabled: isOpen,});

  const fetchedImages = (allImagesResponse as any)?.data || [];

  const selectedKeys = useMemo(() => {
    return new Set(selectedItems.map(fileKey));
  }, [selectedItems]);

  const combinedExistingImages = useMemo(() => {
    const map = new Map<string, UploadItem>();
    const sources = [...existingImages, ...fetchedImages];
    sources.forEach((item) => map.set(fileKey(item), item));
    uploadedItems.forEach((item) => map.set(fileKey(item), item));
    return Array.from(map.values());
  }, [existingImages, fetchedImages, uploadedItems]);

  const mergeSelection = (items: UploadItem[]) => {
    setSelectedItems((prev) => {
      const map = new Map(prev.map((item) => [fileKey(item), item]));
      items.forEach((item) => map.set(fileKey(item), item));
      return Array.from(map.values());
    });
  };

  const toggleSelect = (item: UploadItem) => {
    const key = fileKey(item);
    setSelectedItems((prev) => {
      const exists = prev.some((current) => fileKey(current) === key);
      if (exists) {
        return prev.filter((current) => fileKey(current) !== key);
      }
      if (!multiple) {
        return [item];
      }
      return [...prev, item];
    });
  };

  const addFiles = (files: FileList | File[]) => {
    const next = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!next.length) return;

    setSelectedFiles((prev) => {
      const existingKeys = new Set(prev.map((file) => `${file.name}-${file.size}`));
      const unique = next.filter((file) => !existingKeys.has(`${file.name}-${file.size}`));
      return [...prev, ...unique];
    });
  };

  const removeSelectedFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((item) => item !== file));
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || isUploading) return;
    setIsUploading(true);

    try {
      const results = await Promise.allSettled(
        selectedFiles.map((file) => {
          const formData = new FormData();
          formData.append("image", file);
          return uploadImage.mutateAsync(formData);
        })
      );
      const uploaded = results.filter((result) => result.status === "fulfilled").map((result) => (result as PromiseFulfilledResult<any>).value?.data).filter(Boolean) as UploadItem[];

      if (uploaded.length) {
        setUploadedItems((prev) => {
          const map = new Map(prev.map((item) => [fileKey(item), item]));
          uploaded.forEach((item) => map.set(fileKey(item), item));
          return Array.from(map.values());
        });
        mergeSelection(uploaded);
      }

      setSelectedFiles([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (item: UploadItem) => {
    const pathOrUrl = item.url || item.path;
    if (!pathOrUrl) return;
    await deleteImage.mutateAsync(pathOrUrl);
    setUploadedItems((prev) => prev.filter((img) => fileKey(img) !== fileKey(item)));
    setSelectedItems((prev) => prev.filter((img) => fileKey(img) !== fileKey(item)));
  };

  const handleSave = () => {
    if (onSelect) {
      onSelect(selectedItems);
    }
    onClose();
  };

  const renderGallery = () => {
    if (isLoadingExisting || loadingAllImages) {
      return (
        <div className="h-56 flex items-center justify-center text-slate-400 text-sm font-semibold">
          Loading gallery...
        </div>
      );
    }

    if (!combinedExistingImages.length) {
      return (
        <div className="h-56 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm font-semibold">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ImageIcon size={20} />
          </div>
          No images found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[360px] overflow-auto pr-1">
        {combinedExistingImages.map((item) => {
          const selected = selectedKeys.has(fileKey(item));
          return (
            <button type="button" key={fileKey(item)} onClick={() => toggleSelect(item)} className={cn( "group relative overflow-hidden rounded-2xl border transition-all bg-white dark:bg-slate-900", selected ? "border-primary-500 ring-2 ring-primary-200 dark:ring-primary-500/40" : "border-slate-200 dark:border-slate-800 hover:border-slate-300" )} >
              <span className="absolute left-2 top-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={(event) => { event.stopPropagation(); handleDeleteImage(item); }} className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 flex items-center justify-center shadow-sm">
                  <X size={14} />
                </button>
              </span>
              <img src={item.url || item.path} alt={item.fileName} className="h-28 w-full object-cover" />
              <div className="px-3 py-2 text-left">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {item.fileName}
                </p>
                <p className="text-[10px] text-slate-400">{formatBytes(item.size)}</p>
              </div>
              {selected && (
                <span className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
                  <Check size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} centered width={980} className="message-modal" closeIcon={<X size={18} />} >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800">
          {[
            { key: "existing", label: "Select Existing" },
            { key: "upload", label: "Upload New" },
          ].map((tab) => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key as "existing" | "upload")} className={cn( "pb-3 text-sm font-semibold transition-colors", activeTab === tab.key ? "text-slate-900 dark:text-white border-b-2 border-primary-500" : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200" )} >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "existing" && (
          <div className="min-h-[360px]">{renderGallery()}</div>
        )}

        {activeTab === "upload" && (
          <div className="space-y-6">
            <div className={cn( "border-2 border-dashed rounded-3xl p-10 text-center transition-colors", isDragging ? "border-primary-500 bg-primary-50/60 dark:bg-primary-500/10" : "border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40" )}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                if (event.dataTransfer?.files?.length) {
                  addFiles(event.dataTransfer.files);
                }
              }}
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500">
                <UploadCloud size={26} />
              </div>
              <p className="mt-4 text-base font-semibold text-slate-700 dark:text-slate-200">
                Drag and drop images here
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                PNG, JPG, JPEG, WEBP
              </p>
              <Button type="button" className="mt-5 h-11 px-6 rounded-2xl" onClick={() => fileInputRef.current?.click()} >
                Browse Files
              </Button>
              <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/jpg, image/webp" multiple className="hidden" onChange={(event) => { if (event.target.files?.length) { addFiles(event.target.files); event.target.value = ""; } }} />
            </div>

            {selectedFiles.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Selected Files ({selectedFiles.length})
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedFiles.map((file) => (
                    <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950" >
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatBytes(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(file)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={handleUpload} loading={isUploading || uploadImage.isPending} className="h-11 px-6 rounded-2xl" disabled={!selectedFiles.length} >
                    Upload Images
                  </Button>
                </div>
              </div>
            )}

            {uploadedItems.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                  Uploaded Files
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedItems.map((item) => {
                    const selected = selectedKeys.has(fileKey(item));
                    return (
                      <button type="button" key={fileKey(item)} onClick={() => toggleSelect(item)} className={cn( "group relative overflow-hidden rounded-2xl border transition-all bg-white dark:bg-slate-900", selected ? "border-primary-500 ring-2 ring-primary-200 dark:ring-primary-500/40" : "border-slate-200 dark:border-slate-800 hover:border-slate-300" )} >
                        <span className="absolute left-2 top-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={(event) => { event.stopPropagation(); handleDeleteImage(item); }} className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 flex items-center justify-center shadow-sm" >
                            <X size={14} />
                          </button>
                        </span>
                        <img src={item.url || item.path} alt={item.fileName} className="h-24 w-full object-cover" />
                        <div className="px-3 py-2 text-left">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {item.fileName}
                          </p>
                        </div>
                        {selected && (
                          <span className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
                            <Check size={14} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} className="h-10 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300" >
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-10 px-6 rounded-xl shadow-lg shadow-primary-500/20" >
            Save Selection
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadImage;
