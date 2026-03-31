import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Rate, Switch, Avatar, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { ArrowLeft, Save, Star, User, ShoppingBag, MessageSquare } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TextArea } = Input;

const ReviewForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    const ratingValue = Form.useWatch('rating', form);

    // Queries for Dropdowns
    const { data: productRes } = Queries.useGetProduct();
    const { data: userRes } = Queries.useGetUser();
    
    // Query for Edit Mode
    const { data: reviewResponse, isLoading: fetching } = Queries.useGetSingleReview(id);
    
    // Mutations
    const addReview = Mutations.useAddReview();
    const editReview = Mutations.useEditReview();

    const products = productRes?.data?.product_data || [];
    const users = userRes?.data?.user_data || [];

    useEffect(() => {
        if (isEditMode && reviewResponse?.data) {
            const review = reviewResponse.data;
            form.setFieldsValue({
                ...review,
                productId: review.productId?._id || review.productId,
                userId: review.userId?._id || review.userId,
            });
        }
    }, [isEditMode, reviewResponse, form]);

    const onFinish = async (values: any) => {
        const payload = isEditMode ? { ...values, reviewId: id } : values;
        const mutation = isEditMode ? editReview : addReview;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200 || res.status === 201) {
                    toast.success(`Review ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.REVIEWS);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} review`);
            }
        });
    };

    if (isEditMode && fetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Accessing Moderator Console...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <button
                        onClick={() => navigate(ROUTES.REVIEWS)}
                        className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-left overflow-hidden">
                        <Breadcrumb 
                            className="mb-0.5 text-left text-[10px] sm:text-xs"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.REVIEWS)}>Reviews</span> },
                                { title: isEditMode ? 'Edit' : 'Add' }
                            ]}
                        />
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
                            {isEditMode ? 'Edit Review' : 'New Feedback'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Button variant="ghost" onClick={() => navigate(ROUTES.REVIEWS)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={addReview.isPending || editReview.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
                        <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Save' : 'Publish'}
                    </Button>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ isActive: true, rating: 5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
                requiredMark={false}
            >
                <div className="space-y-6 sm:space-y-8">
                    <Card className="rounded-[24px] sm:rounded-[32px] border-0 shadow-xl overflow-hidden p-6 sm:p-8 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                <Star size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Metric & Core</h2>
                        </div>

                        <Form.Item
                            name="rating"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sentiment Score</span>}
                            rules={[{ required: true }]}
                        >
                            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                                <Rate className="text-4xl text-yellow-500 mb-2" />
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{ratingValue || 0}.0 Stars</span>
                            </div>
                        </Form.Item>

                        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 mt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Approved Status</span>
                            </div>
                            <Form.Item name="isActive" valuePropName="checked" noStyle>
                                <Switch />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                                <MessageSquare size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Feedback Text</h2>
                        </div>

                        <Form.Item
                            name="comment"
                            label={<span className="text-xs font-black text-slate-400 uppercase tracking-widest">User Commentary</span>}
                            rules={[{ required: true, message: 'Comment is required' }]}
                        >
                            <TextArea rows={5} placeholder="What did the user have to say?" className="bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 py-4 font-medium italic focus:ring-primary-500" />
                        </Form.Item>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-slate-950 text-white min-h-[400px]">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">Contextual Linkage</h2>
                        </div>

                        <div className="space-y-10">
                            <Form.Item
                                name="userId"
                                label={<div className="flex items-center gap-2 mb-2"><User size={14} className="text-white/40" /><span className="text-xs font-black text-white/40 uppercase tracking-widest">Reviewing User</span></div>}
                                rules={[{ required: true, message: 'User is required' }]}
                            >
                                <Select 
                                    placeholder="Select User" 
                                    className="custom-select-dark h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-white/10 [&_.ant-select-selection-item]:text-white [&_.ant-select-selection-placeholder]:text-white/20"
                                    showSearch
                                    filterOption={(input, option) => 
                                        (option?.label as string || '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {users.map((user: any) => (
                                        <Option key={user._id} value={user._id} label={user.fullName || user.firstName}>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="small" src={user.profilePicture} icon={<User size={12} />} />
                                                <span className="font-bold">{user.fullName || `${user.firstName} ${user.lastName}`}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="productId"
                                label={<div className="flex items-center gap-2 mb-2"><ShoppingBag size={14} className="text-white/40" /><span className="text-xs font-black text-white/40 uppercase tracking-widest">Subject Product</span></div>}
                                rules={[{ required: true, message: 'Product is required' }]}
                            >
                                <Select 
                                    placeholder="Select Product" 
                                    className="custom-select-dark h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-white/10 [&_.ant-select-selection-item]:text-white [&_.ant-select-selection-placeholder]:text-white/20"
                                    showSearch
                                    filterOption={(input, option) => 
                                        (option?.label as string || '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {products.map((product: any) => (
                                        <Option key={product._id} value={product._id} label={product.title}>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="small" src={product.image} icon={<ShoppingBag size={12} />} />
                                                <span className="font-bold">{product.title}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 text-center mt-auto">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                                    Linking internal entities ensures data integrity across the customer feedback ecosystem.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
        </div>
    );
};

export default ReviewForm;
