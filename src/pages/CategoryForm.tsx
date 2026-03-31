import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Divider, message } from 'antd';
import { categoryAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { Layers, Camera, Save, ArrowLeft } from 'lucide-react';

const CategoryForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            setFetching(true);
            const response = await categoryAPI.getById(id as string);
            if (response.data.status === 200) {
                form.setFieldsValue(response.data.data);
            }
        } catch (error) {
            console.error('Fetch category error:', error);
            message.error('Failed to load category details');
        } finally {
            setFetching(false);
        }
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            let response;
            if (isEditMode) {
                response = await categoryAPI.edit({
                    categoryId: id,
                    ...values
                });
            } else {
                response = await categoryAPI.add(values);
            }

            if (response.data.status === 200 || response.data.status === 201) {
                message.success(`Category ${isEditMode ? 'updated' : 'added'} successfully`);
                navigate('/categories');
            }
        } catch (error: any) {
            console.error('Save category error:', error);
            message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} category`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/categories')}
                        className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditMode ? 'Edit Category' : 'Add New Category'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            {isEditMode ? 'Update existing category details' : 'Create a new category for your store'}
                        </p>
                    </div>
                </div>
            </div>

            <Card className="rounded-3xl shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900">
                <div className="p-1">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ isActive: true }}
                        requiredMark={false}
                        className="max-w-4xl mx-auto py-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-2">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <Layers size={20} className="text-primary-500" /> Category Details
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800" />
                            </div>

                            <Form.Item 
                                label={<span className="font-bold text-slate-600 dark:text-slate-400">Category Name</span>} 
                                name="name" 
                                rules={[{ required: true, message: 'Please enter category name' }]}
                                className="col-span-2 md:col-span-1"
                            >
                                <Input 
                                    size="large" 
                                    placeholder="Enter category name"
                                    className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white" 
                                />
                            </Form.Item>

                            <Form.Item 
                                label={<span className="font-bold text-slate-600 dark:text-slate-400">Image URL</span>} 
                                name="image" 
                                className="col-span-2 md:col-span-1"
                            >
                                <Input 
                                    size="large" 
                                    prefix={<Camera size={16} className="mr-2 text-slate-400" />} 
                                    placeholder="https://example.com/image.jpg"
                                    className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white" 
                                />
                            </Form.Item>
                        </div>

                        <div className="mt-12 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                isLoading={loading || fetching}
                                className="h-12 px-8 rounded-xl flex items-center gap-2 font-bold"
                            >
                                <Save size={18} /> {isEditMode ? 'Update Category' : 'Save Category'}
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate('/categories')}
                                className="h-12 px-8 rounded-xl font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
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

export default CategoryForm;
