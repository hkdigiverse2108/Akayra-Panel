import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { Mail, Lock, KeyRound, ArrowRight } from "lucide-react";
import Button from "../../Components/Button";
import OtpInput from "../../Components/OtpInput";
import { Mutations } from "../../Api/Mutations";
import { ROUTES } from "../../Constants";
import { toast } from "react-toastify";
import loginBg from "../../assets/login-bg.png";

type Step = "email" | "otp" | "password";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const forgotPasswordMutation = Mutations.useForgotPassword();
  const resetPasswordMutation = Mutations.useResetPassword();

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && step === "otp" && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, step, canResend]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (response: any) => {
          if (response?.status === 200 || response?.status === 201) {
            toast.success("OTP sent to your email");
            setStep("otp");
            setTimer(120); // 2 minutes
            setCanResend(false);
          }
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to send OTP");
        },
      },
    );
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (resetPasswordMutation.isPending) {
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate(
      { email, otp, password },
      {
        onSuccess: (response: any) => {
          if (response?.status === 200 || response?.status === 201) {
            toast.success("Password reset successfully. Please login with your new password.");
            navigate(ROUTES.LOGIN);
          } else {
            toast.error("Failed to reset password");
          }
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to reset password";
          toast.error(errorMsg);
        },
      },
    );
  };

  const handleResendOtp = () => {
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (response: any) => {
          if (response?.status === 200 || response?.status === 201) {
            toast.success("OTP resent successfully");
            setTimer(120);
            setCanResend(false);
          }
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to resend OTP");
        },
      },
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Left Side - Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 animate-in fade-in slide-in-from-left-8 duration-700">
        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">
              <KeyRound size={14} /> Password Recovery
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Reset Your <span className="text-primary-500">Password</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
              {step === "email" && "Enter your email to receive an OTP"}
              {step === "otp" && "Enter the 6-digit code sent to your email"}
              {step === "password" && "Create your new secure password"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex gap-4 justify-center">
            {(["email", "otp", "password"] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? "bg-primary-500 text-white" : ["email", "otp", "password"].indexOf(step) > idx ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400"}`}>{idx + 1}</div>
                {idx < 2 && <div className={`w-8 h-1 ${["email", "otp", "password"].indexOf(step) > idx ? "bg-emerald-500" : "bg-gray-200 dark:bg-slate-700"}`} />}
              </div>
            ))}
          </div>

          {/* Email Step */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">Email Address</label>
                <Input size="large" type="email" placeholder="admin@akayra.com" prefix={<Mail className="text-gray-400 mr-2" size={18} />} value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-2xl border-2 border-gray-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white hover:border-primary-500 focus:border-primary-500 transition-all font-medium" />
              </div>

              <Button type="submit" isLoading={forgotPasswordMutation.isPending} className="w-full h-14 text-lg rounded-2xl font-black tracking-wide">
                <Mail size={20} /> Send OTP
              </Button>

              <div className="text-center">
                <a onClick={() => navigate(ROUTES.LOGIN)} className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">
                  Back to Login
                </a>
              </div>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1 block">Enter OTP Code</label>
                <OtpInput value={otp} onChange={setOtp} length={6} disabled={resetPasswordMutation.isPending} />
                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                  We've sent a 6-digit code to <span className="font-semibold">{email}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep("email")} className="flex-1 h-14 text-base rounded-2xl font-black tracking-wide bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-700">
                  Back
                </Button>
                <Button type="submit" isLoading={resetPasswordMutation.isPending} className="flex-1 h-14 text-base rounded-2xl font-black tracking-wide">
                  <ArrowRight size={20} /> Verify
                </Button>
              </div>

              <div className="text-center space-y-2">
                {!canResend ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Resend OTP in <span className="font-bold text-primary-500">{formatTimer(timer)}</span>
                  </p>
                ) : (
                  <button type="button" onClick={handleResendOtp} disabled={forgotPasswordMutation.isPending} className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors disabled:opacity-50">
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Password Step */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">New Password</label>
                  <Input.Password size="large" placeholder="••••••••" prefix={<Lock className="text-gray-400 mr-2" size={18} />} value={password} onChange={(e) => setPassword(e.target.value)} disabled={resetPasswordMutation.isPending} className="h-14 rounded-2xl border-2 border-gray-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white hover:border-primary-500 focus:border-primary-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">At least 6 characters</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">Confirm Password</label>
                  <Input.Password size="large" placeholder="••••••••" prefix={<Lock className="text-gray-400 mr-2" size={18} />} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={resetPasswordMutation.isPending} className="h-14 rounded-2xl border-2 border-gray-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white hover:border-primary-500 focus:border-primary-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep("otp")} disabled={resetPasswordMutation.isPending} className="flex-1 h-14 text-base rounded-2xl font-black tracking-wide bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Back
                </Button>
                <Button type="submit" isLoading={resetPasswordMutation.isPending} disabled={resetPasswordMutation.isPending} className="flex-1 h-14 text-base rounded-2xl font-black tracking-wide">
                  <KeyRound size={20} /> Reset Password
                </Button>
              </div>

              <div className="text-center">
                <a
                  onClick={() => {
                    if (!resetPasswordMutation.isPending) {
                      navigate(ROUTES.LOGIN);
                    }
                  }}
                  className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  Back to Login
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Background */}
      <div className="hidden lg:block relative overflow-hidden bg-primary-600">
        <img src={loginBg} alt="Akayra Dashboard" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 transition-transform duration-[10s] ease-linear" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-slate-900/90" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-20 space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
            <KeyRound size={32} />
          </div>
          <h2 className="text-5xl font-black text-white leading-tight">
            Secure your account with a <span className="text-primary-300 italic">strong password.</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
