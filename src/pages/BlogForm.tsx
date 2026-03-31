import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Switch, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { ArrowLeft, Save, User, ImageIcon, Layout } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const BlogForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    // To watch values for real-time preview
    const imageUrl = Form.useWatch('image', form);
    const titleValue = Form.useWatch('title', form);

    // Queries
    const { data: blogResponse, isLoading: fetching } = Queries.useGetSingleBlog(id);
    
    // Mutations
    const addBlog = Mutations.useAddBlog();
    const editBlog = Mutations.useEditBlog();

    useEffect(() => {
        if (isEditMode && blogResponse?.data) {
            form.setFieldsValue(blogResponse.data);
        }
    }, [isEditMode, blogResponse, form]);

    const onFinish = async (values: any) => {
        const payload = isEditMode ? { ...values, blogId: id } : values;
        const mutation = isEditMode ? editBlog : addBlog;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200 || res.status === 201) {
                    toast.success(`Blog ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.BLOGS);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} blog`);
            }
        });
    };

    if (isEditMode && fetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Entering Ghostwriter Protocol...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mt-4 border-b border-gray-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-4 text-left">
                    <button
                        onClick={() => navigate(ROUTES.BLOGS)}
                        className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-left">
                        <Breadcrumb 
                            className="mb-1 text-left"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.BLOGS)}>Blogs</span> },
                                { title: isEditMode ? 'Edit Blog' : 'Add Blog' }
                            ]}
                        />
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">
                            {isEditMode ? 'Editorial Adjustment' : 'Author New Narrative'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate(ROUTES.BLOGS)} className="h-12 px-6 rounded-2xl border-2 font-bold text-slate-600">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={addBlog.isPending || editBlog.isPending} className="h-12 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black">
                        <Save size={20} /> {isEditMode ? 'Update Article' : 'Publish Article'}
                    </Button>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ isActive: true }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
                requiredMark={false}
            >
                <div className="lg:col-span-2 space-y-8 text-left">
                    <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 text-left">
                                <Layout size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Article Infrastructure</h2>
                        </div>

                        <Form.Item
                            name="title"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Main Headline</span>}
                            rules={[{ required: true, message: 'Title is required' }]}
                            className="text-left"
                        >
                            <Input placeholder="Enter a captivating title..." className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-6 text-lg font-black uppercase tracking-tight focus:ring-primary-500 text-left" />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Editorial Content</span>}
                            rules={[{ required: true, message: 'Content is required' }]}
                            className="text-left"
                        >
                            <TextArea rows={12} placeholder="Start writing your story..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-[32px] px-8 py-6 font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic focus:ring-primary-500 text-left" />
                        </Form.Item>
                    </Card>
                </div>

                <div className="space-y-8 text-left">
                    <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden p-8 bg-slate-950 text-white text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight text-left">Vantage Preview</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <div className="aspect-square rounded-[40px] overflow-hidden bg-white/5 border border-white/10 shadow-2xl relative group text-left">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Blog Cover" className="h-full w-full object-cover text-left" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-white/10 text-left"><ImageIcon size={64} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-8 right-8 text-left">
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 block text-left">COVER IMAGE</span>
                                    <h3 className="text-sm font-black text-white leading-tight line-clamp-2 uppercase tracking-tighter text-left">{titleValue || 'TITLE PREVIEW'}</h3>
                                </div>
                            </div>

                            <Form.Item
                                name="image"
                                label={<span className="text-xs font-black text-white/40 uppercase tracking-widest text-left text-white/40">Cover Image Asset URL</span>}
                                rules={[{ required: true, message: 'Image URL is required' }]}
                                className="text-left"
                            >
                                <Input prefix={<ImageIcon size={14} className="text-white/20 mr-2" />} placeholder="Enter high-res image URL" className="h-12 bg-white/5 border-white/10 rounded-2xl px-4 text-white focus:bg-white/10 focus:border-white/20 transition-all font-bold text-left" />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Author Details</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <Form.Item
                                name="author"
                                label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Writer Attribution</span>}
                                rules={[{ required: true, message: 'Author name is required' }]}
                                className="text-left"
                            >
                                <Input prefix={<User size={14} className="text-slate-300 mr-2" />} placeholder="e.g. Editorial Team" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="tags"
                                label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Taxonomy (Tags)</span>}
                                className="text-left"
                            >
                                <Select mode="tags" placeholder="Add relevant tags" className="custom-select h-auto [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 text-left" />
                            </Form.Item>

                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 text-left">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight text-left">Active Visibility</span>
                                </div>
                                <Form.Item name="isActive" valuePropName="checked" noStyle>
                                    <Switch />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
        </div>
    );
};

export default BlogForm;
