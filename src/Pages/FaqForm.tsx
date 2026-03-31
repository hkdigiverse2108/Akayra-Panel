import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Switch, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { ArrowLeft, Save, HelpCircle } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TextArea } = Input;

const FaqForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    // Queries for Dropdown
    const { data: categoryRes } = Queries.useGetFaqCategory({ limit: 'All' });
    
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
                    toast.success(`FAQ ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.FAQS);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} FAQ`);
            }
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
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mt-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(ROUTES.FAQS)}
                        className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <Breadcrumb 
                            className="mb-1"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.FAQS)}>FAQs</span> },
                                { title: isEditMode ? 'Edit FAQ' : 'Add FAQ' }
                            ]}
                        />
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditMode ? 'Knowledge Adjustment' : 'Author New Entry'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate(ROUTES.FAQS)} className="h-12 px-6 rounded-2xl border-2 font-bold text-slate-600">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={addFaq.isPending || editFaq.isPending} className="h-12 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black">
                        <Save size={20} /> {isEditMode ? 'Save Entry' : 'Publish Entry'}
                    </Button>
                </div>
            </div>

            <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ isActive: true }}
                    requiredMark={false}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            name="question"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Inquiry Label (Question)</span>}
                            rules={[{ required: true, message: 'Question is required' }]}
                            className="md:col-span-2"
                        >
                            <Input prefix={<HelpCircle size={16} className="text-slate-400 mr-2" />} placeholder="e.g. How do I track my order?" className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500" />
                        </Form.Item>

                        <Form.Item
                            name="faqCategoryId"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Knowledge Cluster</span>}
                            rules={[{ required: true, message: 'Category is required' }]}
                        >
                            <Select 
                                placeholder="Select Cluster" 
                                className="custom-select h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 [&_.ant-select-selection-item]:text-slate-800"
                                showSearch
                                filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())}
                            >
                                {categories.map((cat: any) => <Option key={cat._id} value={cat._id}>{cat.name}</Option>)}
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

                        <Form.Item
                            name="answer"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Automated Resolution (Answer)</span>}
                            rules={[{ required: true, message: 'Answer is required' }]}
                            className="md:col-span-2"
                        >
                            <TextArea rows={6} placeholder="Provide a clear, detailed resolution..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-[32px] px-8 py-6 font-medium leading-relaxed italic focus:ring-primary-500" />
                        </Form.Item>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default FaqForm;
