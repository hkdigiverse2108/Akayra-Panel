import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Switch, Breadcrumb, Divider, DatePicker } from 'antd';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { Save, ArrowLeft, Ticket, Calendar, Percent } from 'lucide-react';
import { ROUTES } from '../Constants';
import { Mutations } from '../Api/Mutations';
import { Queries } from '../Api/Queries';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const COUPON_TYPES = [
  { label: 'Percent Off', value: 'percentOff' },
  { label: 'Flat Off', value: 'flatOff' },
  { label: 'Buy X Get Y', value: 'buyXgetY' },
  { label: 'Prepaid Discount', value: 'prepaidDiscount' },
];

const CouponForm: React.FC = () => {
  //local state and hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const isEditMode = !!id;
  const selectedType = Form.useWatch('type', form);
  const couponFromState = (location.state as any)?.coupon;

  // API hooks
  const addCoupon = Mutations.useAddCoupon();
  const editCoupon = Mutations.useEditCoupon();
  const { data: productRes } = Queries.useGetProduct();
  const products = productRes?.data?.product_data || [];

  // Effect to populate form in edit mode
  useEffect(() => {
    if (isEditMode && couponFromState) {
      const normalizedProductIds = Array.isArray(couponFromState?.productIds)
        ? couponFromState.productIds.map((p: any) => (typeof p === 'string' ? p : p?._id)).filter(Boolean)
        : undefined;
      form.setFieldsValue({
        ...couponFromState,
        expiryDate: couponFromState?.expiryDate ? dayjs(couponFromState.expiryDate) : undefined,
        productIds: normalizedProductIds,
      });
    }
  }, [isEditMode, couponFromState, form]);

  const onFinish = async (values: any) => {
    const type = values.type;
    const payload: any = {
      ...values,
      expiryDate: values.expiryDate ? dayjs(values.expiryDate).toISOString() : undefined,
      ...(isEditMode ? { couponId: id } : {})
    };

    if (type !== 'percentOff') delete payload.discountPercent;
    if (type !== 'flatOff' && type !== 'prepaidDiscount') delete payload.discountAmount;
    if (type !== 'buyXgetY') {
      delete payload.buyQty;
      delete payload.getFreeQty;
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === '') delete payload[key];
    });
    const mutation = isEditMode ? editCoupon : addCoupon;

    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(`Coupon ${isEditMode ? 'updated' : 'added'} successfully`, {
            toastId: isEditMode ? 'coupon-updated' : 'coupon-added'
          });
          navigate(ROUTES.COUPONS);
        }
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} coupon`);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.COUPONS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800" >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <div className="text-left overflow-hidden">
            <Breadcrumb
              className="mb-0.5 text-left text-[10px] sm:text-xs"
              items={[
                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> },
                { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.COUPONS)}>Coupons</span> },
                { title: isEditMode ? 'Edit' : 'Add' }
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
              {isEditMode ? 'Edit Coupon' : 'New Coupon'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTES.COUPONS)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">Cancel</Button>
          <Button onClick={() => form.submit()} loading={addCoupon.isPending || editCoupon.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
            <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl sm:rounded-[32px] shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left p-4 sm:p-8">
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }} requiredMark={false} className="max-w-4xl mx-auto py-2 sm:py-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
            <div className="col-span-2 text-left">
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                <Ticket size={18} className="text-primary-500 sm:w-5 sm:h-5" /> Coupon Details
              </h3>
              <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
            </div>

            <Form.Item  label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Coupon Code</span>}  name="code"  rules={[{ required: true, message: 'Please enter coupon code' }]}  className="col-span-2 md:col-span-1 text-left" >
              <Input size="large" placeholder="e.g. SUMMER20" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </Form.Item>

            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Type</span>} name="type" rules={[{ required: true, message: 'Please select coupon type' }]} className="col-span-2 md:col-span-1 text-left" >
              <Select size="large" options={COUPON_TYPES} placeholder="Select type" className="custom-select h-12 rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
            </Form.Item>

            {selectedType === 'percentOff' && (
              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Discount %</span>} name="discountPercent" rules={[{ required: true, message: 'Discount percent is required' }]} className="col-span-2 md:col-span-1 text-left" >
                <InputNumber min={0} max={100} controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" prefix={<Percent size={14} className="text-slate-400" />} />
              </Form.Item>
            )}

            {(selectedType === 'flatOff' || selectedType === 'prepaidDiscount') && (
              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Discount Amount</span>} name="discountAmount" rules={[{ required: true, message: 'Discount amount is required' }]} className="col-span-2 md:col-span-1 text-left" >
                <InputNumber min={0} controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" prefix="₹" />
              </Form.Item>
            )}

            {selectedType === 'buyXgetY' && (
              <>
                <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Buy Qty</span>} name="buyQty" rules={[{ required: true, message: 'Buy quantity is required' }]} className="col-span-2 md:col-span-1 text-left" >
                  <InputNumber min={0} controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" />
                </Form.Item>

                <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Get Free Qty</span>} name="getFreeQty" rules={[{ required: true, message: 'Free quantity is required' }]} className="col-span-2 md:col-span-1 text-left" >
                  <InputNumber min={0} controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" />
                </Form.Item>
              </>
            )}

            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Min Order Amount</span>} name="minOrderAmount" className="col-span-2 md:col-span-1 text-left" >
              <InputNumber min={0} controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" prefix="₹" />
            </Form.Item>

            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Max Discount Cap</span>} name="maxDiscountCap" className="col-span-2 md:col-span-1 text-left" >
              <InputNumber min={0} controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" prefix="₹" />
            </Form.Item>

            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Product IDs</span>} name="productIds" className="col-span-2 text-left" >
              <Select mode="multiple" size="large" placeholder="Select products" showSearch optionFilterProp="label" className="custom-select h-12 rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" options={products.map((product: any) => ({ value: product._id, label: product.title || product.name || product._id }))} />
            </Form.Item>

            <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Expiry Date</span>} name="expiryDate" className="col-span-2 md:col-span-1 text-left" >
              <DatePicker size="large" format="DD-MM-YYYY" className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-picker-input>input]:!h-12 [&_.ant-picker-input>input]:!leading-[48px]" suffixIcon={<Calendar size={14} className="text-slate-400" />} />
            </Form.Item>

            <div className="col-span-2">
              <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 text-left">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight text-left">Active Status</span>
                </div>
                <Form.Item name="isActive" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CouponForm;
