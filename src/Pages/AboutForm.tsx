import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Form, Input, InputNumber, Switch, Breadcrumb, Divider, Image } from 'antd';
import Card from '../Components/Card';
import Button from '../Components/Button';
import UploadImage from '../Components/UploadImage';
import type { UploadItem } from '../Utils/Hooks/useUpload';
import { Save, ArrowLeft, Info, ImageIcon, Hash, AlignLeft, X } from 'lucide-react';
import { ROUTES } from '../Constants';
import { Mutations } from '../Api/Mutations';
import { toast } from 'react-toastify';

const AboutForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const isEditMode = !!id;
  const aboutSectionFromState = (location.state as any)?.aboutSection;
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const addAboutSection = Mutations.useAddAboutSection();
  const editAboutSection = Mutations.useEditAboutSection();

  const imageUrl = Form.useWatch('image', form);
  const titleValue = Form.useWatch('title', form);
  const subtitleValue = Form.useWatch('subtitle', form);
  const descriptionValue = Form.useWatch('description', form);

  useEffect(() => {
    if (isEditMode && aboutSectionFromState) {
      form.setFieldsValue({
        ...aboutSectionFromState,
      });
    }
  }, [isEditMode, aboutSectionFromState, form]);

  const onFinish = async (values: any) => {
    const payload: any = {
      ...values,
      ...(isEditMode ? { sectionId: id } : {})
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === '') delete payload[key];
    });

    const mutation = isEditMode ? editAboutSection : addAboutSection;

    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(`About section ${isEditMode ? 'updated' : 'added'} successfully`, {
            toastId: isEditMode ? 'about-section-updated' : 'about-section-added'
          });
          navigate(ROUTES.ABOUT);
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.ABOUT)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800" >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <div className="text-left overflow-hidden">
            <Breadcrumb className="mb-0.5 text-left text-[10px] sm:text-xs" items={[ { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</span> }, { title: <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.ABOUT)}>About</span> }, { title: isEditMode ? 'Edit' : 'Add' } ]} />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">
              {isEditMode ? 'Edit About Section' : 'New About Section'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTES.ABOUT)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">Cancel</Button>
          <Button onClick={() => form.submit()} loading={addAboutSection.isPending || editAboutSection.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
            <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true, priority: 0 }} requiredMark={false} className="text-left">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 sm:gap-8 text-left items-start">
          <Card className="min-w-0 rounded-2xl sm:rounded-[32px] shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left p-4 sm:p-8 self-start">
            <div className="text-left mb-6">
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                <Info size={18} className="text-primary-500 sm:w-5 sm:h-5" /> About Section Details
              </h3>
              <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Title</span>} name="title" className="col-span-2 md:col-span-1 text-left">
                <Input size="large" placeholder="e.g. Crafted with Purpose" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
              </Form.Item>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Priority</span>} name="priority" className="col-span-2 md:col-span-1 text-left">
                <InputNumber<number>
                  min={0}
                  controls={false}
                  parser={(value) => Number((value || '').toString().replace(/[^\d]/g, ''))}
                  className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]"
                  prefix={<Hash size={14} className="text-slate-400" />}
                />
              </Form.Item>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Subtitle</span>} name="subtitle" className="col-span-2 text-left">
                <Input size="large" placeholder="e.g. Built for bold stories" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
              </Form.Item>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Description</span>} name="description" className="col-span-2 text-left">
                <Input.TextArea rows={4} placeholder="Write a short description for this section..." className="rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
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
          </Card>

          <div className="space-y-4 sm:space-y-6 min-w-0">
            <Card className="min-w-0 rounded-[24px] sm:rounded-[32px] border shadow-xl overflow-hidden p-6 sm:p-8 bg-white text-slate-900 dark:bg-slate-950 dark:text-white border-gray-100 dark:border-white/10 flex flex-col text-left h-fit w-full">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 text-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white">
                  <AlignLeft size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Vantage Preview</h2>
              </div>

              <div className="flex flex-col text-left">
                {imageUrl ? (
                  <div className="space-y-4 sm:space-y-6 text-left">
                    <div className="h-56 sm:h-64 rounded-[24px] sm:rounded-[32px] overflow-hidden border-2 sm:border-4 border-gray-100 dark:border-white/10 shadow-2xl relative group w-full">
                      <Image src={imageUrl} alt={titleValue || 'About Section'} className="h-full w-full object-cover" preview={false} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 sm:bottom-5 left-5 sm:left-6 text-left pr-4">
                        <p className="text-[8px] sm:text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5 sm:mb-1 text-left">ABOUT PREVIEW</p>
                        <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-tight line-clamp-1 text-left">{titleValue || 'UNTITLED SECTION'}</h3>
                        <p className="text-[10px] sm:text-xs font-bold text-white/70 line-clamp-1 mt-1 text-left">{subtitleValue || 'SUBTITLE'}</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-white/5 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-white/10 text-left">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-white/50 line-clamp-3 text-left">
                        {descriptionValue || 'Description will appear here for a quick preview.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 border-2 sm:border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[24px] sm:rounded-[32px] text-center">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-[24px] flex items-center justify-center mb-3 sm:mb-4 bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/20">
                      <ImageIcon size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-center">Asset Required</h3>
                    <p className="text-slate-400/80 dark:text-white/20 font-medium text-[10px] sm:text-xs max-w-[200px] mt-1 sm:mt-2 text-center">Enter a valid URL to visualize composition.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 text-left space-y-4">
              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Image URL</span>} name="image" className="text-left mb-0">
                <div className="space-y-3">
                  {imageUrl ? (
                    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={imageUrl} alt="About Section" className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"   />
                        <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                          {imageUrl}
                        </span>
                      </div>
                      <button type="button" onClick={() => form.setFieldsValue({ image: '' })} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600" >
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
            </Card>
          </div>
        </div>
      </Form>

      <UploadImage isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} multiple={false} onSelect={(items: UploadItem[]) => { const first = items[0]; if (first?.url || first?.path) {   form.setFieldsValue({ image: first.url || first.path }); } }} />
    </div>
  );
};

export default AboutForm;
