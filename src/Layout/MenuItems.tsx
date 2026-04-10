import React from "react";
import { LayoutDashboard, Users, Package, Tag, Layers, MessageSquare, Image, HelpCircle, FileText, Info, TrendingUp, ShieldCheck, Settings, Ruler, Palette, ListTree, Mail, Camera, Ticket, Send, Layout } from "lucide-react";

export interface SubMenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string; // Optional if it has subItems
  subItems?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
  { icon: <Users size={20} />, label: "Users", path: "/users" },
  {
    icon: <Package size={20} />,
    label: "Inventory",
    subItems: [
      { label: "Products", path: "/products", icon: <Package size={16} /> },
      { label: "Categories", path: "/categories", icon: <Layers size={16} /> },
      { label: "Brands", path: "/brands", icon: <Tag size={16} /> },
      { label: "Sizes", path: "/sizes", icon: <Ruler size={16} /> },
      { label: "Colors", path: "/colors", icon: <Palette size={16} /> },
    ],
  },
  { icon: <Image size={20} />, label: "Banners", path: "/banners" },
  { icon: <FileText size={20} />, label: "Blogs", path: "/blogs" },
  { icon: <MessageSquare size={20} />, label: "Reviews", path: "/reviews" },
  {
    icon: <HelpCircle size={20} />,
    label: "Support",
    subItems: [
      { label: "FAQs", path: "/faqs", icon: <HelpCircle size={16} /> },
      { label: "FAQ Categories", path: "/faq-categories", icon: <ListTree size={16} /> },
      { label: "Contact Inquiries", path: "/contact", icon: <Mail size={16} /> },
      { label: "Newsletter", path: "/newsletter", icon: <Send size={16} /> },
    ],
  },
  {
    icon: <TrendingUp size={20} />,
    label: "Marketing",
    subItems: [
      { label: "Coupons", path: "/coupons", icon: <Ticket size={16} /> },
      { label: "IG Posts", path: "/ig-posts", icon: <Camera size={16} /> },
      { label: "Sale Banner", path: "/sale-banner", icon: <Layout size={16} /> },
    ],
  },
  { icon: <ShieldCheck size={20} />, label: "Policies", path: "/policies" },
  { icon: <Info size={20} />, label: "About Us", path: "/about" },
  { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
];
