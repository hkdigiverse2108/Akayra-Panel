import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Form, Input, InputNumber, Switch, Breadcrumb, Divider, Image, Select } from "antd";
import Card from "../Components/Card";
import Button from "../Components/Button";
import { Save, ArrowLeft, Instagram, ImageIcon, Link as LinkIcon, Hash, Video } from "lucide-react";
import { ROUTES } from "../Constants";
import { Mutations } from "../Api/Mutations";
import { toast } from "react-toastify";

const IgPostForm: React.FC = () => {
  //state and hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const isEditMode = !!id;
  const igPostFromState = (location.state as any)?.igPost;

  const addIgPost = Mutations.useAddIgPost();
  const editIgPost = Mutations.useEditIgPost();

  const imageUrl = Form.useWatch("image", form);
  const videoUrl = Form.useWatch("video", form);
  const titleValue = Form.useWatch("title", form);
  const typeValue = Form.useWatch("type", form);

  useEffect(() => {
    if (isEditMode && igPostFromState) {
      form.setFieldsValue({
        ...igPostFromState,
      });
    }
  }, [isEditMode, igPostFromState, form]);

  const onFinish = async (values: any) => {
    const payload: any = {
      ...values,
      ...(isEditMode ? { igPostId: id } : {}),
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") delete payload[key];
    });

    const mutation = isEditMode ? editIgPost : addIgPost;

    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(`IG post ${isEditMode ? "updated" : "added"} successfully`, {
            toastId: isEditMode ? "ig-post-updated" : "ig-post-added",
          });
          navigate(ROUTES.IG_POSTS);
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-100 dark:border-slate-800 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.IG_POSTS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <div className="text-left overflow-hidden">
            <Breadcrumb
              className="mb-0.5 text-left text-[10px] sm:text-xs"
              items={[
                {
                  title: (
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.DASHBOARD)}>
                      Dashboard
                    </span>
                  ),
                },
                {
                  title: (
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.IG_POSTS)}>
                      IG Posts
                    </span>
                  ),
                },
                { title: isEditMode ? "Edit" : "Add" },
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">{isEditMode ? "Edit IG Post" : "New IG Post"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTES.IG_POSTS)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400 flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={() => form.submit()} loading={addIgPost.isPending || editIgPost.isPending} className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black flex-1 sm:flex-none">
            <Save size={18} className="sm:w-5 sm:h-5" /> {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true, priority: 0 }} requiredMark={false} className="text-left">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 text-left items-start">
          <Card className="rounded-2xl sm:rounded-[32px] shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left p-4 sm:p-8 self-start">
            <div className="text-left mb-6">
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                <Instagram size={18} className="text-primary-500 sm:w-5 sm:h-5" /> IG Post Details
              </h3>
              <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Title</span>} name="title" className="col-span-2 md:col-span-1 text-left">
                <Input size="large" placeholder="e.g. Summer Drop" className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
              </Form.Item>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Priority</span>} name="priority" className="col-span-2 md:col-span-1 text-left">
                <InputNumber min={0} controls={false} className="w-full h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700 [&_.ant-input-number-input]:!h-12 [&_.ant-input-number-input]:!leading-[48px]" prefix={<Hash size={14} className="text-slate-400" />} />
              </Form.Item>

              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Link</span>} name="link" className="col-span-2 text-left">
                <Input size="large" placeholder="e.g. https://instagram.com/..." prefix={<LinkIcon size={14} className="text-slate-400" />} className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
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

          <div className="space-y-4 sm:space-y-6">
            <Card className="rounded-[24px] sm:rounded-[32px] border shadow-xl overflow-hidden p-6 sm:p-8 bg-white text-slate-900 dark:bg-slate-950 dark:text-white border-gray-100 dark:border-white/10 min-h-[320px] sm:min-h-[360px] flex flex-col text-left">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 text-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white">
                  <ImageIcon size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">Vantage Preview</h2>
              </div>

              <div className="flex-1 flex flex-col justify-center text-left">
                {typeValue === "video" ? (
                  videoUrl ? (
                    <div className="space-y-4 sm:space-y-6 text-left">
                      <div className="aspect-[4/4] rounded-[24px] sm:rounded-[32px] overflow-hidden border-2 sm:border-4 border-gray-100 dark:border-white/10 shadow-2xl relative group bg-black">
                        <video src={videoUrl} controls className="h-full w-full object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 border-2 sm:border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[24px] sm:rounded-[32px] text-center">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-[24px] flex items-center justify-center mb-3 sm:mb-4 bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/20">
                        <Video size={28} className="sm:w-8 sm:h-8" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-center">Video Required</h3>
                      <p className="text-slate-400/80 dark:text-white/20 font-medium text-[10px] sm:text-xs max-w-[200px] mt-1 sm:mt-2 text-center">Enter a valid video URL to preview.</p>
                    </div>
                  )
                ) : typeValue === "image" ? (
                  imageUrl ? (
                    <div className="space-y-4 sm:space-y-6 text-left">
                      <div className="aspect-[4/4] rounded-[24px] sm:rounded-[32px] overflow-hidden border-2 sm:border-4 border-gray-100 dark:border-white/10 shadow-2xl relative group">
                        <Image src={imageUrl} alt={titleValue || "IG Post"} className="h-full w-full object-cover" preview={false} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 sm:bottom-5 left-5 sm:left-6 text-left pr-4">
                          <p className="text-[8px] sm:text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5 sm:mb-1 text-left">IG PREVIEW</p>
                          <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-tight line-clamp-1 text-left">{titleValue || "UNTITLED POST"}</h3>
                        </div>
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
                  )
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 border-2 sm:border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[24px] sm:rounded-[32px] text-center">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-[24px] flex items-center justify-center mb-3 sm:mb-4 bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/20">
                      <ImageIcon size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-center">Select Type</h3>
                    <p className="text-slate-400/80 dark:text-white/20 font-medium text-[10px] sm:text-xs max-w-[200px] mt-1 sm:mt-2 text-center">Choose image or video to enable preview.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 text-left space-y-4">
              <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Type</span>} name="type" rules={[{ required: true, message: "Type is required" }]} className="text-left mb-0">
                <Select
                  size="large"
                  placeholder="Select type"
                  options={[
                    { label: "Image", value: "image" },
                    { label: "Video", value: "video" },
                  ]}
                  className="custom-select h-12 rounded-xl overflow-hidden [&_.ant-select-selector]:!rounded-xl text-left dark:bg-slate-800 dark:text-white dark:border-slate-700"
                />
              </Form.Item>{" "}
              <br />
              {typeValue === "video" ? (
                <Form.Item
                  label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Video URL</span>}
                  name="video"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        return getFieldValue("type") === "video" && !value ? Promise.reject(new Error("Video URL is required")) : Promise.resolve();
                      },
                    }),
                  ]}
                  className="text-left mb-0"
                >
                  <Input size="large" placeholder="https://..." prefix={<Video size={14} className="text-slate-400" />} className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>
              ) : typeValue === "image" ? (
                <Form.Item
                  label={<span className="font-bold text-slate-600 dark:text-slate-400 text-left">Image URL</span>}
                  name="image"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        return getFieldValue("type") === "image" && !value ? Promise.reject(new Error("Image URL is required")) : Promise.resolve();
                      },
                    }),
                  ]}
                  className="text-left mb-0"
                >
                  <Input size="large" placeholder="https://..." prefix={<ImageIcon size={14} className="text-slate-400" />} className="h-12 rounded-xl focus:ring-primary-500 text-left dark:bg-slate-800 dark:text-white dark:border-slate-700" />
                </Form.Item>
              ) : (
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 text-left">Select a type to enable the asset input.</div>
              )}
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default IgPostForm;
