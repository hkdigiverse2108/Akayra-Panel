import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Switch, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { ArrowLeft, Save, FolderOpen, AlignLeft } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const FaqCategoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    // Queries
    const { data: categoryResponse, isLoading: fetching } = Queries.useGetSingleFaqCategory(id);
    
    // Mutations
    const addCategory = Mutations.useAddFaqCategory();
    const editCategory = Mutations.useEditFaqCategory();

    useEffect(() => {
        if (isEditMode && categoryResponse?.data) {
            form.setFieldsValue(categoryResponse.data);
        }
    }, [isEditMode, categoryResponse, form]);

    const onFinish = async (values: any) => {
        const payload = isEditMode ? { ...values, faqCategoryId: id } : values;
        const mutation = isEditMode ? editCategory : addCategory;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200 || res.status === 201) {
                    toast.success(`Category ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.FAQ_CATEGORIES);
                }
            },
        });
    };

    if (isEditMode && fetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Cataloging Support Structures...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <button 
                        onClick={() => navigate(ROUTES.FAQ_CATEGORIES)}
                        className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-left overflow-hidden">
                        <Breadcrumb 
                            className="mb-0.5 text-left text-[10px] sm:text-xs"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.FAQ_CATEGORIES)}>FAQ Categories</span> },
                                { title: isEditMode ? 'Edit' : 'Add' }
                            ]}
                        />
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
                            {isEditMode ? 'Edit Taxonomy' : 'New Group'}
                        </h1>
                    </div>
                </div>
            </div>

            <Card className="rounded-[24px] sm:rounded-[32px] border-0 shadow-xl overflow-hidden p-6 sm:p-8 bg-white dark:bg-slate-900 text-left">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ isActive: true }}
                    requiredMark={false}
                    className="text-left"
                >
                    <Form.Item
                        name="name"
                        label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Category Name</span>}
                        rules={[{ required: true, message: 'Name is required' }]}
                        className="text-left mb-4 sm:mb-6"
                    >
                        <Input prefix={<FolderOpen size={16} className="text-slate-400 mr-2 sm:w-4 sm:h-4" />} placeholder="e.g. Shipping & Delivery" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Short Description</span>}
                        className="text-left mb-4 sm:mb-6"
                    >
                        <TextArea rows={4} placeholder="Describe what this category covers..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 font-medium focus:ring-primary-500 text-left" />
                    </Form.Item>

                    <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-700 mb-6 sm:mb-8 text-left">
                        <div className="flex items-center gap-3 text-left">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                            <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight text-left">Active Status</span>
                        </div>
                        <Form.Item name="isActive" valuePropName="checked" noStyle>
                            <Switch size="small" className="sm:scale-110" />
                        </Form.Item>
                    </div>

                    <Button onClick={() => form.submit()} loading={addCategory.isPending || editCategory.isPending} className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 sm:text-lg bg-primary-600 hover:bg-primary-700 text-white font-black">
                        <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Update' : 'Create'} Category
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default FaqCategoryForm;
