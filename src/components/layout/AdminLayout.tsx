import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, FolderTree } from "lucide-react";

function AdminLayout() {
  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <FolderTree size={20} />,
    },
  ];

  return (
    <div className="bg-dark-white flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full shrink-0 bg-white shadow-lg md:w-64">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex flex-wrap gap-2 p-4 md:flex-col"
        >
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow"
                    : "text-primary-dark hover:bg-dark-white hover:text-primary"
                }`
              }
            >
              {menu.icon}
              <span>{menu.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="min-h-[calc(100vh-64px)] rounded-xl bg-white p-4 shadow md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
