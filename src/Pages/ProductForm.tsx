import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Switch, Breadcrumb, Tabs } from 'antd';
import { Queries } from '../Api/Queries';
import { Mutations } from '../Api/Mutations';
import Card from '../Components/Card';
import Button from '../Components/Button';
import ProductPreview from '../Components/ProductPreview';
import { ArrowLeft, Save, ShoppingBag, IndianRupee, Layers, Package, ImageIcon, Zap, X } from 'lucide-react';
import { ROUTES } from '../Constants';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TextArea } = Input;

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isEditMode = !!id;
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [imageUrlError, setImageUrlError] = useState('');

    // Queries for Dropdowns
    const { data: catRes } = Queries.useGetCategory();
    const { data: brandRes } = Queries.useGetBrand();
    const { data: sizeRes } = Queries.useGetSize();
    const { data: colorRes } = Queries.useGetColor();
    
    // Query for Edit Mode
    const { data: productResponse, isLoading: fetching } = Queries.useGetProductById(id);
    
    // Mutations
    const addProduct = Mutations.useAddProduct();
    const editProduct = Mutations.useEditProduct();

    const categories = catRes?.data?.category_data || [];
    const brands = brandRes?.data?.brand_data || [];
    const sizes = sizeRes?.data?.size_data || [];
    const colors = colorRes?.data?.color_data || [];

    const watchedTitle = Form.useWatch('title', form);
    const watchedThumbnail = Form.useWatch('thumbnail', form);
    const watchedImages = Form.useWatch('images', form);
    const watchedMrp = Form.useWatch('mrp', form);
    const watchedSellingPrice = Form.useWatch('sellingPrice', form);
    const watchedSku = Form.useWatch('sku', form);
    const watchedCategoryId = Form.useWatch('categoryId', form);
    const watchedBrandId = Form.useWatch('brandId', form);
    const watchedSizeIds = Form.useWatch('sizeIds', form);
    const watchedColorIds = Form.useWatch('colorIds', form);
    const watchedLongDescription = Form.useWatch('longDescription', form);
    const watchedAdditionalInformation = Form.useWatch('additionalInformation', form);
    const watchedIsTrending = Form.useWatch('isTrending', form);
    const watchedIsDealOfDay = Form.useWatch('isDealOfDay', form);
    const watchedIsActive = Form.useWatch('isActive', form);

    const categoryName = categories.find((c: any) => c._id === watchedCategoryId)?.name;
    const brandName = brands.find((b: any) => b._id === watchedBrandId)?.name || brands.find((b: any) => b._id === watchedBrandId)?.title;
    const sizeNames = sizes.filter((s: any) => (watchedSizeIds || []).includes(s._id)).map((s: any) => s.name);
    const colorMeta = colors.filter((c: any) => (watchedColorIds || []).includes(c._id)).map((c: any) => ({ name: c.name, hexCode: c.hexCode }));

    const toolbarModules = useMemo( () => ({
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                [{ align: [] }],
                ['clean'],
            ],
        }),
        []
    );

    const generalInfoCard = (
        <Card className="rounded-2xl sm:rounded-[32px] border-0 shadow-xl overflow-hidden p-4 sm:p-8 text-left">
            <div className="flex items-center gap-3 mb-6 sm:mb-8 text-left">
                <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                    <ShoppingBag size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">General Information</h2>
            </div>

            <div className="space-y-6 text-left">
                <Form.Item name="title" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> PRODUCT TITLE</span>} rules={[{ required: true, message: 'Title is required' }]} className="text-left" >
                    <Input size="large" placeholder="e.g. Premium Cotton Oversized Tee" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>

                <Form.Item name="shortDescription" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">SHORT DESCRIPTION</span>} className="text-left" >
                    <TextArea rows={3} placeholder="One-liner or short summary..." className="rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>

                <Form.Item name="longDescription" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">LONG DESCRIPTION</span>} className="text-left" valuePropName="value" getValueFromEvent={(value) => value} >
                    <ReactQuill className="policy-quill" theme="snow" modules={toolbarModules} placeholder="Describe your product in deta" />
                </Form.Item>

                <Form.Item name="additionalInformation" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">ADDITIONAL INFORMATION</span>} className="text-left" >
                    <TextArea rows={4} placeholder="Materials, care, warranty, etc." className="rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>
            </div>
        </Card>
    );

    const pricingCard = (
        <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
            <div className="flex items-center gap-3 mb-8 text-left">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                    <IndianRupee size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Pricing & Inventory</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <Form.Item name="mrp" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> MRP (MAX PRICE)</span>} rules={[{ required: true, message: 'MRP is required' }]} className="text-left" >
                    <InputNumber controls={false} size="large" className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" prefix="₹" />
                </Form.Item>

                <Form.Item name="sellingPrice" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> SELLING PRICE</span>} rules={[{ required: true, message: 'Selling price is required' }]} className="text-left" >
                    <InputNumber controls={false} size="large" className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" prefix="₹" />
                </Form.Item>

                <Form.Item name="cogsPrice" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">COST PRICE (COGS)</span>} className="text-left" >
                    <InputNumber controls={false} size="large" className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" prefix="₹" />
                </Form.Item>

                <Form.Item name="sku" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">PRODUCT SKU</span>} className="text-left" >
                    <Input size="large" placeholder="e.g. TEE-BLK-OS" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>
            </div>
        </Card>
    );

    const addImageUrl = () => {
        const raw = imageUrlInput.trim();
        if (!raw) {return};
        const urls = raw.split(/[\s,;]+/).map((item) => item.trim()).filter(Boolean);
        const currentImages = (form.getFieldValue('images') || []) as string[];
        const nextImages = [...currentImages];
        let hasDuplicate = false;
        urls.forEach((url) => {
            if (!nextImages.includes(url)) {
                nextImages.push(url);
            } else {
                hasDuplicate = true;
            }
        });
        form.setFieldsValue({ images: nextImages });
        setImageUrlInput('');
        setImageUrlError(hasDuplicate ? 'Image URL already exists' : '');
    };

    const removeImageUrl = (urlToRemove: string) => {
        const currentImages = (form.getFieldValue('images') || []) as string[];
        form.setFieldsValue({ images: currentImages.filter((img) => img !== urlToRemove) });
    };

    const mediaCard = (
        <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
            <div className="flex items-center gap-3 mb-8 text-left">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                    <ImageIcon size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Media & Assets</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <Form.Item name="thumbnail" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">PRODUCT THUMBNAIL</span>} extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block italic text-left">Recommended: 1000x1000px JPG/PNG</span>} className="text-left" >
                    <Input size="large" placeholder="Enter image URL" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>

                <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">PRODUCT IMAGES</span>} extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block italic text-left">Add multiple image URLs</span>} className="text-left" >
                    <div className="space-y-3">
                        <Form.Item name="images" hidden>
                            <Input type="hidden" />
                        </Form.Item>
                        <div className="flex gap-2">
                                <Input size="large" placeholder="Paste image URL and click Add" value={imageUrlInput} onChange={(e) => { setImageUrlInput(e.target.value);
                                        if (imageUrlError) {
                                            setImageUrlError('');
                                        }
                                    }}
                                    onPressEnter={(e) => {
                                        e.preventDefault();
                                        addImageUrl();
                                    }}
                                    className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700"
                                />
                            <Button type="button" onClick={addImageUrl} className="h-12 px-4 rounded-xl font-bold" > Add </Button>
                        </div>
                        {imageUrlError && (
                            <div className="text-xs text-red-500 font-bold">{imageUrlError}</div>
                        )}

                        <Form.Item shouldUpdate={(prev, next) => prev.images !== next.images} noStyle>
                            {() => {
                                const imageList = (form.getFieldValue('images') || []) as string[];
                                if (!imageList.length) {
                                    return (
                                        <div className="text-xs text-slate-400 uppercase tracking-widest font-black">
                                            No images added yet
                                        </div>
                                    );
                                }
                                return (
                                    <div className="space-y-2">
                                        {imageList.map((url) => (
                                            <div key={url} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" >
                                                <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                                                    {url}
                                                </span>
                                                <button type="button" onClick={() => removeImageUrl(url)} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-700 dark:hover:text-red-700" >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        </Form.Item>
                    </div>
                </Form.Item>
            </div>
        </Card>
    );

    const organizationCard = (
        <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-3 mb-8 text-left">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white">
                    <Layers size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Organization</h2>
            </div>

            <div className="space-y-6 text-left">
                <Form.Item name="categoryId" label={<span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-left"><span className="text-red-500 mr-1">*</span> CATEGORY</span>} rules={[{ required: true, message: 'Category is required' }]} className="text-left" >
                    <Select size="large" placeholder="Select Category" className="custom-select h-12 rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" showSearch filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())} >
                        {categories.map((cat: any) => <Option key={cat._id} value={cat._id}>{cat.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item name="brandId" label={<span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-left">BRAND</span>} className="text-left" >
                    <Select size="large" placeholder="Select Brand" className="custom-select h-12 rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" showSearch filterOption={(input, option) => (option?.children as any).toLowerCase().includes(input.toLowerCase())} >
                        {brands.map((brand: any) => <Option key={brand._id} value={brand._id}>{brand.name || brand.title}</Option>)}
                    </Select>
                </Form.Item>
            </div>
        </Card>
    );

    const attributesCard = (
        <Card className="rounded-[32px] border-0 shadow-xl overflow-hidden p-8 text-left">
            <div className="flex items-center gap-3 mb-8 text-left">
                <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                    <Package size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Attributes</h2>
            </div>

            <div className="space-y-6 text-left">
                <Form.Item name="sizeIds" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left text-left">AVAILABLE SIZES</span>} className="text-left" >
                    <Select mode="multiple" size="large" placeholder="Select Sizes" className="custom-select h-auto rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!min-h-[48px] [&_.ant-select-selector]:!py-1 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" >
                        {sizes.map((size: any) => <Option key={size._id} value={size._id}>{size.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item name="colorIds" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left text-left">AVAILABLE COLORS</span>} className="text-left" >
                    <Select mode="multiple" size="large" placeholder="Select Colors" className="custom-select h-auto rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!min-h-[48px] [&_.ant-select-selector]:!py-1 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" >
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
    );

    const visibilityCard = (
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
    );

    useEffect(() => {
        if (isEditMode && productResponse?.data) {
            const product = productResponse.data;
            form.setFieldsValue({
                ...product,
                categoryId: product.categoryId?._id || product.categoryId,
                brandId: product.brandId?._id || product.brandId,
                sizeIds: product.sizeIds?.map((s: any) => s._id || s),
                colorIds: product.colorIds?.map((c: any) => c._id || c),
                thumbnail: product.thumbnail || product.image || product.thumbnailUrl,
                images: product.images || [],
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
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
                <div className="flex items-center gap-3 sm:gap-4 text-left">
                    <button onClick={() => navigate(ROUTES.PRODUCTS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800" >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-left overflow-hidden">
                        <Breadcrumb 
                            className="mb-0.5 text-left text-[10px] sm:text-xs"
                            items={[
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.PRODUCTS)}>Products</span> },
                                { title: isEditMode ? 'Edit' : 'Add' }
                            ]}
                        />
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
                            {isEditMode ? 'Edit Product' : 'New Product'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Button variant="ghost" onClick={() => navigate(ROUTES.PRODUCTS)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">Cancel</Button>
                    <Button onClick={() => form.submit()} loading={addProduct.isPending || editProduct.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
                        <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </div>

            <Form  form={form}  layout="vertical"  onFinish={onFinish}  className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 text-left"  initialValues={{ isActive: true, isTrending: false, isDealOfDay: false, longDescription: '' }}  requiredMark={false} >
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 pb-10 text-left">
                    <Tabs
                        defaultActiveKey="general"
                        destroyInactiveTabPane={false}
                        className="rounded-2xl"
                        items={[
                            { key: 'general', label: <span className="text-sm font-semibold">General</span>, forceRender: true, children: <div className="space-y-6">{generalInfoCard}</div> },
                            { key: 'pricing', label: <span className="text-sm font-semibold">Pricing</span>, forceRender: true, children: <div className="space-y-6">{pricingCard}</div> },
                            { key: 'media', label: <span className="text-sm font-semibold">Media</span>, forceRender: true, children: <div className="space-y-6">{mediaCard}</div> },
                            { key: 'organization', label: <span className="text-sm font-semibold">Organization</span>, forceRender: true, children: <div className="space-y-6">{organizationCard}</div> },
                            { key: 'attributes', label: <span className="text-sm font-semibold">Attributes</span>, forceRender: true, children: <div className="space-y-6">{attributesCard}</div> },
                            { key: 'visibility', label: <span className="text-sm font-semibold">Visibility</span>, forceRender: true, children: <div className="space-y-6">{visibilityCard}</div> },
                        ]}
                    />
                </div>

                {/* Right Column: Preview */}
                <div className="space-y-8 text-left">
                    <ProductPreview title={watchedTitle} thumbnail={watchedThumbnail} images={watchedImages} mrp={watchedMrp} sellingPrice={watchedSellingPrice} sku={watchedSku} categoryName={categoryName} brandName={brandName} sizes={sizeNames} colors={colorMeta} longDescription={watchedLongDescription} additionalInformation={watchedAdditionalInformation} isTrending={watchedIsTrending} isDealOfDay={watchedIsDealOfDay} isActive={watchedIsActive} />
                </div>
            </Form>
        </div>
    );
};

export default ProductForm;

