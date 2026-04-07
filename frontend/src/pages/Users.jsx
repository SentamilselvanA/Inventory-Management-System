import { useState } from "react";
import { UserPlus, Settings, Trash2, Shield, UserCircle, Briefcase } from "lucide-react";

export default function Users({ user }) {
  const [users] = useState([
    { id: 1, name: "Sarah Admin", email: "admin@nexusims.com", role: "admin", status: "Active" },
    { id: 2, name: "Mike Manager", email: "manager@nexusims.com", role: "manager", status: "Active" },
    { id: 3, name: "Alex Staff", email: "staff@nexusims.com", role: "staff", status: "Active" },
    { id: 4, name: "Emma Staff", email: "emma@nexusims.com", role: "staff", status: "Offline" },
  ]);

  if (user?.role !== 'admin') {
    return <div className="text-center text-red-500 mt-20">Access Denied. Admin privileges required.</div>;
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield className="w-4 h-4 text-primary" />;
      case 'manager': return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'staff': return <UserCircle className="w-4 h-4 text-green-400" />;
      default: return <UserCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage system access and roles.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/25">
          <UserPlus className="w-5 h-5" />
          Add New User
        </button>
      </header>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((u) => (
          <div key={u.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors">
            {/* Background Glow based on role */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40
              ${u.role === 'admin' ? 'bg-primary' : u.role === 'manager' ? 'bg-purple-500' : 'bg-green-500'}`} 
            />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{u.name}</h3>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                {u.role !== 'admin' && (
                  <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
              <div className="flex items-center gap-2">
                {getRoleIcon(u.role)}
                <span className="text-sm font-medium text-gray-300 capitalize">{u.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`} />
                <span className="text-sm text-gray-400">{u.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
