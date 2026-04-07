import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ArrowRightLeft, Users as UsersIcon, LogOut, Shield } from "lucide-react";

export default function DashboardLayout({ user, setUser }) {
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["admin", "manager", "staff"] },
    { name: "Products", path: "/products", icon: Package, roles: ["admin", "manager", "staff"] },
    { name: "Inventory", path: "/inventory", icon: ArrowRightLeft, roles: ["admin", "manager", "staff"] },
    { name: "Users", path: "/users", icon: UsersIcon, roles: ["admin"] },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-white/10 flex flex-col pt-6">
        <div className="flex items-center gap-3 px-6 mb-10">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
            NexusIMS
          </h1>
        </div>

        <div className="px-4 pb-6 border-b border-white/10 mb-6">
          <p className="text-sm text-gray-400">Welcome,</p>
          <p className="text-lg font-semibold text-white capitalize">{user.name}</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-full text-xs font-medium bg-primary/20 text-blue-300 border border-primary/30">
            {user.role} Account
          </span>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
