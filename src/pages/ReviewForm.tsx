import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Rate, Switch, message, Avatar } from 'antd';
import { reviewAPI, productAPI, userAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save, Star, User, ShoppingBag, MessageSquare } from 'lucide-react';
const { Option } = Select;
const { TextArea } = Input;

const ReviewForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    
    // Dropdown data
    const [products, setProducts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const ratingValue = Form.useWatch('rating', form);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setFetchingData(true);
                const [productRes, userRes] = await Promise.all([
                    productAPI.getAll(),
                    userAPI.getAll()
                ]);
                
                setProducts(productRes.data.data.product_data || []);
                setUsers(userRes.data.data.user_data || []);

                if (id) {
                    const reviewRes = await reviewAPI.getById(id);
                    if (reviewRes.data.status === 200) {
                        const review = reviewRes.data.data;
                        form.setFieldsValue({
                            ...review,
                            productId: review.productId?._id || review.productId,
                            userId: review.userId?._id || review.userId,
                        });
                    }
                }
            } catch (error) {
                console.error('Fetch initial data error:', error);
                message.error('Failed to load review data');
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
                reviewId: id
            };

            const response = id 
                ? await reviewAPI.edit(payload)
                : await reviewAPI.add(payload);

            if (response.data.status === 200) {
                message.success(`Review ${id ? 'updated' : 'added'} successfully`);
                navigate('/reviews');
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
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Accessing Moderator Console...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/reviews')}
                    className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {id ? 'Review Adjustment' : 'Administrative Feedback'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Curate user experiences and verify feedback.</p>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ isActive: true, rating: 5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <div className="space-y-8">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
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
                                <Switch className="custom-switch" />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
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
                            <TextArea rows={5} placeholder="What did the user have to say?" className="bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 py-4 font-medium italic" />
                        </Form.Item>

                        <Button onClick={() => form.submit()} loading={loading} className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 mt-4">
                            <Save size={20} /> {id ? 'Save Adjustments' : 'Publish Feedback'}
                        </Button>
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
                                    className="custom-select-dark h-12"
                                    showSearch
                                    filterOption={(input, option) => 
                                        (option?.label as string || '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {users.map(user => (
                                        <Option key={user._id} value={user._id} label={user.fullName || user.firstName}>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="small" src={user.profilePicture} icon={<User size={12} />} />
                                                {user.fullName}
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
                                    className="custom-select-dark h-12"
                                    showSearch
                                    filterOption={(input, option) => (option?.children as any).props.children[2].toLowerCase().includes(input.toLowerCase())}
                                >
                                    {products.map(product => (
                                        <Option key={product._id} value={product._id} label={product.title}>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="small" src={product.image} icon={<ShoppingBag size={12} />} />
                                                {product.title}
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
