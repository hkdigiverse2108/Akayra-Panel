import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Divider, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { Tag, Camera, Save, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const BrandForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

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
                name: data.name || data.title
            });
        }
    }, [isEditMode, brandResponse, form]);

    const onFinish = async (values: any) => {
        const payload = isEditMode ? { ...values, brandId: id } : values;
        const mutation = isEditMode ? editBrand : addBrand;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200 || res.status === 201) {
                    toast.success(`Brand ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.BRANDS);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} brand`);
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-4 text-left">
                    <button 
                        onClick={() => navigate(ROUTES.BRANDS)}
                        className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-left">
                        <Breadcrumb 
                            className="mb-1 text-left"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.BRANDS)}>Brands</span> },
                                { title: isEditMode ? 'Edit Brand' : 'Add Brand' }
                            ]}
                        />
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">
                            {isEditMode ? 'Edit Brand' : 'Add New Brand'}
                        </h1>
                    </div>
                </div>
            </div>

            <Card className="rounded-3xl shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left">
                <div className="p-1 text-left">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ isActive: true }}
                        requiredMark={false}
                        className="max-w-4xl mx-auto py-8 text-left"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="col-span-2 text-left">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                                    <Tag size={20} className="text-primary-500" /> Brand Details
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800 text-left" />
                            </div>

                            <Form.Item 
                                label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Brand Name</span>} 
                                name="name" 
                                rules={[{ required: true, message: 'Please enter brand name' }]}
                                className="col-span-2 md:col-span-1 text-left"
                            >
                                <Input 
                                    size="large" 
                                    placeholder="Enter brand name"
                                    className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-primary-500 text-left" 
                                />
                            </Form.Item>

                            <Form.Item 
                                label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Logo/Image URL</span>} 
                                name="image" 
                                className="col-span-2 md:col-span-1 text-left"
                            >
                                <Input 
                                    size="large" 
                                    prefix={<Camera size={16} className="mr-2 text-slate-400" />} 
                                    placeholder="https://example.com/logo.jpg"
                                    className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-primary-500 text-left" 
                                />
                            </Form.Item>
                        </div>

                        <div className="mt-12 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-8 text-left">
                            <Button 
                                type="submit" 
                                loading={addBrand.isPending || editBrand.isPending || fetching}
                                className="h-14 px-10 rounded-2xl font-black text-lg bg-primary-600 hover:bg-primary-700 border-0 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                            >
                                <Save size={18} /> {isEditMode ? 'Update Brand' : 'Save Brand'}
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate(ROUTES.BRANDS)}
                                className="h-14 px-8 rounded-2xl font-bold border-2 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default BrandForm;
