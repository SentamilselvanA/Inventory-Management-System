import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, RefreshCcw } from "lucide-react";

export default function Inventory({ user }) {
  const [movements] = useState([
    { id: 1, type: "IN", product: "Mechanical Keyboard X-Pro", amount: 50, date: "2023-11-20 09:14 AM", by: "Mike Manager", status: "Completed" },
    { id: 2, type: "OUT", product: "Wireless Mouse Precision", amount: 15, date: "2023-11-20 11:30 AM", by: "Alex Staff", status: "Completed" },
    { id: 3, type: "IN", product: "4K Monitor 27-inch", amount: 20, date: "2023-11-19 02:45 PM", by: "Sarah Admin", status: "Completed" },
    { id: 4, type: "OUT", product: "Ergonomic Office Chair", amount: 5, date: "2023-11-18 04:10 PM", by: "Alex Staff", status: "Completed" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Inventory Operations</h1>
          <p className="text-gray-400">Manage stock movements and view history.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2.5 px-5 rounded-xl transition-all">
            <RefreshCcw className="w-5 h-5" />
            Sync
          </button>
          <button className="flex items-center justify-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-medium py-2.5 px-5 rounded-xl transition-all">
            <ArrowUpFromLine className="w-5 h-5" />
            Stock Out
          </button>
          <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary/25">
            <ArrowDownToLine className="w-5 h-5" />
            Stock In
          </button>
        </div>
      </header>

      {/* Movement Log Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Recent Movements Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-sm font-medium border-b border-white/10">
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Processed By</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movements.map((mov) => (
                <tr key={mov.id} className="text-gray-300 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                      ${mov.type === 'IN' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                    >
                      {mov.type === 'IN' ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                      {mov.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-white">{mov.product}</td>
                  <td className={`py-4 px-6 text-right font-bold ${mov.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>
                    {mov.type === 'IN' ? '+' : '-'}{mov.amount}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">{mov.date}</td>
                  <td className="py-4 px-6 text-sm">{mov.by}</td>
                  <td className="py-4 px-6 text-sm text-gray-400">{mov.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
