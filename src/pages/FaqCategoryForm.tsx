import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Switch, message } from 'antd';
import { faqCategoryAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save, FolderOpen, AlignLeft } from 'lucide-react';

const { TextArea } = Input;

const FaqCategoryForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchCategory = async () => {
                try {
                    setFetchingData(true);
                    const response = await faqCategoryAPI.getById(id);
                    if (response.data.status === 200) {
                        form.setFieldsValue(response.data.data);
                    }
                } catch (error) {
                    console.error('Fetch faq category error:', error);
                    message.error('Failed to load category data');
                } finally {
                    setFetchingData(false);
                }
            };
            fetchCategory();
        }
    }, [id, form]);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                faqCategoryId: id
            };

            const response = id 
                ? await faqCategoryAPI.edit(payload)
                : await faqCategoryAPI.add(payload);

            if (response.data.status === 200) {
                message.success(`Category ${id ? 'updated' : 'added'} successfully`);
                navigate('/faq-categories');
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            message.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Cataloging Support Structures...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/faq-categories')}
                    className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {id ? 'Edit Taxonomy' : 'Define New Group'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Categorize support inquiries for better resolution.</p>
                </div>
            </div>

            <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ isActive: true }}
                >
                    <Form.Item
                        name="name"
                        label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Category Name</span>}
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input prefix={<FolderOpen size={16} className="text-slate-400 mr-2" />} placeholder="e.g. Shipping & Delivery" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Short Description</span>}
                    >
                        <TextArea rows={4} placeholder="Describe what this category covers..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 py-4 font-medium" />
                    </Form.Item>

                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-primary-500 shadow-sm border border-gray-100 dark:border-slate-700">
                                <AlignLeft size={16} />
                            </div>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Active Status</span>
                        </div>
                        <Form.Item name="isActive" valuePropName="checked" noStyle>
                            <Switch className="custom-switch" />
                        </Form.Item>
                    </div>

                    <Button onClick={() => form.submit()} loading={loading} className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 text-lg">
                        <Save size={20} /> {id ? 'Update Category' : 'Create Category'}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default FaqCategoryForm;
