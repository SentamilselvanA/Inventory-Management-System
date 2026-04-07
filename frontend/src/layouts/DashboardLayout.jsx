import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ArrowRightLeft, Users as UsersIcon, LogOut, Shield, Sun, Moon, ChevronLeft, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardLayout({ user, setUser }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    // Check local storage or default to dark
    if (localStorage.getItem('theme') === 'light') return false;
    return true; // default to dark
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

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
    <div className="flex h-screen w-full overflow-hidden bg-background transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-24'} transition-all duration-300 ease-in-out flex-shrink-0 glass-panel border-r border-black/10 dark:border-white/10 flex flex-col pt-6 relative z-20`}>
        <div className={`flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center'} mb-10`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <Shield className="w-8 h-8 text-primary flex-shrink-0" />
            {isSidebarOpen && (
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-blue-400 whitespace-nowrap">
                NexusIMS
              </h1>
            )}
          </div>
        </div>
        
        {/* Toggle Button */}
        <button 
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className="absolute -right-3.5 top-8 bg-white dark:bg-[#1a2336] border border-black/10 dark:border-white/10 p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:text-primary z-50 transition-transform shadow-md"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {isSidebarOpen ? (
          <div className="px-4 pb-6 border-b border-black/10 dark:border-white/10 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome,</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize truncate">{user.name}</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-full text-xs font-medium bg-primary/20 text-primary dark:text-blue-300 border border-primary/30">
              {user.role} Account
            </span>
          </div>
        ) : (
          <div className="pb-6 border-b border-black/10 dark:border-white/10 mb-6 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold uppercase text-lg border border-primary/30">
               {user.name.charAt(0)}
            </div>
          </div>
        )}

        <nav className={`flex-1 px-4 flex flex-col gap-2 ${!isSidebarOpen && 'items-center'}`}>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center w-12'} py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                title={!isSidebarOpen ? item.name : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 mt-auto border-t border-black/10 dark:border-white/10 ${!isSidebarOpen && 'flex flex-col items-center'}`}>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center w-12'} py-3 ${isSidebarOpen ? 'w-full' : ''} rounded-xl text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors font-medium mb-2`}
            title={!isSidebarOpen ? (isDark ? "Light Mode" : "Dark Mode") : ""}
          >
            {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
            {isSidebarOpen && <span className="whitespace-nowrap">{isDark ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className={`flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center w-12'} py-3 ${isSidebarOpen ? 'w-full' : ''} rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors font-medium`}
            title={!isSidebarOpen ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
