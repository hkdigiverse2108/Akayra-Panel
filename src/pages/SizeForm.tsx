import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Divider, message } from 'antd';
import { sizeAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { Ruler, Save, ArrowLeft } from 'lucide-react';

const SizeForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchSize();
        }
    }, [id]);

    const fetchSize = async () => {
        try {
            setFetching(true);
            const response = await sizeAPI.getById(id as string);
            if (response.data.status === 200) {
                form.setFieldsValue(response.data.data);
            }
        } catch (error) {
            console.error('Fetch size error:', error);
            message.error('Failed to load size details');
        } finally {
            setFetching(false);
        }
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            let response;
            if (isEditMode) {
                response = await sizeAPI.edit({
                    sizeId: id,
                    ...values
                });
            } else {
                response = await sizeAPI.add(values);
            }

            if (response.data.status === 200 || response.data.status === 201) {
                message.success(`Size ${isEditMode ? 'updated' : 'added'} successfully`);
                navigate('/sizes');
            }
        } catch (error: any) {
            console.error('Save size error:', error);
            message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} size`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/sizes')}
                        className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditMode ? 'Edit Size' : 'Add New Size'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            {isEditMode ? 'Update existing size variant' : 'Define a new size option for products'}
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
                        className="max-w-2xl mx-auto py-8"
                    >
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <Ruler size={20} className="text-primary-500" /> Size Configuration
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800" />
                            </div>

                            <Form.Item 
                                label={<span className="font-bold text-slate-600 dark:text-slate-400">Size Label (e.g., XL, 42, 10”)</span>} 
                                name="name" 
                                rules={[{ required: true, message: 'Please enter size label' }]}
                            >
                                <Input 
                                    size="large" 
                                    placeholder="Enter size name or number"
                                    className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white uppercase" 
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
                                <Save size={18} /> {isEditMode ? 'Update Size' : 'Save Size'}
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate('/sizes')}
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

export default SizeForm;
