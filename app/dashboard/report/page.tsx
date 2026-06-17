import * as React from "react";
import { BarChart3, Download, FileText, ArrowUpRight, TrendingUp } from "lucide-react";

export default function ReportPage() {
  const reports = [
    {
      title: "Chutes Hack Registration Report",
      date: "June 15, 2026",
      size: "2.4 MB",
      author: "Darlene Robertson",
      type: "PDF",
    },
    {
      title: "Q2 Financial Audit & Allocations",
      date: "June 01, 2026",
      size: "1.8 MB",
      author: "System Audit",
      type: "XLSX",
    },
    {
      title: "Nyala Labs Youth Society Growth Report",
      date: "May 25, 2026",
      size: "4.1 MB",
      author: "Arlene McCoy",
      type: "PDF",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Reports</h1>
          <p className="text-sm text-zinc-400">Generate, view, and export society analytical reports.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-rose-500/10">
          <BarChart3 className="w-4 h-4" />
          <span>Generate Custom Report</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {reports.map((rep) => (
          <div
            key={rep.title}
            className="p-6 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300 relative group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {rep.type}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {rep.title}
                </h3>
                <p className="text-xs text-zinc-500 font-medium">Published: {rep.date}</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800/40 flex items-center justify-between text-xs font-sans">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-zinc-500">AUTHOR</span>
                <span className="font-bold text-zinc-300">{rep.author}</span>
              </div>
              <button className="p-2.5 bg-zinc-800/40 hover:bg-zinc-800/80 text-zinc-300 hover:text-white rounded-xl border border-zinc-800/60 hover:border-zinc-700/60 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
