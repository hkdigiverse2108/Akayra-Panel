import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Switch, Divider, Image, Modal } from 'antd';
import Card from '../Components/Card';
import Button from '../Components/Button';
import UploadImage from '../Components/UploadImage';
import type { UploadItem } from '../Utils/Hooks/useUpload';
import { Mutations } from '../Api/Mutations';
import { Queries } from '../Api/Queries';
import { Save, Settings, Mail, Phone, MapPin, Link as LinkIcon, IndianRupee, Truck, CreditCard, ShieldCheck, ImageIcon, Edit3, X, KeyRound, Lock, type LucideIcon } from 'lucide-react';

const { TextArea } = Input;

const parseImages = (value?: string) => (value || '').split('\n').map((item) => item.trim()).filter(Boolean);

type SettingsTabId = 'contact' | 'social' | 'delivery' | 'payment' | 'secure';

const tabs: { id: SettingsTabId; label: string; title: string; description: string; icon: LucideIcon; }[] = [
  { id: 'contact', label: 'Contact', title: 'Contact Details', description: 'Shown across invoice, footer, and contact section.', icon: MapPin,},
  { id: 'social', label: 'Social', title: 'Social Links', description: 'Connect your public profiles.', icon: LinkIcon,},
  { id: 'delivery', label: 'Delivery', title: 'Delivery Rules', description: 'Manage checkout and stock behavior.', icon: Truck,},
  { id: 'payment', label: 'Payment', title: 'Payment Methods', description: 'Choose checkout options for customers.', icon: CreditCard,},
  { id: 'secure', label: 'Secure', title: 'Secure Payment Banner', description: 'Highlight trust badges on checkout.', icon: ShieldCheck,},
];

const SettingsManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTabId>('contact');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { data: settingsResponse, isLoading, isFetching } = Queries.useGetSettings();
  const updateSettings = Mutations.useUpdateSettings();

  const settings = useMemo(() => (settingsResponse as any)?.data || null, [settingsResponse]);
  const paymentImagesValue = Form.useWatch('securePaymentImages', form);
  const paymentImages = useMemo(() => parseImages(paymentImagesValue), [paymentImagesValue]);
  const isRazorpayEnabled = Form.useWatch('isRazorpay', form);
  const isPhonePeEnabled = Form.useWatch('isPhonePe', form);

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        ...settings,
        securePaymentImages: Array.isArray(settings?.securePaymentImages)
          ? settings.securePaymentImages.join('\n')
          : settings?.securePaymentImages || '',
      });
    }
  }, [settings, form]);

  const handleCancel = () => {
    if (settings) {
      form.setFieldsValue({
        ...settings,
        securePaymentImages: Array.isArray(settings?.securePaymentImages)
          ? settings.securePaymentImages.join('\n')
          : settings?.securePaymentImages || '',
      });
    } else {
      form.resetFields();
    }
    setIsEditing(false);
  };

  const handleSubmit = () => {
    form.submit();
  };

  const openImageModal = (imageUrl: string) => {
    setActiveImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      securePaymentImages: parseImages(values?.securePaymentImages),
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || payload[key] === undefined) delete payload[key];
    });

    updateSettings.mutate(payload, {
      onSuccess: (res: any) => {
        if (res?.status === 200) {
          setIsEditing(false);
        }
      },
    });
  };

  if (isLoading && !settings) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
            <Settings size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Store Settings</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black">
              <Edit3 size={16} /> Edit Settings
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={handleCancel} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400">
                <X size={16} /> Cancel
              </Button>
              <Button onClick={handleSubmit} loading={updateSettings.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black">
                <Save size={16} /> Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} disabled={!isEditing} initialValues={{ isOutOfStockProductShow: true, freeDeliveryAbove: 0, isCODAvailable: true, isRazorpay: false, isPhonePe: false, isShipRocket: false, isCashFree: false, }} className="text-left" >
        <Card className="rounded-[15px] sm:rounded-[25px] shadow-xl border border-gray-100 dark:border-slate-800 p-4 sm:p-8 text-left">
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 sm:gap-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 p-2 rounded-2xl overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap ${ isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700' }`} type="button" >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                {(() => {
                  const activeTabMeta = tabs.find((tab) => tab.id === activeTab);
                  const ActiveTabIcon = activeTabMeta?.icon || Settings;
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-6 text-left">
                        <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                          <ActiveTabIcon size={18} />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            {activeTabMeta?.title}
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">{activeTabMeta?.description}</p>
                        </div>
                      </div>

                      {activeTab === 'contact' && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                            <Form.Item  label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Contact Number</span>}  name="contact"  className="text-left"  rules={[  { required: true, message: 'Contact number is required' },  { pattern: /^\d{10}$/, message: 'Enter a valid 10-digit number' },  ]} >
                              <Input size="large" prefix={<Phone size={14} className="text-slate-400" />} placeholder="+91 99999 99999" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                            </Form.Item>
                            <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Support Email</span>} name="email" className="text-left" rules={[ { required: true, message: 'Email is required' }, { type: 'email', message: 'Enter a valid email' }, ]} >
                              <Input size="large" prefix={<Mail size={14} className="text-slate-400" />} placeholder="support@brand.com" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                            </Form.Item>
                          </div>

                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Address</span>} name="address" className="text-left">
                            <TextArea rows={3} placeholder="Warehouse address or registered office" className="rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                          </Form.Item>
                        </div>
                      )}

                      {activeTab === 'social' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Instagram</span>} name="instagram" className="text-left">
                          <Input size="large" prefix={<LinkIcon size={14} className="text-slate-400" />} placeholder="https://instagram.com/..." className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                          </Form.Item>
                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Facebook</span>} name="facebook" className="text-left">
                          <Input size="large" prefix={<LinkIcon size={14} className="text-slate-400" />} placeholder="https://facebook.com/..." className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                          </Form.Item>
                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">YouTube</span>} name="youtube" className="text-left">
                          <Input size="large" prefix={<LinkIcon size={14} className="text-slate-400" />} placeholder="https://youtube.com/..." className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                          </Form.Item>
                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Twitter</span>} name="twitter" className="text-left">
                          <Input size="large" prefix={<LinkIcon size={14} className="text-slate-400" />} placeholder="https://twitter.com/..." className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                          </Form.Item>
                        </div>
                      )}

                      {activeTab === 'delivery' && (
                        <div className="space-y-5">
                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Free Delivery Above</span>} name="freeDeliveryAbove" className="text-left">
                            <InputNumber controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" prefix={<IndianRupee size={14} className="text-slate-400" />} />
                          </Form.Item>
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-left">
                            <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">Show Out of Stock Products</span>
                            <Form.Item name="isOutOfStockProductShow" valuePropName="checked" noStyle>
                              <Switch />
                            </Form.Item>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-left">
                            <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">ShipRocket Enabled</span>
                            <Form.Item name="isShipRocket" valuePropName="checked" noStyle>
                              <Switch />
                            </Form.Item>
                          </div>
                        </div>
                      )}

                      {activeTab === 'payment' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-left">
                            <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">Cash On Delivery</span>
                            <Form.Item name="isCODAvailable" valuePropName="checked" noStyle>
                              <Switch />
                            </Form.Item>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-left">
                              <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">Razorpay</span>
                              <Form.Item name="isRazorpay" valuePropName="checked" noStyle>
                                <Switch />
                              </Form.Item>
                            </div>
                            {isRazorpayEnabled && (
                              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">API Key</span>}
                                    name="razorpayApiKey"
                                    className="text-left"
                                  >
                                    <Input size="large" prefix={<KeyRound size={14} className="text-slate-400" />} placeholder="rzp_test_xxxxxxxxxx" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                                  </Form.Item>
                                  <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">API Secret</span>}
                                    name="razorpayApiSecret"
                                    className="text-left"
                                  >
                                    <Input.Password size="large" prefix={<Lock size={14} className="text-slate-400" />} placeholder="••••••••••••" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                                  </Form.Item>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-left">
                              <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">PhonePe</span>
                              <Form.Item name="isPhonePe" valuePropName="checked" noStyle>
                                <Switch />
                              </Form.Item>
                            </div>
                            {isPhonePeEnabled && (
                              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">API Key</span>} name="phonePeApiKey" className="text-left" >
                                    <Input size="large" prefix={<KeyRound size={14} className="text-slate-400" />} placeholder="M23HF..." className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                                  </Form.Item>
                                  <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">API Secret</span>} name="phonePeApiSecret" className="text-left" >
                                    <Input.Password size="large" prefix={<Lock size={14} className="text-slate-400" />} placeholder="••••••••••••" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                                  </Form.Item>
                                  <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Version</span>} name="phonePeApiVersion" className="text-left" >
                                    <Input size="large" placeholder="1" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                                  </Form.Item>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-left">
                            <span className="text-xs font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest text-left">CashFree</span>
                            <Form.Item name="isCashFree" valuePropName="checked" noStyle>
                              <Switch />
                            </Form.Item>
                          </div>
                        </div>
                      )}

                      {activeTab === 'secure' && (
                        <div className="space-y-4">

                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Title</span>} name="securePaymentTitle" className="text-left">
                            <Input size="large" placeholder="e.g. 100% Secure Payments" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                          </Form.Item>

                          <Form.Item label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Badge Images</span>} name="securePaymentImages" className="text-left" extra={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block italic text-left">Select multiple images.</span>} >
                            <div className="space-y-3">
                              <Button  type="button"  onClick={() => setIsUploadOpen(true)}  className="h-11 px-5 rounded-xl font-bold flex items-center gap-2"  variant="secondary"  disabled={!isEditing}   >
                                <ImageIcon size={16} /> Choose Images
                              </Button>

                              <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/40 p-4 overflow-visible">
                                {paymentImages.length > 0 ? (
                                  <div className="flex flex-wrap gap-4">
                                    {paymentImages.map((imageUrl, index) => (
                                      <div key={`${imageUrl}-${index}`} className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden relative group/badge">
                                        {imageUrl ? (
                                          <button type="button" onClick={() => openImageModal(imageUrl)} className="relative h-full w-full cursor-pointer" title="View image" >
                                            <Image src={imageUrl} alt="Secure payment badge" preview={false} className="h-full w-full object-contain" fallback="" />
                                            <div className="absolute inset-0 bg-black/0 group-hover/badge:bg-black/30 transition-colors" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/badge:opacity-100 transition-opacity">
                                              <div className="h-9 w-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                                                <ImageIcon size={18} />
                                              </div>
                                            </div>
                                          </button>
                                        ) : (
                                          <ImageIcon size={22} className="text-slate-300" />
                                        )}
                                        {isEditing && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = paymentImages.filter((_, i) => i !== index);
                                              form.setFieldsValue({ securePaymentImages: next.join('\n') });
                                            }}
                                            className="absolute -top-0 -right-0 h-7 w-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-red-600 flex items-center justify-center shadow-md"
                                            aria-label="Remove badge"
                                          >
                                            <X size={16} />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    No badges selected
                                  </div>
                                )}
                              </div>
                            </div>
                          </Form.Item>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {isFetching && (
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Refreshing settings...</div>
            )}
          </div>
        </Card>
      </Form>

      <UploadImage isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} multiple={true} onSelect={(items: UploadItem[]) => { const urls = items.map((item) => item?.url || item?.path).filter(Boolean) as string[]; if (urls.length === 0) return; const merged = Array.from(new Set([...paymentImages, ...urls])); form.setFieldsValue({ securePaymentImages: merged.join('\n') }); }} />

      <Modal open={isImageModalOpen} onCancel={() => setIsImageModalOpen(false)} footer={null} centered closable closeIcon={<X size={16} />} width={520} destroyOnClose className="product-image-modal" >
        <div className="space-y-3">
          <div className="text-base font-black text-slate-900 dark:text-white">Secure Badge</div>
          {activeImage ? (
            <div className="flex justify-center">
              <Image src={activeImage} alt="Secure badge" preview={false} className="rounded-2xl object-contain max-h-[60vh] max-w-full" />
            </div>
          ) : (
            <div className="h-48 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              No image available.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SettingsManagement;
