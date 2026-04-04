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
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <button 
                        onClick={() => navigate(ROUTES.BANNERS)}
                        className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-left overflow-hidden">
                        <Breadcrumb 
                            className="mb-0.5 text-left text-[10px] sm:text-xs"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.BANNERS)}>Banners</span> },
                                { title: isEditMode ? 'Edit' : 'Add' }
                            ]}
                        />
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
                            {isEditMode ? 'Edit Banner' : 'New Banner'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-6 sm:space-y-8">
                    <Card className="rounded-[24px] sm:rounded-[32px] border-0 shadow-xl overflow-hidden p-5 sm:p-8 text-left bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-6 sm:mb-8 text-left">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                <Layers size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Composition</h2>
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
                                label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Banner Title</span>}
                                rules={[{ required: true, message: 'Title is required' }]}
                                className="text-left mb-4 sm:mb-6"
                            >
                                <Input placeholder="e.g. Summer Collection 2024" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="url"
                                label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Click-through Destination (URL)</span>}
                                rules={[{ required: true, message: 'URL is required' }]}
                                className="text-left mb-4 sm:mb-6"
                            >
                                <Input prefix={<LinkIcon size={14} className="text-slate-400 mr-2 sm:w-4 sm:h-4" />} placeholder="e.g. /products/new-arrivals" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="image"
                                label={<span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-left">Banner Image Asset URL</span>}
                                rules={[{ required: true, message: 'Image URL is required' }]}
                                className="text-left mb-4 sm:mb-6"
                            >
                                <Input prefix={<ImageIcon size={14} className="text-slate-400 mr-2 sm:w-4 sm:h-4" />} placeholder="Enter high-res image URL" className="h-12 sm:h-14 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl sm:rounded-2xl px-4 sm:px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-700 mb-6 sm:mb-8 mt-2 text-left">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight text-left">Active Visibility</span>
                                </div>
                                <Form.Item name="isActive" valuePropName="checked" noStyle>
                                    <Switch size="small" className="sm:scale-110" />
                                </Form.Item>
                            </div>

                            <Button onClick={() => form.submit()} loading={addBanner.isPending || editBanner.isPending} className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 sm:text-lg bg-primary-600 hover:bg-primary-700 text-white font-black">
                                <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Update' : 'Deploy'} Banner
                            </Button>
                        </Form>
                    </Card>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    <Card className="rounded-[24px] sm:rounded-[32px] border shadow-xl overflow-hidden p-6 sm:p-8 bg-white text-slate-900 dark:bg-slate-950 dark:text-white border-gray-100 dark:border-white/10 min-h-[300px] sm:min-h-[400px] flex flex-col text-left">
                        <div className="flex items-center gap-3 mb-6 sm:mb-8 text-left">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white">
                                <ImageIcon size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Vantage Preview</h2>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center text-left">
                            {imageUrl ? (
                                <div className="space-y-4 sm:space-y-6 text-left">
                                    <div className="aspect-[21/9] rounded-[24px] sm:rounded-[40px] overflow-hidden border-2 sm:border-4 border-gray-100 dark:border-white/10 shadow-2xl relative group">
                                        <Image 
                                            src={imageUrl} 
                                            alt="Banner Preview" 
                                            className="h-full w-full object-cover"
                                            preview={false}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 sm:bottom-6 left-5 sm:left-8 text-left pr-4">
                                            <p className="text-[8px] sm:text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5 sm:mb-1 text-left">PROMOTION PREVIEW</p>
                                            <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-tight line-clamp-1 text-left">{titleValue || 'UNTITLED BANNER'}</h3>
                                        </div>
                                    </div>
                                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-white/10 text-center">
                                        <p className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest leading-relaxed text-center">
                                            Responsive asset rendering check.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 border-2 sm:border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[24px] sm:rounded-[40px] text-center">
                                    <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-xl sm:rounded-[32px] flex items-center justify-center mb-3 sm:mb-4 bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/20 animate-bounce">
                                        <ImageIcon size={30} className="sm:w-10 sm:h-10" />
                                    </div>
                                    <h3 className="text-sm sm:text-lg font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-center">Asset Required</h3>
                                    <p className="text-slate-400/80 dark:text-white/20 font-medium text-[10px] sm:text-sm max-w-[180px] sm:max-w-[200px] mt-1 sm:mt-2 text-center">Enter a valid URL to visualize composition.</p>
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
