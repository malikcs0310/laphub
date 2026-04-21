import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";

const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <ScrollToTop />

      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Header */}
      <AdminHeader setMobileSidebarOpen={setMobileSidebarOpen} />

      {/* Main Content */}
      <main className="lg:ml-64 sm:lg:ml-72 pt-16 sm:pt-20 p-3 sm:p-4 lg:p-6">
        <div className="bg-white border rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm min-h-[calc(100vh-100px)] p-3 sm:p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
