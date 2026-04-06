import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Divider, Breadcrumb } from "antd";
import { Queries } from "../Api/Queries";
import { Mutations } from "../Api/Mutations";
import Card from "../Components/Card";
import Button from "../Components/Button";
import { Ruler, Save, ArrowLeft } from "lucide-react";
import { ROUTES } from "../Constants";
import { toast } from "react-toastify";

const SizeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  // Queries
  const { data: sizeResponse, isLoading: fetching } = Queries.useGetSingleSize(id);

  // Mutations
  const addSize = Mutations.useAddSize();
  const editSize = Mutations.useEditSize();

  useEffect(() => {
    if (isEditMode && sizeResponse?.data) {
      form.setFieldsValue(sizeResponse.data);
    }
  }, [isEditMode, sizeResponse, form]);

  const onFinish = async (values: any) => {
    const payload = isEditMode ? { ...values, sizeId: id } : values;
    const mutation = isEditMode ? editSize : addSize;

    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(`Size ${isEditMode ? "updated" : "added"} successfully`);
          navigate(ROUTES.SIZES);
        }
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.SIZES)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800">
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
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.SIZES)}>
                      Sizes
                    </span>
                  ),
                },
                { title: isEditMode ? "Edit" : "Add" },
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">{isEditMode ? "Edit Size" : "Add New Size"}</h1>
          </div>
        </div>
      </div>

      <Card className="rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left">
        <div className="p-0 sm:p-1 text-left">
          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }} requiredMark={false} className="max-w-2xl mx-auto p-5 sm:py-8 text-left">
            <div className="space-y-6 sm:space-y-8 text-left">
              <div className="text-left">
                <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                  <Ruler size={18} className="text-primary-500 sm:w-5 sm:h-5" /> Size Configuration
                </h3>
                <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
              </div>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-sm sm:text-base text-left">Size Label (e.g., XL, 42, 10”)</span>} name="name" rules={[{ required: true, message: "Please enter size label" }]} className="text-left mb-0">
                <Input size="large" placeholder="Enter size name or number" className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white uppercase focus:ring-primary-500 text-left" />
              </Form.Item>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 sm:pt-8 text-left">
              <Button type="submit" loading={addSize.isPending || editSize.isPending || fetching} className="h-12 sm:h-14 px-10 rounded-xl sm:rounded-2xl font-black sm:text-lg bg-primary-600 hover:bg-primary-700 border-0 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 w-full sm:w-auto">
                <Save size={18} /> {isEditMode ? "Update" : "Save"} Size
              </Button>
              <Button variant="ghost" onClick={() => navigate(ROUTES.SIZES)} className="h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl font-bold border-2 text-slate-600 hover:bg-slate-50 w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default SizeForm;
