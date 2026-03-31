import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Switch, message } from 'antd';
import { productAPI, categoryAPI, brandAPI, sizeAPI, colorAPI } from '../services/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save, Upload as ShoppingBag, IndianRupee, Layers, Package, Image as ImageIcon, Zap } from 'lucide-react';

const { Option } = Select;
const { TextArea } = Input;

const ProductForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    // Dropdown data
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [sizes, setSizes] = useState<any[]>([]);
    const [colors, setColors] = useState<any[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setFetchingData(true);
                const [catRes, brandRes, sizeRes, colorRes] = await Promise.all([
                    categoryAPI.getAll(),
                    brandAPI.getAll(),
                    sizeAPI.getAll(),
                    colorAPI.getAll()
                ]);

                setCategories(catRes.data.data.category_data || []);
                setBrands(brandRes.data.data.brand_data || []);
                setSizes(sizeRes.data.data.size_data || []);
                setColors(colorRes.data.data.color_data || []);

                if (id) {
                    const productRes = await productAPI.getById(id);
                    if (productRes.data.status === 200) {
                        const product = productRes.data.data;
                        form.setFieldsValue({
                            ...product,
                            categoryId: product.categoryId?._id || product.categoryId,
                            brandId: product.brandId?._id || product.brandId,
                            sizeIds: product.sizeIds?.map((s: any) => s._id || s),
                            colorIds: product.colorIds?.map((c: any) => c._id || c),
                        });
                    }
                }
            } catch (error) {
                console.error('Fetch initial data error:', error);
                message.error('Failed to load product data');
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
                productId: id
            };

            const response = id
                ? await productAPI.edit(payload)
                : await productAPI.add(payload);

            if (response.data.status === 200) {
                message.success(`Product ${id ? 'updated' : 'added'} successfully`);
                navigate('/products');
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
                <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Initializing Product Studio...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mt-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {id ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure your product catalog attributes.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate('/products')} className="h-12 px-6 rounded-2xl border-gray-200 dark:border-slate-700">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={loading} className="h-12 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary-500/20">
                        <Save size={20} /> {id ? 'Save Changes' : 'Publish Product'}
                    </Button>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                initialValues={{ isActive: true, isTrending: false, isDealOfDay: false, stock: 0 }}
                requiredMark={false}
            >
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-8 pb-10">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                <ShoppingBag size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">General Information</h2>
                        </div>

                        <div className="space-y-6">
                            <Form.Item
                                name="title"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> PRODUCT TITLE</span>}
                                rules={[{ required: true, message: 'Title is required' }]}
                            >
                                <Input placeholder="e.g. Premium Cotton Oversized Tee" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> DESCRIPTION</span>}
                                rules={[{ required: true, message: 'Description is required' }]}
                            >
                                <TextArea rows={6} placeholder="Describe your product in detail..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 py-4 font-medium" />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                <IndianRupee size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Pricing & Inventory</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Form.Item
                                name="mrp"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> MRP (MAX PRICE)</span>}
                                rules={[{ required: true, message: 'MRP is required' }]}
                            >
                                <InputNumber controls={false} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" prefix="₹" />
                            </Form.Item>

                            <Form.Item
                                name="sellingPrice"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> SELLING PRICE</span>}
                                rules={[{ required: true, message: 'Selling price is required' }]}
                            >
                                <InputNumber controls={false} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" prefix="₹" />
                            </Form.Item>

                            <Form.Item
                                name="cogsPrice"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">COST PRICE (COGS)</span>}
                            >
                                <InputNumber controls={false} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" prefix="₹" />
                            </Form.Item>

                            <Form.Item
                                name="sku"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> PRODUCT SKU</span>}
                                rules={[{ required: true, message: 'SKU is required' }]}
                            >
                                <Input placeholder="e.g. TEE-BLK-OS" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold uppercase" />
                            </Form.Item>

                            <Form.Item
                                name="stock"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> INITIAL STOCK</span>}
                                rules={[{ required: true, message: 'Stock is required' }]}
                            >
                                <InputNumber controls={false} min={0} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Media & Assets</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Form.Item
                                name="image"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PRODUCT COVER IMAGE</span>}
                                extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block italic">Recommended: 1000x1000px JPG/PNG</span>}
                            >
                                <Input placeholder="Enter image URL" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" />
                            </Form.Item>

                            <Form.Item
                                name="video"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PRODUCT SHOWCASE VIDEO</span>}
                                extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block italic">Link to MP4 or YouTube/Vimeo</span>}
                            >
                                <Input placeholder="Enter video URL" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold" />
                            </Form.Item>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Organization */}
                <div className="space-y-8">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white">
                                <Layers size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Organization</h2>
                        </div>

                        <div className="space-y-6">
                            <Form.Item
                                name="categoryId"
                                label={<span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> CATEGORY</span>}
                                rules={[{ required: true, message: 'Category is required' }]}
                            >
                                <Select
                                    placeholder="Select Category"
                                    className="custom-select h-12"
                                    showSearch
                                    filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())}
                                >
                                    {categories.map(cat => <Option key={cat._id} value={cat._id}>{cat.name}</Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="brandId"
                                label={<span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest"><span className="text-red-500 mr-1">*</span> BRAND</span>}
                                rules={[{ required: true, message: 'Brand is required' }]}
                            >
                                <Select
                                    placeholder="Select Brand"
                                    className="custom-select h-12"
                                    showSearch
                                    filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())}
                                >
                                    {brands.map(brand => <Option key={brand._id} value={brand._id}>{brand.name || brand.title}</Option>)}
                                </Select>
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                                <Package size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Attributes</h2>
                        </div>

                        <div className="space-y-6">
                            <Form.Item
                                name="sizeIds"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AVAILABLE SIZES</span>}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select Sizes"
                                    className="custom-select h-auto"
                                >
                                    {sizes.map(size => <Option key={size._id} value={size._id}>{size.name}</Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="colorIds"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AVAILABLE COLORS</span>}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select Colors"
                                    className="custom-select h-auto"
                                >
                                    {colors.map(color => (
                                        <Option key={color._id} value={color._id}>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.hexCode }} />
                                                {color.name}
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-gray-50/50 dark:bg-slate-800/20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                                <Zap size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Visibility</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                                <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest">Publish Status</span>
                                <Form.Item name="isActive" valuePropName="checked" noStyle>
                                    <Switch className="custom-switch" />
                                </Form.Item>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                                <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest">Trending Product</span>
                                <Form.Item name="isTrending" valuePropName="checked" noStyle>
                                    <Switch className="custom-switch" />
                                </Form.Item>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                                <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest">Deal of the Day</span>
                                <Form.Item name="isDealOfDay" valuePropName="checked" noStyle>
                                    <Switch className="custom-switch-warning" />
                                </Form.Item>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
        </div>
    );
};

export default ProductForm;
