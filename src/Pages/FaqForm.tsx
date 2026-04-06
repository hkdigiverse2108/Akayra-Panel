import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Switch, Breadcrumb, InputNumber } from "antd";
import { Queries } from "../Api/Queries";
import { Mutations } from "../Api/Mutations";
import Card from "../Components/Card";
import Button from "../Components/Button";
import { ArrowLeft, Save, HelpCircle, Hash } from "lucide-react";
import { ROUTES } from "../Constants";
import { toast } from "react-toastify";

const { Option } = Select;
const { TextArea } = Input;

const FaqForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  // Queries for Dropdown
  const { data: categoryRes } = Queries.useGetFaqCategory();

  // Query for Edit Mode
  const { data: faqResponse, isLoading: fetching } = Queries.useGetSingleFaq(id);

  // Mutations
  const addFaq = Mutations.useAddFaq();
  const editFaq = Mutations.useEditFaq();

  const categories = categoryRes?.data?.faq_category_data || [];

  useEffect(() => {
    if (isEditMode && faqResponse?.data) {
      const faq = faqResponse.data;
      form.setFieldsValue({
        ...faq,
        faqCategoryId: faq.faqCategoryId?._id || faq.faqCategoryId,
      });
    }
  }, [isEditMode, faqResponse, form]);

  const onFinish = async (values: any) => {
    const payload = isEditMode ? { ...values, faqId: id } : values;
    const mutation = isEditMode ? editFaq : addFaq;

    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(`FAQ ${isEditMode ? "updated" : "added"} successfully`);
          navigate(ROUTES.FAQS);
        }
      },
    });
  };

  if (isEditMode && fetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Accessing Knowledge Repository...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.FAQS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800">
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
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.FAQS)}>
                      FAQs
                    </span>
                  ),
                },
                { title: isEditMode ? "Edit" : "Add" },
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">{isEditMode ? "Edit FAQ" : "New Entry"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTES.FAQS)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={() => form.submit()} loading={addFaq.isPending || editFaq.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
            <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? "Save" : "Publish"}
          </Button>
        </div>
      </div>

      <Card className="rounded-[24px] sm:rounded-[32px] border-0 shadow-xl overflow-hidden p-6 sm:p-8 bg-white dark:bg-slate-900">
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true, priority: 0 }} requiredMark={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item name="priority" label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Priority</span>} className="text-left md:col-span-2">
              <InputNumber<number> min={0} controls={false} parser={(value) => Number((value || "").toString().replace(/[^\d]/g, ""))} className="w-full h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left [&_.ant-input-number-input]:!h-12 sm:[&_.ant-input-number-input]:!h-14" prefix={<Hash size={14} className="text-slate-400" />} />
            </Form.Item>

            <Form.Item name="question" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Inquiry Label (Question)</span>} rules={[{ required: true, message: "Question is required" }]} className="md:col-span-2">
              <Input prefix={<HelpCircle size={16} className="text-slate-400 mr-2" />} placeholder="e.g. How do I track my order?" className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500" />
            </Form.Item>

            <Form.Item name="faqCategoryId" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Knowledge Cluster</span>} rules={[{ required: true, message: "Category is required" }]}>
              <Select placeholder="Select Cluster" className="custom-select h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 [&_.ant-select-selection-item]:text-slate-800" showSearch filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())}>
                {categories.map((cat: any) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Resource Active</span>
              </div>
              <Form.Item name="isActive" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>

            <Form.Item name="answer" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Automated Resolution (Answer)</span>} rules={[{ required: true, message: "Answer is required" }]} className="md:col-span-2">
              <TextArea rows={6} placeholder="Provide a clear, detailed resolution..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-[32px] px-8 py-6 font-medium leading-relaxed italic focus:ring-primary-500" />
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default FaqForm;
