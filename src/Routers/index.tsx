import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import PageRoutes from "./PageRoutes";

// We'll use a standard Routes component for now inside App.tsx or a simpler index.tsx
// because ERP-Panel-dev uses createBrowserRouter but Akayra-Panel currently uses <Router> in App.tsx.
// I'll stick to the <Routes> pattern for now to avoid breaking the current App.tsx structure too much,
// but I'll move it to Routers/AppRouter.tsx as a compromise.

const AppRouter: React.FC = () => {
  return <PageRoutes />;
};

export default AppRouter;
