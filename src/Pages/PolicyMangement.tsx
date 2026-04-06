import React, { useMemo, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../Components/Card";
import Button from "../Components/Button";
import { Save, X, ShieldCheck, Scale, Truck, Ban, RotateCcw } from "lucide-react";
import { Queries } from "../Api/Queries";
import { Mutations } from "../Api/Mutations";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../Constants";

type PolicyTabId = "cancellation" | "shipping" | "termsCondition" | "privacy" | "returnRefund";

const tabs: { id: PolicyTabId; label: string }[] = [
  { id: "privacy", label: "Privacy" },
  { id: "termsCondition", label: "Terms & Condition" },
  { id: "returnRefund", label: "Return & Refund" },
  { id: "shipping", label: "Shipping" },
  { id: "cancellation", label: "Cancellation" },
];

const policyTypeByTab: Record<PolicyTabId, string> = { privacy: "privacy", termsCondition: "termsCondition", returnRefund: "returnRefund", shipping: "shipping", cancellation: "cancellation" };

const PolicyMangement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicyTabId>("privacy");
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [contentByTab, setContentByTab] = useState<Record<PolicyTabId, string>>({ cancellation: "", shipping: "", termsCondition: "", privacy: "", returnRefund: "" });

  const toolbarModules = useMemo(
    () => ({
      toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], [{ align: [] }], ["clean"]],
    }),
    [],
  );

  const policyType = policyTypeByTab[activeTab];
  const isEditing = !!id;
  const { data: policyResponse, isLoading: isPolicyLoading } = Queries.useGetPolicyByType(policyType);
  const addPolicy = Mutations.useAddPolicy();
  const editPolicy = Mutations.useEditPolicy();

  const policyRecord = useMemo(() => {
    const data = (policyResponse as any)?.data;
    if (!data) return null;
    return Array.isArray(data) ? data[0] : data;
  }, [policyResponse]);

  useEffect(() => {
    if (policyRecord?.type && policyRecord.type !== policyType) return;
    const description = policyRecord?.description ?? "";
    setContentByTab((prev) => ({ ...prev, [activeTab]: description }));
  }, [policyRecord, activeTab, policyType]);

  const handleContentChange = (value: string) => {
    setContentByTab((prev) => ({ ...prev, [activeTab]: value }));
  };

  const handleCancel = () => {
    const description = policyRecord?.description ?? "";
    setContentByTab((prev) => ({ ...prev, [activeTab]: description }));
    navigate(ROUTES.POLICIES);
  };

  const handleSave = () => {
    const payload = {
      type: policyType,
      title: activeTabMeta?.label,
      description: contentByTab[activeTab],
      isActive: true,
    };

    const mutation = policyRecord?._id ? editPolicy : addPolicy;
    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        if (res?.status === 200 || res?.status === 201) {
          navigate(ROUTES.POLICIES);
        }
      },
    });
  };

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab);
  const activeIcon = (() => {
    switch (activeTab) {
      case "privacy":
        return ShieldCheck;
      case "termsCondition":
        return Scale;
      case "returnRefund":
        return RotateCcw;
      case "shipping":
        return Truck;
      case "cancellation":
      default:
        return Ban;
    }
  })();
  const ActiveIcon = activeIcon;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
            <ActiveIcon size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Policy Management</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{activeTabMeta?.label}</h1>
          </div>
        </div>
      </div>

      <Card className="rounded-[15px] sm:rounded-[25px] shadow-xl border border-gray-100 dark:border-slate-800">
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 sm:gap-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 p-2 rounded-2xl overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigate(ROUTES.POLICIES);
                  }}
                  className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap ${isActive ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700"}`}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="policy-quill relative">
                {isPolicyLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
                    <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <ReactQuill theme="snow" value={contentByTab[activeTab]} onChange={handleContentChange} modules={toolbarModules} placeholder={`Write ${activeTabMeta?.label} policy details here...`} readOnly={!isEditing} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {!isEditing ? (
              <Button className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black" onClick={() => navigate(`${ROUTES.POLICIES}/edit/${policyRecord?._id || "new"}`)}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-400" onClick={handleCancel} disabled={addPolicy.isPending || editPolicy.isPending}>
                  <X size={16} /> Cancel
                </Button>
                <Button className="h-10 sm:h-12 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white font-black" onClick={handleSave} loading={addPolicy.isPending || editPolicy.isPending}>
                  <Save size={16} /> Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PolicyMangement;
