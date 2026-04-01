import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";

const AdminLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <ScrollToTop />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className="ml-72 pt-20 p-6">
        <div className="bg-white border rounded-2xl shadow-sm min-h-[500px] p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
