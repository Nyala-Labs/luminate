import * as React from "react";
import { CreditCard, DollarSign, ArrowUpRight, TrendingUp, Calendar, ChevronDown, CheckCircle2 } from "lucide-react";

export default function PayrollPage() {
  const billingLogs = [
    {
      id: "PAY-103",
      recipient: "Arlene McCoy",
      amount: "RM 5,500.00",
      status: "Disbursed",
      date: "June 05, 2026",
    },
    {
      id: "PAY-102",
      recipient: "Darlene Robertson",
      amount: "RM 6,200.00",
      status: "Disbursed",
      date: "June 05, 2026",
    },
    {
      id: "PAY-101",
      recipient: "Kathryn Murphy",
      amount: "RM 5,800.00",
      status: "Disbursed",
      date: "June 05, 2026",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Payroll</h1>
          <p className="text-sm text-zinc-400">Track monthly allocations, disbursals, and allowances.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="p-6 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">MONTHLY BUDGET</span>
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><DollarSign className="w-5 h-5" /></span>
            </div>
            <h3 className="text-2xl font-bold text-white">RM 25,000.00</h3>
            <p className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Allocated for Q2 operations
            </p>
          </div>
        </div>

        <div className="p-6 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">TOTAL DISBURSED</span>
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400"><CheckCircle2 className="w-5 h-5" /></span>
            </div>
            <h3 className="text-2xl font-bold text-white">RM 17,500.00</h3>
            <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed June cycle
            </p>
          </div>
        </div>

        <div className="p-6 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">NEXT PAYOUT</span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Calendar className="w-5 h-5" /></span>
            </div>
            <h3 className="text-2xl font-bold text-white">July 05, 2026</h3>
            <p className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Remaining in cycle: 17 days
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800/40 text-zinc-500 font-bold text-xs">
                <th className="pb-3.5">ID</th>
                <th className="pb-3.5">Recipient</th>
                <th className="pb-3.5">Amount</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5">Disbursal Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/20 font-sans">
              {billingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-800/10 transition-colors">
                  <td className="py-4 font-semibold text-zinc-400">{log.id}</td>
                  <td className="py-4 font-semibold text-zinc-200">{log.recipient}</td>
                  <td className="py-4 font-bold text-white">{log.amount}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-950/30">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
