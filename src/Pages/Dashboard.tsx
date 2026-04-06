import React from "react";
import Card from "../Components/Card";
import { Users, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../Utils/cn";

const stats = [
  { label: "Total Users", value: "1,284", icon: <Users size={24} />, change: "+12.5%", isPositive: true },
  { label: "Total Products", value: "452", icon: <ShoppingBag size={24} />, change: "+3.2%", isPositive: true },
  { label: "Revenue", value: "$45,280", icon: <DollarSign size={24} />, change: "-2.4%", isPositive: false },
  { label: "Active Sessions", value: "84", icon: <TrendingUp size={24} />, change: "+18.7%", isPositive: true },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-left">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-left">Welcome back! Here's what's happening with Akayra today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {stats.map((stat, index) => (
          <Card key={index} className="!p-6 group cursor-default text-left bg-white dark:bg-slate-900 border-0 shadow-xl rounded-3xl">
            <div className="flex items-center justify-between mb-4 text-left">
              <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
              <div className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg", stat.isPositive ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400")}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1 text-left">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none text-left">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        <Card title="Recent Activity" className="lg:col-span-2 text-left bg-white dark:bg-slate-900 border-0 shadow-xl rounded-[32px] p-8" subtitle="Monitor latest actions across the platform">
          <div className="space-y-6 text-left">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 text-left">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 border-b border-slate-100 dark:border-slate-800 pb-4 text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white text-left">New user registered</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-left font-medium">User notification system integrated with TanStack Query.</p>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 block text-left">JUST NOW</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Frequently used tasks" className="text-left bg-white dark:bg-slate-900 border-0 shadow-xl rounded-[32px] p-8">
          <div className="space-y-3 text-left">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-all group font-black text-sm uppercase tracking-tight">
              <span>Add New Product</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all group font-black text-sm uppercase tracking-tight">
              <span>View All Orders</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all group font-black text-sm uppercase tracking-tight">
              <span>Manage Users</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
