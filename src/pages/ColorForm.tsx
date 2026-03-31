import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Divider, message, ColorPicker } from 'antd';
import { colorAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { Palette, Save, ArrowLeft } from 'lucide-react';
import namer from 'color-namer';

const ColorForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const isEditMode = !!id;

    // To watch hexCode for real-time preview
    const hexCodeValue = Form.useWatch('hexCode', form);

    useEffect(() => {
        if (isEditMode) {
            fetchColor();
        }
    }, [id]);

    useEffect(() => {
        if (hexCodeValue && /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hexCodeValue)) {
            try {
                const names = namer(hexCodeValue);
                if (names && names.ntc && names.ntc[0]) {
                    const closestName = names.ntc[0].name;
                    form.setFieldsValue({ name: closestName });
                }
            } catch (error) {
            }
        }
    }, [hexCodeValue]);

    const fetchColor = async () => {
        try {
            setFetching(true);
            const response = await colorAPI.getById(id as string);
            if (response.data.status === 200) {
                form.setFieldsValue(response.data.data);
            }
        } catch (error) {
            console.error('Fetch color error:', error);
            message.error('Failed to load color details');
        } finally {
            setFetching(false);
        }
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            let response;
            if (isEditMode) {
                response = await colorAPI.edit({
                    colorId: id,
                    ...values
                });
            } else {
                response = await colorAPI.add(values);
            }

            if (response.data.status === 200 || response.data.status === 201) {
                message.success(`Color ${isEditMode ? 'updated' : 'added'} successfully`);
                navigate('/colors');
            }
        } catch (error: any) {
            console.error('Save color error:', error);
            message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} color`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/colors')}
                        className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditMode ? 'Edit Color' : 'Add New Color'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            {isEditMode ? 'Update existing color mapping' : 'Define a new color with its hex code'}
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
                        initialValues={{ isActive: true, hexCode: '#000000' }}
                        requiredMark={false}
                        className="max-w-3xl mx-auto py-8"
                    >
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <Palette size={20} className="text-primary-500" /> Appearance
                                </h3>
                                <Divider className="my-3 border-slate-100 dark:border-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-6">
                                    <Form.Item 
                                        label={<span className="font-bold text-slate-600 dark:text-slate-400">Color Name</span>} 
                                        name="name" 
                                        rules={[{ required: true, message: 'Please enter color name' }]}
                                    >
                                        <Input 
                                            size="large" 
                                            placeholder="e.g. Midnight Blue"
                                            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white" 
                                        />
                                    </Form.Item>

                                    <Form.Item 
                                        label={<span className="font-bold text-slate-600 dark:text-slate-400">HEX Code</span>} 
                                        name="hexCode" 
                                        rules={[
                                            { required: true, message: 'Please enter HEX code' },
                                            { pattern: /^#([A-Fa-f0-9]{3}){1,2}$/, message: 'Please enter a valid HEX code (e.g. #FFFFFF)' }
                                        ]}
                                    >
                                        <div className="flex gap-3">
                                            <Input 
                                                size="large" 
                                                placeholder="#000000"
                                                value={hexCodeValue}
                                                className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono" 
                                                onChange={(e) => {
                                                    form.setFieldsValue({ hexCode: e.target.value.toUpperCase() });
                                                }}
                                            />
                                            {/* Premium Ant Design ColorPicker */}
                                            <ColorPicker
                                                value={hexCodeValue}
                                                onChange={(color) => {
                                                    form.setFieldsValue({ hexCode: color.toHexString().toUpperCase() });
                                                }}
                                                size="large"
                                                showText
                                            >
                                                <div 
                                                    className="h-12 w-12 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer hover:scale-105 transition-transform active:scale-95"
                                                    style={{ backgroundColor: hexCodeValue }}
                                                />
                                            </ColorPicker>
                                        </div>
                                    </Form.Item>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 min-h-[220px]">
                                    <div 
                                        className="h-24 w-24 rounded-full shadow-2xl ring-4 ring-white dark:ring-slate-700 transition-all duration-300"
                                        style={{ backgroundColor: hexCodeValue }}
                                    />
                                    <p className="mt-4 font-black text-slate-900 dark:text-white tracking-widest uppercase">
                                        {hexCodeValue || 'Preview'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                isLoading={loading || fetching}
                                className="h-12 px-8 rounded-xl flex items-center gap-2 font-bold"
                            >
                                <Save size={18} /> {isEditMode ? 'Update Color' : 'Save Color'}
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate('/colors')}
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

export default ColorForm;
