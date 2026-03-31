import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Switch, Image, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { ArrowLeft, Save, ImageIcon, Link as LinkIcon, Layers } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const BannerForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    // To watch image for real-time preview
    const imageUrl = Form.useWatch('image', form);
    const titleValue = Form.useWatch('title', form);

    // Queries
    const { data: bannerResponse, isLoading: fetching } = Queries.useGetSingleBanner(id);
    
    // Mutations
    const addBanner = Mutations.useAddBanner();
    const editBanner = Mutations.useEditBanner();

    useEffect(() => {
        if (isEditMode && bannerResponse?.data) {
            form.setFieldsValue(bannerResponse.data);
        }
    }, [isEditMode, bannerResponse, form]);

    const onFinish = async (values: any) => {
        const payload = isEditMode ? { ...values, bannerId: id } : values;
        const mutation = isEditMode ? editBanner : addBanner;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200 || res.status === 201) {
                    toast.success(`Banner ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.BANNERS);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} banner`);
            }
        });
    };

    if (isEditMode && fetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Loading Banner Assets...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-4 text-left">
                    <button 
                        onClick={() => navigate(ROUTES.BANNERS)}
                        className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-left">
                        <Breadcrumb 
                            className="mb-1 text-left"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.BANNERS)}>Banners</span> },
                                { title: isEditMode ? 'Edit Banner' : 'Add Banner' }
                            ]}
                        />
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">
                            {isEditMode ? 'Edit Banner' : 'Construct New Banner'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                <Layers size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Composition</h2>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{ isActive: true }}
                            requiredMark={false}
                            className="text-left"
                        >
                            <Form.Item
                                name="title"
                                label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Banner Title</span>}
                                rules={[{ required: true, message: 'Title is required' }]}
                                className="text-left"
                            >
                                <Input placeholder="e.g. Summer Collection 2024" className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="url"
                                label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Click-through Destination (URL)</span>}
                                rules={[{ required: true, message: 'URL is required' }]}
                                className="text-left"
                            >
                                <Input prefix={<LinkIcon size={16} className="text-slate-400 mr-2" />} placeholder="e.g. /products/new-arrivals" className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="image"
                                label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Banner Image Asset URL</span>}
                                rules={[{ required: true, message: 'Image URL is required' }]}
                                className="text-left"
                            >
                                <Input prefix={<ImageIcon size={16} className="text-slate-400 mr-2" />} placeholder="Enter high-res image URL" className="h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 mb-8 mt-2 text-left">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-500 shadow-sm border border-gray-100 dark:border-slate-700">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight text-left">Active Visibility</span>
                                </div>
                                <Form.Item name="isActive" valuePropName="checked" noStyle>
                                    <Switch />
                                </Form.Item>
                            </div>

                            <Button onClick={() => form.submit()} loading={addBanner.isPending || editBanner.isPending} className="w-full h-16 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 text-lg bg-primary-600 hover:bg-primary-700 text-white font-black">
                                <Save size={20} /> {isEditMode ? 'Update Banner' : 'Deploy Banner'}
                            </Button>
                        </Form>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-slate-950 text-white min-h-[400px] flex flex-col text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight text-left">Vantage Preview</h2>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center text-left">
                            {imageUrl ? (
                                <div className="space-y-6 text-left">
                                    <div className="aspect-[21/9] rounded-[40px] overflow-hidden border-4 border-white/10 shadow-2xl relative group">
                                        <Image 
                                            src={imageUrl} 
                                            alt="Banner Preview" 
                                            className="h-full w-full object-cover"
                                            preview={false}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-6 left-8 text-left">
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 text-left">PROMOTION PREVIEW</p>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 text-left">{titleValue || 'UNTITLED BANNER'}</h3>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed text-center">
                                            This is a live rendering of how the banner asset will scale across standard viewport configurations.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 border-4 border-dashed border-white/10 rounded-[40px] text-center">
                                    <div className="h-20 w-20 bg-white/5 rounded-[32px] flex items-center justify-center text-white/20 mb-4 animate-bounce">
                                        <ImageIcon size={40} />
                                    </div>
                                    <h3 className="text-lg font-black text-white/40 uppercase tracking-widest text-center">Asset Required</h3>
                                    <p className="text-white/20 font-medium text-sm max-w-[200px] mt-2 text-center">Enter a valid URL to visualize the banner composition.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BannerForm;
