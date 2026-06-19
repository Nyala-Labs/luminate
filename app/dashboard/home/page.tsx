import * as React from "react";
import {
  MoreHorizontal,
  Users,
  Briefcase,
  UserPlus,
  Smile,
} from "lucide-react";
import { ContributionGallery } from "@/components/recognition/contribution-gallery";

export default function DashboardHome() {
  const stats = [
    { title: "Total Employees", value: "12,600", change: "+2% from last quarter", icon: Users, color: "from-blue-500/10 to-indigo-500/10 text-blue-400" },
    { title: "Job Application", value: "1,186", change: "+15% from last quarter", icon: Briefcase, color: "from-purple-500/10 to-pink-500/10 text-purple-400" },
    { title: "New Employees", value: "22", change: "+2% from last quarter", icon: UserPlus, color: "from-emerald-500/10 to-teal-500/10 text-emerald-400" },
    { title: "Satisfaction Rate", value: "89.9%", change: "+5% from last quarter", icon: Smile, color: "from-rose-500/10 to-orange-500/10 text-rose-400" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Dashboard</h1>
      </div>

      {/* Contribution Gallery */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Latest Contributions</h3>
        <ContributionGallery />
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group relative p-6 bg-[#13151A]/40 border border-zinc-800/40 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-zinc-400">{stat.title}</span>
                <MoreHorizontal className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
