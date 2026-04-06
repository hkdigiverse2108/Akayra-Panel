import React, { useMemo } from "react";
import { Tooltip } from "antd";
import ProfileForm from "./ProfileForm";
import { Queries } from "../Api/Queries";
import { CheckCircle2, Clock } from "lucide-react";
import { ProfileData } from "../Types";
import Avatar from "../Components/Avatar";

const Profile: React.FC = () => {
  const storedUser = localStorage.getItem("Akayra_Admin_Panel_User");
  const userId = storedUser ? JSON.parse(storedUser)?._id : undefined;

  const { data: userData } = Queries.useGetSingleUser(userId);

  const profileData: ProfileData = useMemo(() => {
    if (userData?.data) {
      const user = userData.data;
      return {
        firstName: user.firstName || "Admin",
        lastName: user.lastName || "User",
        role: user.role || "Administrator",
        email: user.email || "",
        phone: user.contact?.phoneNo || "",
        countryCode: user.contact?.countryCode || "",
      };
    }
    return {
      firstName: "Admin",
      lastName: "User",
      role: "Administrator",
      email: "",
      phone: "",
      countryCode: "",
    };
  }, [userData]);

  // Calculate profile strength
  const profileStrength = useMemo(() => {
    if (!userData?.data) return 0;

    const user = userData.data;
    let completedFields = 0;
    let totalFields = 4;

    // Check firstName
    if (user.firstName && user.firstName.trim() !== "") {
      completedFields++;
    }

    // Check lastName
    if (user.lastName && user.lastName.trim() !== "") {
      completedFields++;
    }

    // Check email
    if (user.email && user.email.trim() !== "") {
      completedFields++;
    }

    // Check contact (phone)
    if (user.contact?.phoneNo && user.contact.phoneNo.trim() !== "") {
      completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
  }, [userData]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0 pb-12 sm:pb-0 text-left">
      <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 sm:gap-8 p-5 sm:p-8 items-start">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 text-center shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)]">
              <div className="rounded-2xl bg-gray-100 dark:bg-slate-800/70 p-4 sm:p-5">
                <Tooltip title={`Profile Strength: ${profileStrength}%`}>
                  <Avatar firstName={profileData.firstName} lastName={profileData.lastName} className="mx-auto h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-b from-primary-500 to-primary-600 border-4 border-emerald-500 cursor-pointer" textClassName="text-2xl sm:text-3xl" />
                </Tooltip>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-bold">Profile</p>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{profileData.role} - Akayra Panel</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800 space-y-4 text-left text-sm">
                {/* Email Section with Verification Status */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{profileData.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {profileData.email ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock size={16} className="text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Phone Section with Verification Status */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Contact</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {profileData.countryCode} {profileData.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {profileData.phone ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock size={16} className="text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProfileForm profile={profileData} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
