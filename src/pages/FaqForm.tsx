import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Switch, message } from 'antd';
import { faqAPI, faqCategoryAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save, HelpCircle } from 'lucide-react';

const { Option } = Select;
const { TextArea } = Input;

const FaqForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setFetchingData(true);
                const categoryRes = await faqCategoryAPI.getAll();
                setCategories(categoryRes.data.data.faq_category_data || []);

                if (id) {
                    const faqRes = await faqAPI.getById(id);
                    if (faqRes.data.status === 200) {
                        const faq = faqRes.data.data;
                        form.setFieldsValue({
                            ...faq,
                            faqCategoryId: faq.faqCategoryId?._id || faq.faqCategoryId,
                        });
                    }
                }
            } catch (error) {
                console.error('Fetch initial data error:', error);
                message.error('Failed to load faq data');
            } finally {
                setFetchingData(false);
            }
        };
        fetchInitialData();
    }, [id, form]);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                faqId: id
            };

            const response = id 
                ? await faqAPI.edit(payload)
                : await faqAPI.add(payload);

            if (response.data.status === 200) {
                message.success(`FAQ ${id ? 'updated' : 'added'} successfully`);
                navigate('/faqs');
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
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Accessing Knowledge Repository...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/faqs')}
                    className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {id ? 'Knowledge Adjustment' : 'Author New Entry'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Refine common questions and automated resolutions.</p>
                </div>
            </div>

            <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ isActive: true }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            name="question"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Inquiry Label (Question)</span>}
                            rules={[{ required: true, message: 'Question is required' }]}
                            className="md:col-span-2"
                        >
                            <Input prefix={<HelpCircle size={16} className="text-slate-400 mr-2" />} placeholder="e.g. How do I track my order?" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" />
                        </Form.Item>

                        <Form.Item
                            name="faqCategoryId"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Knowledge Cluster</span>}
                            rules={[{ required: true, message: 'Category is required' }]}
                        >
                            <Select 
                                placeholder="Select Cluster" 
                                className="custom-select h-12"
                                showSearch
                                filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())}
                            >
                                {categories.map(cat => <Option key={cat._id} value={cat._id}>{cat.name}</Option>)}
                            </Select>
                        </Form.Item>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                                <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Resource Active</span>
                            </div>
                            <Form.Item name="isActive" valuePropName="checked" noStyle>
                                <Switch className="custom-switch" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="answer"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Automated Resolution (Answer)</span>}
                            rules={[{ required: true, message: 'Answer is required' }]}
                            className="md:col-span-2"
                        >
                            <TextArea rows={6} placeholder="Provide a clear, detailed resolution..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-[32px] px-8 py-6 font-medium leading-relaxed italic" />
                        </Form.Item>
                    </div>

                    <Button onClick={() => form.submit()} loading={loading} className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 text-lg mt-4">
                        <Save size={20} /> {id ? 'Save Entry' : 'Publish Entry'}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default FaqForm;
