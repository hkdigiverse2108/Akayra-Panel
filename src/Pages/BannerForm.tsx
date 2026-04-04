import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Switch, Image, Breadcrumb, DatePicker, InputNumber, Select, Modal } from "antd";
import { Queries } from "../Api/Queries";
import { Mutations } from "../Api/Mutations";
import Card from "../Components/Card";
import Button from "../Components/Button";
import UploadImage from "../Components/UploadImage";
import type { UploadItem } from "../Utils/Hooks/useUpload";
import { ArrowLeft, Save, ImageIcon, Link as LinkIcon, Layers, Calendar, Hash, X, Type, AlignLeft, MousePointerClick } from "lucide-react";
import { ROUTES } from "../Constants";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const BannerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEditMode = !!id;
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const imageUrl = Form.useWatch("image", form);
  const titleValue = Form.useWatch("title", form);
  const subtitleValue = Form.useWatch("subtitle", form);
  const ctaValue = Form.useWatch("ctaButton", form);
  const typeValue = Form.useWatch("type", form);

  const { data: bannerResponse, isLoading: fetching } = Queries.useGetSingleBanner(id);

  const addBanner = Mutations.useAddBanner();
  const editBanner = Mutations.useEditBanner();

  useEffect(() => {
    if (typeValue && typeValue !== "discount") {
      form.setFieldsValue({ endDate: undefined });
    }
  }, [typeValue, form]);

  useEffect(() => {
    if (isEditMode && bannerResponse?.data) {
      const data = bannerResponse.data;
      form.setFieldsValue({
        ...data,
        image: data?.image || "",
        endDate: data?.endDate ? dayjs(data.endDate) : undefined,
      });
    }
  }, [isEditMode, bannerResponse, form]);

  const validateUrlOrPath = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const isUrl = /^https?:\/\//i.test(value);
    const isPath = value.startsWith("/") || value.startsWith("#");
    return isUrl || isPath ? Promise.resolve() : Promise.reject(new Error("Enter a valid URL or path"));
  };

  const onFinish = async (values: any) => {
    const payload: any = {
      ...values,
      endDate: values.endDate ? dayjs(values.endDate).toISOString() : undefined,
      ...(isEditMode ? { bannerId: id } : {}),
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") delete payload[key];
    });

    const mutation = isEditMode ? editBanner : addBanner;

    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(`Banner ${isEditMode ? "updated" : "added"} successfully`);
          navigate(ROUTES.BANNERS);
        }
      },
    });
  };

  if (isEditMode && fetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Loading Banner Assets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.BANNERS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <div className="text-left overflow-hidden">
            <Breadcrumb
              className="mb-0.5 text-left text-[10px] sm:text-xs"
              items={[
                {
                  title: (
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>
                      Dashboard
                    </span>
                  ),
                },
                {
                  title: (
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.BANNERS)}>
                      Banners
                    </span>
                  ),
                },
                { title: isEditMode ? "Edit" : "Add" },
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">{isEditMode ? "Edit Banner" : "New Banner"}</h1>
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true, priority: 0 }} requiredMark={false} className="text-left">
        <div className="space-y-6 sm:space-y-8 text-left">
          <Card className="rounded-[24px] sm:rounded-[32px] border-0 shadow-xl overflow-hidden p-5 sm:p-8 text-left bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-6 sm:mb-8 text-left">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                <Layers size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Banner Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
              <Form.Item name="type" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Banner Type</span>} rules={[{ required: true, message: "Type is required" }]} className="text-left">
                <Select
                  size="large"
                  placeholder="Select banner type"
                  className="custom-select h-12 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!h-12 sm:[&_.ant-select-selector]:!h-14 [&_.ant-select-selector]:!bg-gray-50 dark:[&_.ant-select-selector]:!bg-slate-800 [&_.ant-select-selector]:!border-0"
                  options={[
                    { label: "Hero", value: "hero" },
                    { label: "Discount", value: "discount" },
                  ]}
                  suffixIcon={<Type size={14} className="text-slate-400" />}
                />
              </Form.Item>

              <Form.Item name="priority" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Priority</span>} className="text-left">
                <InputNumber<number> min={0} controls={false} parser={(value) => Number((value || "").toString().replace(/[^\d]/g, ""))} className="w-full h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left [&_.ant-input-number-input]:!h-12 sm:[&_.ant-input-number-input]:!h-14" prefix={<Hash size={14} className="text-slate-400" />} />
              </Form.Item>

              <Form.Item name="title" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Banner Title</span>} rules={[{ required: true, message: "Title is required" }]} className="text-left">
                <Input placeholder="e.g. Summer Collection 2024" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
              </Form.Item>

              <Form.Item name="subtitle" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Subtitle</span>} className="text-left">
                <Input prefix={<AlignLeft size={14} className="text-slate-400 mr-2" />} placeholder="Optional supporting line" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
              </Form.Item>

              {typeValue === "hero" && (
                <>
                  <Form.Item name="ctaButton" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">CTA Button Text</span>} className="text-left">
                    <Input prefix={<MousePointerClick size={14} className="text-slate-400 mr-2" />} placeholder="e.g. Shop Now" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
                  </Form.Item>

                  <Form.Item name="ctaButtonRedirection" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">CTA Button Link</span>} rules={[{ validator: validateUrlOrPath }]} className="text-left">
                    <Input prefix={<LinkIcon size={14} className="text-slate-400 mr-2 sm:w-4 sm:h-4" />} placeholder="e.g. /products/new-arrivals" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
                  </Form.Item>
                </>
              )}

              {typeValue === "discount" && (
                <>
                  <Form.Item name="pageRedirection" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Page Redirection</span>} rules={[{ validator: validateUrlOrPath }]} className="text-left">
                    <Input prefix={<LinkIcon size={14} className="text-slate-400 mr-2 sm:w-4 sm:h-4" />} placeholder="Optional landing page route" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
                  </Form.Item>
                  <Form.Item name="endDate" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">End Date & Time</span>} className="sm:col-span-2 text-left">
                    <DatePicker showTime format="DD-MM-YYYY HH:mm" className="w-full h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left [&_.ant-picker-input>input]:!h-12 sm:[&_.ant-picker-input>input]:!h-14" suffixIcon={<Calendar size={14} className="text-slate-400" />} />
                  </Form.Item>
                </>
              )}

              <Form.Item name="image" label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Image</span>} rules={[{ required: true, message: "Image is required" }]} className="sm:col-span-2 text-left mb-0">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Selected Image</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Choose a single banner image.</p>
                    </div>
                    <Button type="button" onClick={() => setIsUploadOpen(true)} className="h-11 px-5 rounded-xl font-bold flex items-center gap-2" variant="secondary">
                      <ImageIcon size={16} /> Choose Image
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/40 p-4 overflow-visible">
                    {imageUrl ? (
                      <div className="relative h-44 sm:h-52 w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 group shadow-lg shadow-black/10">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveImage(imageUrl);
                            setIsImageModalOpen(true);
                          }}
                          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-11 w-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                              <ImageIcon size={18} />
                            </div>
                          </div>
                        </button>
                        <img src={imageUrl} alt="Selected banner" className="h-full w-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute left-4 bottom-4 right-4 text-left text-white">
                          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/70">Banner preview</p>
                          {titleValue ? <h3 className="text-sm sm:text-base font-black uppercase tracking-tight line-clamp-1">{titleValue}</h3> : null}
                          {subtitleValue ? <p className="text-[11px] text-white/80 line-clamp-1 mt-1">{subtitleValue}</p> : null}
                        </div>
                        <button type="button" onClick={() => form.setFieldsValue({ image: "" })} className="absolute -top-0 -right-[-2px] z-20 h-8 w-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-red-600 flex items-center justify-center shadow">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-black">No image selected</div>
                    )}
                  </div>
                </div>
              </Form.Item>
            </div>

            <Button type="submit" loading={addBanner.isPending || editBanner.isPending} className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 sm:text-lg bg-primary-600 hover:bg-primary-700 text-white font-black mt-6">
              <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? "Update" : "Deploy"} Banner
            </Button>
          </Card>
        </div>
      </Form>

      <UploadImage
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        multiple={false}
        onSelect={(items: UploadItem[]) => {
          const first = items[0];
          if (first?.url || first?.path) {
            form.setFieldsValue({ image: first.url || first.path });
          }
        }}
      />

      <Modal open={isImageModalOpen} onCancel={() => setIsImageModalOpen(false)} footer={null} centered closable closeIcon={<X size={16} />} width={520} destroyOnClose className="product-image-modal">
        <div className="space-y-3">
          <div className="text-base font-black text-slate-900 dark:text-white">Banner Image</div>
          {activeImage ? (
            <div className="flex justify-center">
              <Image src={activeImage} alt="Banner image preview" preview={false} className="rounded-2xl object-contain max-h-[60vh] max-w-full" />
            </div>
          ) : (
            <div className="h-48 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">No image available.</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BannerForm;
