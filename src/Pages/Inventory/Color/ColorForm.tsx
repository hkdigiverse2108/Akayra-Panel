import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Divider, ColorPicker, Breadcrumb } from "antd";
import { Queries } from "../../../Api/Queries";
import { Mutations } from "../../../Api/Mutations";
import Card from "../../../Components/Card";
import Button from "../../../Components/Button";
import { Palette, Save, ArrowLeft } from "lucide-react";
import { ROUTES } from "../../../Constants";
import namer from "color-namer";

const ColorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  // To watch hexCode for real-time preview
  const hexCodeValue = Form.useWatch("hexCode", form);

  // Queries
  const { data: colorResponse, isLoading: fetching } = Queries.useGetSingleColor(id);

  // Mutations
  const addColor = Mutations.useAddColor();
  const editColor = Mutations.useEditColor();

  useEffect(() => {
    const data = colorResponse as any;
    if (isEditMode && data?.data) {
      form.setFieldsValue(data.data);
    }
  }, [isEditMode, colorResponse, form]);

  useEffect(() => {
    if (hexCodeValue && /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hexCodeValue)) {
      try {
        const names = namer(hexCodeValue);
        if (names && names.ntc && names.ntc[0]) {
          const closestName = names.ntc[0].name;
          // Only set if field is empty or user hasn't typed much?
          // Actually sticking to original logic
          form.setFieldsValue({ name: closestName });
        }
      } catch (error) {}
    }
  }, [hexCodeValue, form]);

  const onFinish = async (values: any) => {
    const payload = isEditMode ? { ...values, colorId: id } : values;
    const colorMutation = isEditMode ? editColor : addColor;

    colorMutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          navigate(ROUTES.COLORS);
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3 sm:gap-4 text-left">
          <button onClick={() => navigate(ROUTES.COLORS)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl sm:rounded-2xl transition-all shadow-sm hover:shadow text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-gray-100 dark:border-slate-800">
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
                    <span className="cursor-pointer hover:text-primary-500 transition-colors" onClick={() => navigate(ROUTES.COLORS)}>
                      Colors
                    </span>
                  ),
                },
                { title: isEditMode ? "Edit" : "Add" },
              ]}
            />
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left truncate">{isEditMode ? "Edit Color" : "Add New Color"}</h1>
          </div>
        </div>
      </div>

      <Card className="rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden bg-white dark:bg-slate-900 text-left">
        <div className="p-0 sm:p-1 text-left">
          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true, hexCode: "#000000" }} requiredMark={false} className="max-w-3xl mx-auto p-5 sm:py-8 text-left">
            <div className="space-y-6 sm:space-y-8 text-left">
              <div className="text-left">
                <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 text-left">
                  <Palette size={18} className="text-primary-500 sm:w-5 sm:h-5" /> Appearance
                </h3>
                <Divider className="my-2 sm:my-3 border-slate-100 dark:border-slate-800 text-left" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start text-left">
                <div className="space-y-4 sm:space-y-6 text-left">
                  <Form.Item label={<span className="font-bold text-slate-600 dark:text-slate-400 text-sm sm:text-base text-left">Color Name</span>} name="name" rules={[{ required: true, message: "Please enter color name" }]} className="text-left mb-4 sm:mb-6">
                    <Input size="large" placeholder="e.g. Midnight Blue" className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-primary-500 text-left" />
                  </Form.Item>

                  <Form.Item
                    label={<span className="font-bold text-slate-600 dark:text-slate-400 text-sm sm:text-base text-left">HEX Code</span>}
                    name="hexCode"
                    rules={[
                      { required: true, message: "Please enter HEX code" },
                      { pattern: /^#([A-Fa-f0-9]{3}){1,2}$/, message: "Please enter a valid HEX code (e.g. #FFFFFF)" },
                    ]}
                    className="text-left mb-0"
                  >
                    <div className="flex gap-2 sm:gap-3 text-left">
                      <Input
                        size="large"
                        placeholder="#000000"
                        value={hexCodeValue}
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono focus:ring-primary-500 text-left uppercase"
                        onChange={(e) => {
                          form.setFieldsValue({ hexCode: e.target.value.toUpperCase() });
                        }}
                      />
                      <ColorPicker
                        value={hexCodeValue}
                        onChange={(color) => {
                          form.setFieldsValue({ hexCode: color.toHexString().toUpperCase() });
                        }}
                        size="large"
                      >
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer hover:scale-105 transition-transform active:scale-95" style={{ backgroundColor: hexCodeValue }} />
                      </ColorPicker>
                    </div>
                  </Form.Item>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 min-h-[160px] sm:min-h-[220px] text-center">
                  <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-full shadow-2xl ring-4 ring-white dark:ring-slate-700 transition-all duration-300" style={{ backgroundColor: hexCodeValue }} />
                  <p className="mt-4 font-black text-slate-900 dark:text-white tracking-widest uppercase text-center text-sm sm:text-base">{hexCodeValue || "Preview"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 sm:pt-8 text-left">
              <Button type="submit" loading={addColor.isPending || editColor.isPending || fetching} className="h-12 sm:h-14 px-10 rounded-xl sm:rounded-2xl font-black sm:text-lg bg-primary-600 hover:bg-primary-700 border-0 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 w-full sm:w-auto">
                <Save size={18} /> {isEditMode ? "Update" : "Save"} Color
              </Button>
              <Button variant="ghost" onClick={() => navigate(ROUTES.COLORS)} className="h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl font-bold border-2 text-slate-600 hover:bg-slate-50 w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ColorForm;
