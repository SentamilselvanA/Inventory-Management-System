import { useState } from "react";
import { Shield, ArrowRight, UserCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser({ role: data.role, name: data.name, email: data.email, id: data._id });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const setDemoCredentials = (role) => {
    setEmail(`${role}@nexusims.com`);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10 border border-black/10 dark:border-white/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">NexusIMS</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">Sign in to manage your inventory and operations.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm shadow-red-500/10">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25"
          >
            Sign In <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Demo Section */}
        {/* <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <p className="text-xs text-center text-gray-500 font-medium mb-4 uppercase tracking-wider">Demo Access</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setDemoCredentials("admin")}
              className="px-3 py-2 text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg border border-black/10 dark:border-white/10 flex items-center gap-2 transition-colors"
            >
              <UserCircle className="w-4 h-4" /> Admin
            </button>
            <button
              onClick={() => setDemoCredentials("manager")}
              className="px-3 py-2 text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg border border-black/10 dark:border-white/10 flex items-center gap-2 transition-colors"
            >
              <UserCircle className="w-4 h-4" /> Manager
            </button>
            <button
              onClick={() => setDemoCredentials("staff")}
              className="px-3 py-2 text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg border border-black/10 dark:border-white/10 flex items-center gap-2 transition-colors"
            >
              <UserCircle className="w-4 h-4" /> Staff
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
