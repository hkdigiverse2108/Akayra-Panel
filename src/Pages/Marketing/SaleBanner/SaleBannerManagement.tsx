import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Switch, Breadcrumb, Divider, Image, DatePicker } from "antd";
import Card from "../../../Components/Card";
import Button from "../../../Components/Button";
import UploadImage from "../../../Components/UploadImage";
import type { UploadItem } from "../../../Utils/Hooks/useUpload";
import { Save, ArrowLeft, ImageIcon, Clock, Type, Layout, Eye, X } from "lucide-react";
import { ROUTES } from "../../../Constants";
import { Mutations } from "../../../Api/Mutations";
import { Queries } from "../../../Api/Queries";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const SaleBannerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const { data: saleBannerData, isLoading } = Queries.useGetSaleBanner();
  const updateSaleBanner = Mutations.useUpdateSaleBanner();

  const titleValue = Form.useWatch("title", form);
  const subtitleValue = Form.useWatch("subtitle", form);
  const imageUrl = Form.useWatch("image", form);

  useEffect(() => {
    if (saleBannerData?.data) {
      const banner = saleBannerData.data;
      form.setFieldsValue({
        ...banner,
        saleEndTime: banner.saleEndTime ? dayjs(banner.saleEndTime) : null,
      });
    }
  }, [saleBannerData, form]);

  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      saleEndTime: values.saleEndTime ? values.saleEndTime.toISOString() : null,
    };

    updateSaleBanner.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Sale Banner updated successfully", {
            toastId: "sale-banner-updated",
          });
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.DASHBOARD)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800">
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
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>
                      Marketing
                    </span>
                  ),
                },
                { title: "Sale Banner" },
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">Manage Sale Banner</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button onClick={() => form.submit()} loading={updateSaleBanner.isPending || isLoading} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
            <Save size={18} className="sm:w-5 sm:h-5" /> Save Changes
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="text-left">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 text-left items-start">
          <div className="space-y-6 sm:space-y-8">
            <Card className="rounded-2xl sm:rounded-[32px] shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left p-4 sm:p-8 self-start">
              <div className="text-left mb-6">
                <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                  <Layout size={18} className="text-primary-500 sm:w-5 sm:h-5" /> Banner Content
                </h3>
                <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
              </div>

              <div className="grid grid-cols-1 gap-6 text-left">
                <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Main Title</span>} name="title" rules={[{ required: true, message: "Title is required" }]} className="text-left">
                  <Input size="large" placeholder="e.g. Only Summer Collections" prefix={<Type size={14} className="text-slate-400" />} className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>

                <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Subtitle / Offer Text</span>} name="subtitle" className="text-left">
                  <Input size="large" placeholder="e.g. Get up to -40% Off" prefix={<Type size={14} className="text-slate-400" />} className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Sale End Date & Time</span>} name="saleEndTime" rules={[{ required: true, message: "End time is required" }]} className="text-left">
                    <DatePicker showTime className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" prefix={<Clock size={14} className="text-slate-400 mr-2" />} />
                  </Form.Item>

                  <div className="flex flex-col">
                    <span className="font-bold text-slate-600 dark:text-slate-400 text-left mb-2">Display Status</span>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-left h-12">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight text-left">Active</span>
                      <Form.Item name="isActive" valuePropName="checked" noStyle initialValue={true}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left text-left">Banner Image</span>} name="image" rules={[{ required: true, message: "Please select an image" }]} className="text-left">
                  <div className="space-y-4">
                    {imageUrl ? (
                      <div className="flex items-center justify-between gap-4 p-4 rounded-[22px] border border-slate-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 transition-all hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm">
                        <div className="flex items-center gap-4 min-w-0">
                          <Image src={imageUrl} alt="Banner" className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" preview={{ mask: <div className="flex flex-col items-center gap-1 text-[10px] font-bold"><Eye size={14} /> VIEW</div> }} />
                          <div className="min-w-0 flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Image URL</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[150px] sm:max-w-[250px]">{imageUrl}</span>
                          </div>
                        </div>
                        <button type="button" onClick={() => form.setFieldsValue({ image: "" })} className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setIsUploadOpen(true)} className="w-full group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] bg-slate-50/60 transition-all hover:border-primary-500/50 hover:bg-primary-50/10" >
                        <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-110 group-hover:text-primary-500 transition-all">
                          <ImageIcon size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-200">No image selected</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Select from library or upload new</p>
                        </div>
                        <div className="mt-2 text-xs font-bold text-primary-500 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
                          Browse Media Library
                        </div>
                      </button>
                    )}
                  </div>
                </Form.Item>
              </div>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="rounded-[24px] sm:rounded-[32px] border shadow-xl overflow-hidden p-6 sm:p-8 bg-white text-slate-900 dark:bg-slate-950 dark:text-white border-gray-100 dark:border-white/10 flex flex-col text-left">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 text-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white">
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Banner Preview</h2>
              </div>

              <div className="flex-1 flex flex-col justify-center text-left">
                {imageUrl ? (
                  <div className="space-y-4 sm:space-y-6 text-left">
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden border-2 sm:border-4 border-gray-100 dark:border-white/10 shadow-2xl relative group">
                      <Image src={imageUrl} alt="Sale Banner" className="h-full w-full object-cover" preview={false} />
                      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">{subtitleValue || "GET UP TO -40% OFF"}</p>
                        <h3 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tight">{titleValue || "ONLY SUMMER COLLECTIONS"}</h3>
                        <div className="mt-4 flex gap-2">
                           <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-white text-[10px] font-bold">00 D</div>
                           <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-white text-[10px] font-bold">00 H</div>
                           <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-white text-[10px] font-bold">00 M</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 border-2 sm:border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[24px] sm:rounded-[32px] text-center min-h-[200px]">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-[24px] flex items-center justify-center mb-3 sm:mb-4 bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/20">
                      <ImageIcon size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-center">Preview Area</h3>
                    <p className="text-slate-400/80 dark:text-white/20 font-medium text-[10px] sm:text-xs max-w-[200px] mt-1 sm:mt-2 text-center">Upload an image to see how your banner looks.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Form>

      <UploadImage isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} multiple={false} onSelect={(items: UploadItem[]) => { const first = items[0]; if (first?.url || first?.path) { form.setFieldsValue({ image: first.url || first.path }); } }} />
    </div>
  );
};

export default SaleBannerManagement;
