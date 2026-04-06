import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { cn } from '../Utils/cn';
import Button from '../Components/Button';
import { LogIn, Shield, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Input } from 'antd';
import loginBg from '../assets/login-bg.png';
import { Mutations } from '../Api/Mutations';
import { ROUTES } from '../Constants';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const loginMutation = Mutations.useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        loginMutation.mutate({ email, password }, {
            onSuccess: (response: any) => {
                if (response.status === 200) {
                    const { token } = response.data;
                    login(response.data, token);
                    navigate(ROUTES.DASHBOARD);
                }
            }
        });
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-950 transition-colors duration-500">
            <div className="flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest border border-primary-200 dark:border-primary-800">
                            <Shield size={14} /> Secure Admin Access
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Welcome Back to <span className="text-primary-500">Akayra</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            Enter your credentials to manage your platform.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">Email Address</label>
                                <Input size="large" placeholder="admin@akayra.com" prefix={<Mail className="text-gray-400 mr-2" size={18} />} value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-2xl border-2 border-gray-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white hover:border-primary-500 focus:border-primary-500 transition-all font-medium" />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">Password</label>
                                    <button type="button" onClick={() => navigate(ROUTES.FORGOT_PASSWORD)} className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors" >
                                        Forgot Password?
                                    </button>
                                </div>
                                <Input.Password size="large" placeholder="••••••••" prefix={<Lock className="text-gray-400 mr-2" size={18} />} value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl border-2 border-gray-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white hover:border-primary-500 focus:border-primary-500 transition-all font-medium" />
                            </div>
                        </div>

                        <Button type="submit" isLoading={loginMutation.isPending} className="w-full h-14 text-lg rounded-2xl font-black tracking-wide">
                            <LogIn size={20} /> Sign In to Dashboard
                        </Button>
                    </form>
                </div>
            </div>

            <div className="hidden lg:block relative overflow-hidden bg-primary-600">
                <img src={loginBg} alt="Akayra Dashboard" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 transition-transform duration-[10s] ease-linear" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-slate-900/90" />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-20 space-y-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
                        <UserIcon size={32} />
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight">
                        Powering the next generation of <span className="text-primary-300 italic text-left">Retail.</span>
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Login;
