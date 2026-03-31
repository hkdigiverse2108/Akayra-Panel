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
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} category`);
            }
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
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(ROUTES.FAQ_CATEGORIES)}
                        className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <Breadcrumb 
                            className="mb-1"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.FAQ_CATEGORIES)}>FAQ Categories</span> },
                                { title: isEditMode ? 'Edit Category' : 'Add Category' }
                            ]}
                        />
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditMode ? 'Edit Taxonomy' : 'Define New Group'}
                        </h1>
                    </div>
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
                    <Form.Item
                        name="name"
                        label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Category Name</span>}
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input prefix={<FolderOpen size={16} className="text-slate-400 mr-2" />} placeholder="e.g. Shipping & Delivery" className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Short Description</span>}
                    >
                        <TextArea rows={4} placeholder="Describe what this category covers..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 py-4 font-medium focus:ring-primary-500" />
                    </Form.Item>

                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-primary-500 shadow-sm border border-gray-100 dark:border-slate-700">
                                <AlignLeft size={16} />
                            </div>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Active Status</span>
                        </div>
                        <Form.Item name="isActive" valuePropName="checked" noStyle>
                            <Switch />
                        </Form.Item>
                    </div>

                    <Button onClick={() => form.submit()} loading={addCategory.isPending || editCategory.isPending} className="w-full h-16 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 text-lg bg-primary-600 hover:bg-primary-700 text-white font-black">
                        <Save size={20} /> {isEditMode ? 'Update Category' : 'Create Category'}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default FaqCategoryForm;
