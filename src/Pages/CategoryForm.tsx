import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Divider, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { Layers, Camera, Save, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const CategoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    // Queries
    const { data: categoryResponse, isLoading: fetching } = Queries.useGetSingleCategory(id);
    
    // Mutations
    const addCategory = Mutations.useAddCategory();
    const editCategory = Mutations.useEditCategory();

    useEffect(() => {
        if (isEditMode && categoryResponse?.data) {
            form.setFieldsValue(categoryResponse.data);
        }
    }, [isEditMode, categoryResponse, form]);

    const onFinish = async (values: any) => {
        const payload = isEditMode ? { ...values, categoryId: id } : values;
        const mutation = isEditMode ? editCategory : addCategory;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200 || res.status === 201) {
                    toast.success(`Category ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.CATEGORIES);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} category`);
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <button 
                        onClick={() => navigate(ROUTES.CATEGORIES)}
                        className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-left overflow-hidden">
                        <Breadcrumb 
                            className="mb-0.5 text-left text-[10px] sm:text-xs"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.CATEGORIES)}>Categories</span> },
                                { title: isEditMode ? 'Edit' : 'Add' }
                            ]}
                        />
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
                            {isEditMode ? 'Edit Category' : 'New Category'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Button variant="ghost" onClick={() => navigate(ROUTES.CATEGORIES)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={addCategory.isPending || editCategory.isPending || fetching} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
                        <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Update' : 'Save'}
                    </Button>
                </div>
            </div>

            <Card className="rounded-2xl sm:rounded-[32px] shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left p-4 sm:p-8">
                <div className="text-left">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ isActive: true }}
                        requiredMark={false}
                        className="max-w-4xl mx-auto py-2 sm:py-4 text-left"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                            <div className="col-span-2 text-left">
                                <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                                    <Layers size={18} className="text-primary-500 sm:w-5 sm:h-5" /> Category Details
                                </h3>
                                <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
                            </div>

                            <Form.Item 
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left text-left">Category Name</span>} 
                                name="name" 
                                rules={[{ required: true, message: 'Please enter category name' }]}
                                className="col-span-2 md:col-span-1 text-left"
                            >
                                <Input 
                                    size="large" 
                                    placeholder="e.g. Mens Fashion"
                                    className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800 border-0 px-5 font-bold focus:ring-primary-500 text-left" 
                                />
                            </Form.Item>

                            <Form.Item 
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left text-left">Image URL</span>} 
                                name="image" 
                                className="col-span-2 md:col-span-1 text-left"
                            >
                                <Input 
                                    size="large" 
                                    prefix={<Camera size={16} className="mr-2 text-slate-400" />} 
                                    placeholder="https://example.com/category-image.jpg"
                                    className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800 border-0 px-5 font-bold focus:ring-primary-500 text-left" 
                                />
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default CategoryForm;
