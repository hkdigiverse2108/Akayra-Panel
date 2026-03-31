import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Switch, message } from 'antd';
import { blogAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save, User, Image as ImageIcon, Layout } from 'lucide-react';
const { TextArea } = Input;

const BlogForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const imageUrl = Form.useWatch('image', form);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    setFetchingData(true);
                    const response = await blogAPI.getById(id);
                    if (response.data.status === 200) {
                        form.setFieldsValue(response.data.data);
                    }
                } catch (error) {
                    console.error('Fetch blog error:', error);
                    message.error('Failed to load blog data');
                } finally {
                    setFetchingData(false);
                }
            };
            fetchBlog();
        }
    }, [id, form]);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                blogId: id
            };

            const response = id
                ? await blogAPI.edit(payload)
                : await blogAPI.add(payload);

            if (response.data.status === 200) {
                message.success(`Blog ${id ? 'updated' : 'added'} successfully`);
                navigate('/blogs');
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
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Entering Ghostwriter Protocol...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 sticky top-0 z-20 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mt-4 border-b border-gray-100 dark:border-slate-800">
                <button
                    onClick={() => navigate('/blogs')}
                    className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {id ? 'Editorial Adjustment' : 'Author New Narrative'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Compose high-end editorial content and lifestyle articles.</p>
                </div>
                <div className="ml-auto text-right md:block hidden">
                    <Button onClick={() => form.submit()} loading={loading} className="h-12 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary-500/20">
                        <Save size={20} /> {id ? 'Update Article' : 'Publish Article'}
                    </Button>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ isActive: true }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                <Layout size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Article Infrastructure</h2>
                        </div>

                        <Form.Item
                            name="title"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Main Headline</span>}
                            rules={[{ required: true, message: 'Title is required' }]}
                        >
                            <Input placeholder="Enter a captivating title..." className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-6 text-lg font-black uppercase tracking-tight" />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Editorial Content</span>}
                            rules={[{ required: true, message: 'Content is required' }]}
                        >
                            <TextArea rows={12} placeholder="Start writing your story..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-[32px] px-8 py-6 font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic" />
                        </Form.Item>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden p-8 bg-slate-950 text-white">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Vantage Preview</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="aspect-square rounded-[40px] overflow-hidden bg-white/5 border border-white/10 shadow-2xl relative group">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Blog Cover" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-white/10"><ImageIcon size={64} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-8 right-8">
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 block">COVER IMAGE</span>
                                    <h3 className="text-sm font-black text-white leading-tight line-clamp-2 uppercase tracking-tighter">{form.getFieldValue('title') || 'TITLE PREVIEW'}</h3>
                                </div>
                            </div>

                            <Form.Item
                                name="image"
                                label={<span className="text-xs font-black text-white/40 uppercase tracking-widest">Cover Image Asset URL</span>}
                                rules={[{ required: true, message: 'Image URL is required' }]}
                            >
                                <Input prefix={<ImageIcon size={14} className="text-white/20 mr-2" />} placeholder="Enter high-res image URL" className="custom-input-dark h-12" />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Author Details</h2>
                        </div>

                        <div className="space-y-6">
                            <Form.Item
                                name="author"
                                label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Writer Attribution</span>}
                                rules={[{ required: true, message: 'Author name is required' }]}
                            >
                                <Input prefix={<User size={14} className="text-slate-300 mr-2" />} placeholder="e.g. Editorial Team" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" />
                            </Form.Item>

                            <Form.Item
                                name="tags"
                                label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Taxonomy (Tags)</span>}
                            >
                                <Select mode="tags" placeholder="Add relevant tags" className="custom-select h-auto" />
                            </Form.Item>

                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Active Visibility</span>
                                </div>
                                <Form.Item name="isActive" valuePropName="checked" noStyle>
                                    <Switch className="custom-switch" />
                                </Form.Item>
                            </div>

                            <Button onClick={() => form.submit()} loading={loading} className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 md:hidden">
                                <Save size={20} /> {id ? 'Save Article' : 'Publish Narrative'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </Form>
        </div>
    );
};

export default BlogForm;
