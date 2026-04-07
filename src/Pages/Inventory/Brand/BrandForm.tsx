import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Divider, Breadcrumb } from "antd";
import { Queries } from "../../../Api/Queries";
import { Mutations } from "../../../Api/Mutations";
import Card from "../../../Components/Card";
import Button from "../../../Components/Button";
import UploadImage from "../../../Components/UploadImage";
import type { UploadItem } from "../../../Utils/Hooks/useUpload";
import { Tag, Save, ArrowLeft, ImageIcon, X } from "lucide-react";
import { ROUTES } from "../../../Constants";
import { toast } from "react-toastify";

const BrandForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEditMode = !!id;
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const watchedImage = Form.useWatch("image", form);

  // Queries
  const { data: brandResponse, isLoading: fetching } = Queries.useGetSingleBrand(id);

  // Mutations
  const addBrand = Mutations.useAddBrand();
  const editBrand = Mutations.useEditBrand();

  useEffect(() => {
    if (isEditMode && brandResponse?.data) {
      const data = brandResponse.data;
      form.setFieldsValue({
        ...data,
        name: data.name || data.title,
      });
    }
  }, [isEditMode, brandResponse, form]);

  const onFinish = async (values: any) => {
    const payload = isEditMode ? { ...values, brandId: id } : values;
    const mutation = isEditMode ? editBrand : addBrand;

    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(`Brand ${isEditMode ? "updated" : "added"} successfully`);
          navigate(ROUTES.BRANDS);
        }
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.BRANDS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800">
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
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.BRANDS)}>
                      Brands
                    </span>
                  ),
                },
                { title: isEditMode ? "Edit" : "Add" },
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">{isEditMode ? "Edit Brand" : "Add New Brand"}</h1>
          </div>
        </div>
      </div>

      <Card className="rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left">
        <div className="p-0 sm:p-1 text-left">
          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }} requiredMark={false} className="max-w-4xl mx-auto p-5 sm:py-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
              <div className="col-span-2 text-left">
                <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                  <Tag size={18} className="text-primary-500 sm:w-5 sm:h-5" /> Brand Details
                </h3>
                <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
              </div>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-sm sm:text-base text-left">Brand Name</span>} name="name" rules={[{ required: true, message: "Please enter brand name" }]} className="col-span-2 md:col-span-1 text-left mb-4 sm:mb-6">
                <Input size="large" placeholder="Enter brand name" className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-primary-500 text-left" />
              </Form.Item>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-sm sm:text-base text-left">Logo/Image URL</span>} name="image" className="col-span-2 md:col-span-1 text-left mb-4 sm:mb-6">
                <div className="space-y-3">
                  {watchedImage ? (
                    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={watchedImage} alt="Brand" className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                        <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{watchedImage}</span>
                      </div>
                      <button type="button" onClick={() => form.setFieldsValue({ image: "" })} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 uppercase tracking-widest font-black">No image selected</div>
                  )}

                  <Button type="button" onClick={() => setIsUploadOpen(true)} className="h-11 px-5 rounded-xl font-bold flex items-center gap-2" variant="secondary">
                    <ImageIcon size={16} /> Choose Image
                  </Button>
                </div>
              </Form.Item>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 sm:pt-8 text-left">
              <Button type="submit" loading={addBrand.isPending || editBrand.isPending || fetching} className="h-12 sm:h-14 px-10 rounded-xl sm:rounded-2xl font-black sm:text-lg bg-primary-600 hover:bg-primary-700 border-0 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 w-full sm:w-auto">
                <Save size={18} /> {isEditMode ? "Update" : "Save"} Brand
              </Button>
              <Button variant="ghost" onClick={() => navigate(ROUTES.BRANDS)} className="h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl font-bold border-2 text-slate-600 hover:bg-slate-50 w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Card>

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
    </div>
  );
};

export default BrandForm;
