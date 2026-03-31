import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Switch, Breadcrumb } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { ArrowLeft, Save, ShoppingBag, IndianRupee, Layers, Package, ImageIcon, Zap } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TextArea } = Input;

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;

    // Queries for Dropdowns
    const { data: catRes } = Queries.useGetCategory({ limit: 'All' });
    const { data: brandRes } = Queries.useGetBrand({ limit: 'All' });
    const { data: sizeRes } = Queries.useGetSize({ limit: 'All' });
    const { data: colorRes } = Queries.useGetColor({ limit: 'All' });
    
    // Query for Edit Mode
    const { data: productResponse, isLoading: fetching } = Queries.useGetProductById(id);
    
    // Mutations
    const addProduct = Mutations.useAddProduct();
    const editProduct = Mutations.useEditProduct();

    const categories = catRes?.data?.category_data || [];
    const brands = brandRes?.data?.brand_data || [];
    const sizes = sizeRes?.data?.size_data || [];
    const colors = colorRes?.data?.color_data || [];

    useEffect(() => {
        if (isEditMode && productResponse?.data) {
            const product = productResponse.data;
            form.setFieldsValue({
                ...product,
                categoryId: product.categoryId?._id || product.categoryId,
                brandId: product.brandId?._id || product.brandId,
                sizeIds: product.sizeIds?.map((s: any) => s._id || s),
                colorIds: product.colorIds?.map((c: any) => c._id || c),
            });
        }
    }, [isEditMode, productResponse, form]);

    const onFinish = async (values: any) => {
        const payload = {
            ...values,
            productId: id
        };

        const mutation = isEditMode ? editProduct : addProduct;

        mutation.mutate(payload, {
            onSuccess: (res: any) => {
                if (res.status === 200 || res.status === 201) {
                    toast.success(`Product ${isEditMode ? 'updated' : 'added'} successfully`);
                    navigate(ROUTES.PRODUCTS);
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
            }
        });
    };

    if (isEditMode && fetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Initializing Product Studio...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mt-4 border-b border-gray-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-4 text-left">
                    <button
                        onClick={() => navigate(ROUTES.PRODUCTS)}
                        className="h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all text-slate-400 hover:text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-left">
                        <Breadcrumb 
                            className="mb-1 text-left"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.PRODUCTS)}>Products</span> },
                                { title: isEditMode ? 'Edit Product' : 'Add Product' }
                            ]}
                        />
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">
                            {isEditMode ? 'Edit Product' : 'Add New Product'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate(ROUTES.PRODUCTS)} className="h-12 px-6 rounded-2xl border-2 font-bold text-slate-600">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={addProduct.isPending || editProduct.isPending} className="h-12 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black">
                        <Save size={20} /> {isEditMode ? 'Save Changes' : 'Publish Product'}
                    </Button>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
                initialValues={{ isActive: true, isTrending: false, isDealOfDay: false, stock: 0 }}
                requiredMark={false}
            >
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-8 pb-10 text-left">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                <ShoppingBag size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">General Information</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <Form.Item
                                name="title"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> PRODUCT TITLE</span>}
                                rules={[{ required: true, message: 'Title is required' }]}
                                className="text-left"
                            >
                                <Input placeholder="e.g. Premium Cotton Oversized Tee" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> DESCRIPTION</span>}
                                rules={[{ required: true, message: 'Description is required' }]}
                                className="text-left"
                            >
                                <TextArea rows={6} placeholder="Describe your product in detail..." className="bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 py-4 font-medium focus:ring-primary-500 text-left" />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                <IndianRupee size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Pricing & Inventory</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                            <Form.Item
                                name="mrp"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> MRP (MAX PRICE)</span>}
                                rules={[{ required: true, message: 'MRP is required' }]}
                                className="text-left"
                            >
                                <InputNumber controls={false} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold text-left" prefix="₹" />
                            </Form.Item>

                            <Form.Item
                                name="sellingPrice"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> SELLING PRICE</span>}
                                rules={[{ required: true, message: 'Selling price is required' }]}
                                className="text-left"
                            >
                                <InputNumber controls={false} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold text-left" prefix="₹" />
                            </Form.Item>

                            <Form.Item
                                name="cogsPrice"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">COST PRICE (COGS)</span>}
                                className="text-left"
                            >
                                <InputNumber controls={false} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold text-left" prefix="₹" />
                            </Form.Item>

                            <Form.Item
                                name="sku"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> PRODUCT SKU</span>}
                                rules={[{ required: true, message: 'SKU is required' }]}
                                className="text-left"
                            >
                                <Input placeholder="e.g. TEE-BLK-OS" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold uppercase focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="stock"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> INITIAL STOCK</span>}
                                rules={[{ required: true, message: 'Stock is required' }]}
                                className="text-left"
                            >
                                <InputNumber controls={false} min={0} className="w-full h-12 flex items-center bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold text-slate-700 text-left" />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Media & Assets</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <Form.Item
                                name="image"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">PRODUCT COVER IMAGE</span>}
                                extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block italic text-left">Recommended: 1000x1000px JPG/PNG</span>}
                                className="text-left"
                            >
                                <Input placeholder="Enter image URL" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>

                            <Form.Item
                                name="video"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">PRODUCT SHOWCASE VIDEO</span>}
                                extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block italic text-left">Link to MP4 or YouTube/Vimeo</span>}
                                className="text-left"
                            >
                                <Input placeholder="Enter video URL" className="h-12 bg-gray-50 dark:bg-slate-800 border-0 rounded-2xl px-5 font-bold focus:ring-primary-500 text-left" />
                            </Form.Item>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Organization */}
                <div className="space-y-8 text-left">
                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white">
                                <Layers size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Organization</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <Form.Item
                                name="categoryId"
                                label={<span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> CATEGORY</span>}
                                rules={[{ required: true, message: 'Category is required' }]}
                                className="text-left"
                            >
                                <Select
                                    placeholder="Select Category"
                                    className="custom-select h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 [&_.ant-select-selection-item]:font-bold text-left"
                                    showSearch
                                    filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())}
                                >
                                    {categories.map((cat: any) => <Option key={cat._id} value={cat._id}>{cat.name}</Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="brandId"
                                label={<span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> BRAND</span>}
                                rules={[{ required: true, message: 'Brand is required' }]}
                                className="text-left"
                            >
                                <Select
                                    placeholder="Select Brand"
                                    className="custom-select h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 [&_.ant-select-selection-item]:font-bold text-left"
                                    showSearch
                                    filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())}
                                >
                                    {brands.map((brand: any) => <Option key={brand._id} value={brand._id}>{brand.name || brand.title}</Option>)}
                                </Select>
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                                <Package size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Attributes</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <Form.Item
                                name="sizeIds"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left text-left">AVAILABLE SIZES</span>}
                                className="text-left"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select Sizes"
                                    className="custom-select h-auto [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 text-left"
                                >
                                    {sizes.map((size: any) => <Option key={size._id} value={size._id}>{size.name}</Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="colorIds"
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left text-left">AVAILABLE COLORS</span>}
                                className="text-left"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select Colors"
                                    className="custom-select h-auto [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!bg-gray-50/50 [&_.ant-select-selector]:!border-0 text-left"
                                >
                                    {colors.map((color: any) => (
                                        <Option key={color._id} value={color._id}>
                                            <div className="flex items-center gap-2 text-left">
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.hexCode }} />
                                                <span className="font-bold text-left">{color.name}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-gray-50/50 dark:bg-slate-800/20 text-left">
                        <div className="flex items-center gap-3 mb-8 text-left">
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-200 border border-gray-100 dark:border-slate-700">
                                <Zap size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Visibility</h2>
                        </div>

                        <div className="space-y-6 text-left">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-left">
                                <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">Publish Status</span>
                                <Form.Item name="isActive" valuePropName="checked" noStyle>
                                    <Switch />
                                </Form.Item>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-left">
                                <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">Trending Product</span>
                                <Form.Item name="isTrending" valuePropName="checked" noStyle>
                                    <Switch />
                                </Form.Item>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-left">
                                <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">Deal of the Day</span>
                                <Form.Item name="isDealOfDay" valuePropName="checked" noStyle>
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

export default ProductForm;
