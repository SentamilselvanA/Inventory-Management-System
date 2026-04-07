import { Package, AlertCircle, ShoppingCart, TrendingUp } from "lucide-react";

export default function Dashboard({ user }) {
  const stats = [
    { name: "Total Products", value: "2,543", icon: Package, change: "+12.5%", color: "text-blue-400" },
    { name: "Low Stock Items", value: "14", icon: AlertCircle, change: "-2.4%", color: "text-red-400" },
    { name: "Total Suppliers", value: "84", icon: ShoppingCart, change: "+4.1%", color: "text-purple-400" },
    { name: "Monthly Stock Moving", value: "12,400", icon: TrendingUp, change: "+14.2%", color: "text-green-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
        <p className="text-gray-400">Here's what's happening in your warehouse today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-panel p-6 rounded-2xl hover-glass">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Recent Stock Movements</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {i % 2 === 0 ? <TrendingUp className="w-5 h-5 rotate-180" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Mechanical Keyboard Model X{i}</h4>
                    <p className="text-sm text-gray-400">SKU: KBD-00{i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${i % 2 === 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {i % 2 === 0 ? '-' : '+'}45 units
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Low Stock Alerts</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div>
                  <h4 className="text-white font-medium">Wireless Mouse Pro {i}</h4>
                  <p className="text-sm text-red-300">Only {i * 2} left in stock</p>
                </div>
                <button className="text-xs font-medium bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
