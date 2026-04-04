import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Switch, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import UploadImage from '../Components/UploadImage';
import type { UploadItem } from '../Utils/Hooks/useUpload';
import { ArrowLeft, Save, ImageIcon, Layout, Tag, Hash, FileText, X } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const BlogForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // To watch values for real-time preview
    const imageUrl = Form.useWatch('thumbnail', form);
    const titleValue = Form.useWatch('title', form);
    const taglineValue = Form.useWatch('tagLine', form);

    // Queries
    const { data: blogResponse, isLoading: fetching } = Queries.useGetSingleBlog(id);
    const { data: categoryResponse } = Queries.useGetCategory();
    const categories = categoryResponse?.data?.category_data || [];
    
    // Mutations
    const addBlog = Mutations.useAddBlog();
    const editBlog = Mutations.useEditBlog();

    useEffect(() => {
        if (isEditMode && blogResponse?.data) {
            const data = blogResponse.data;
            form.setFieldsValue({
                ...data,
                categoryIds: Array.isArray(data?.categoryIds)
                    ? data.categoryIds.map((item: any) => item?._id || item).filter(Boolean)
                    : data?.categoryIds,
            });
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
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <button onClick={() => navigate(ROUTES.BLOGS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800" >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-left overflow-hidden">
                        <Breadcrumb 
                            className="mb-0.5 text-left text-[10px] sm:text-xs"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.BLOGS)}>Blogs</span> },
                                { title: isEditMode ? 'Edit' : 'Add' }
                            ]}
                        />
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
                            {isEditMode ? 'Edit Article' : 'New Article'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Button variant="ghost" onClick={() => navigate(ROUTES.BLOGS)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={addBlog.isPending || editBlog.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
                        <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }} className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 sm:gap-8 text-left" requiredMark={false} >
                <div className="space-y-6 sm:space-y-8 text-left min-w-0">
                    <Card className="rounded-[24px] sm:rounded-[40px] border-0 shadow-xl overflow-hidden p-6 sm:p-8 bg-white dark:bg-slate-900 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 text-left">
                                <Layout size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Article Infrastructure</h2>
                        </div>

                        <Form.Item name="title" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Main Headline</span>} rules={[{ required: true, message: 'Title is required' }]} className="text-left" >
                            <Input placeholder="Enter a captivating title..." className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-6 text-lg font-black uppercase tracking-tight focus:ring-primary-500 text-left" />
                        </Form.Item>

                        <Form.Item name="urlSlug" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">URL Slug</span>} rules={[{ required: !isEditMode, message: 'URL slug is required' }]} className="text-left" >
                            <Input prefix={<Hash size={14} className="text-slate-400 mr-2" />} placeholder="e.g. summer-style-guide" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                        </Form.Item>

                        <Form.Item name="tagLine" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Tagline</span>} className="text-left" >
                            <Input prefix={<Tag size={14} className="text-slate-300 mr-2" />} placeholder="Short, punchy tagline" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                        </Form.Item>

                        <Form.Item name="description" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Description</span>} className="text-left" >
                            <TextArea rows={10} placeholder="Write the blog description..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-[32px] px-8 py-6 font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic focus:ring-primary-500 text-left" />
                        </Form.Item>
                    </Card>

                    <Card className="rounded-[24px] sm:rounded-[40px] border-0 shadow-xl overflow-hidden p-6 sm:p-8 bg-white dark:bg-slate-900 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">SEO Snapshot</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <Form.Item name="titleTag" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Title Tag</span>} className="text-left" >
                                <Input placeholder="SEO title tag" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item name="imageAltText" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Image Alt Text</span>} className="text-left" >
                                <Input placeholder="Describe the thumbnail" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>
                        </div>

                        <Form.Item name="metaDescription" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Meta Description</span>} className="text-left" >
                            <TextArea rows={4} placeholder="SEO meta description" className="bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-6 py-4 font-medium text-slate-600 dark:text-slate-300 focus:ring-primary-500 text-left" />
                        </Form.Item>
                    </Card>
                </div>

                <div className="space-y-8 text-left min-w-0">
                    <Card className="min-w-0 rounded-[40px] border shadow-xl overflow-hidden p-8 bg-white text-slate-900 dark:bg-slate-950 dark:text-white border-gray-100 dark:border-white/10 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Vantage Preview</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <div className="aspect-square rounded-[40px] overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl relative group text-left">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Blog Cover" className="h-full w-full object-cover text-left" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-300 dark:text-white/10 text-left"><ImageIcon size={64} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-8 right-8 text-left">
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 block text-left">COVER IMAGE</span>
                                    <h3 className="text-sm font-black text-white leading-tight line-clamp-2 uppercase tracking-tighter text-left">{titleValue || 'TITLE PREVIEW'}</h3>
                                    <p className="text-[10px] font-bold text-white/70 mt-1 line-clamp-1 uppercase tracking-widest">{taglineValue || 'TAGLINE'}</p>
                                </div>
                            </div>

                            <Form.Item  name="thumbnail"  label={<span className="text-xs font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-left">Thumbnail</span>}  rules={[{ required: !isEditMode, message: 'Thumbnail is required' }]}  className="text-left" >
                                <div className="space-y-3">
                                    {imageUrl ? (
                                        <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                    src={imageUrl}
                                                    alt="Blog Thumbnail"
                                                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                                                />
                                                <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                                                    {imageUrl}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => form.setFieldsValue({ thumbnail: '' })}
                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-400 uppercase tracking-widest font-black">
                                            No image selected
                                        </div>
                                    )}

                                    <Button type="button" onClick={() => setIsUploadOpen(true)} className="h-11 px-5 rounded-xl font-bold flex items-center gap-2" variant="secondary" >
                                        <ImageIcon size={16} /> Choose Image
                                    </Button>
                                </div>
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-gray-100 dark:border-slate-800">
                                <Tag size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Taxonomy</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <Form.Item name="tags" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Tags</span>} className="text-left" >
                                <Select mode="tags" placeholder="Add relevant tags" className="custom-select h-auto [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 text-left" />
                            </Form.Item>

                            <Form.Item name="categoryIds" label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Categories</span>} className="text-left" >
                                <Select mode="multiple" placeholder="Select categories" className="custom-select h-auto [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 text-left" showSearch filterOption={(input, option) =>
                                        ((option?.children as any) || '')
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {categories.map((category: any) => (
                                        <Select.Option key={category._id} value={category._id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
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

            <UploadImage  isOpen={isUploadOpen}  onClose={() => setIsUploadOpen(false)}  multiple={false}  onSelect={(items: UploadItem[]) => {  const first = items[0];  if (first?.url || first?.path) {      form.setFieldsValue({ thumbnail: first.url || first.path });  } }} />
        </div>
    );
};

export default BlogForm;
