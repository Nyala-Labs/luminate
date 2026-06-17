import * as React from "react";
import { Users, Shield, Zap, Code, Layout, ArrowUpRight } from "lucide-react";

export default function TeamsPage() {
  const teams = [
    {
      name: "Team Alpha",
      purpose: "Core Platform Development",
      members: 8,
      lead: "Arlene McCoy",
      tag: "Engineering",
      color: "from-blue-600/10 to-indigo-600/10 text-blue-400 border-blue-900/30",
      icon: Code,
    },
    {
      name: "Team Phinix",
      purpose: "Growth & Community Engagement",
      members: 12,
      lead: "Darlene Robertson",
      tag: "Marketing",
      color: "from-rose-600/10 to-orange-600/10 text-rose-400 border-rose-900/30",
      icon: Zap,
    },
    {
      name: "Team Omega",
      purpose: "AI & Innovation Labs",
      members: 6,
      lead: "Kathryn Murphy",
      tag: "AI Research",
      color: "from-purple-600/10 to-fuchsia-600/10 text-purple-400 border-purple-900/30",
      icon: Shield,
    },
    {
      name: "Team Canvas",
      purpose: "Brand Identity & UX Design",
      members: 4,
      lead: "Austin Martin",
      tag: "Design",
      color: "from-emerald-600/10 to-teal-600/10 text-emerald-400 border-emerald-900/30",
      icon: Layout,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Teams</h1>
          <p className="text-sm text-zinc-400">Collaborate with multi-disciplinary groups across Nyala Labs.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {teams.map((team) => {
          const Icon = team.icon;
          return (
            <div
              key={team.name}
              className="p-6 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-zinc-500/5 to-transparent blur-2xl rounded-full" />

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${team.color.split(" ").slice(0, 2).join(" ")} ${team.color.split(" ")[2]}`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg bg-zinc-900/80 border ${team.color.split(" ")[3]} ${team.color.split(" ")[2]}`}>
                    {team.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">{team.name}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{team.purpose}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-500" />
                  <span className="font-semibold text-zinc-400">{team.members} Builders</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500">Lead:</span>{" "}
                  <span className="font-bold text-zinc-300">{team.lead}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
