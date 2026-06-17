import * as React from "react";
import { GitCommit, Rocket, ShieldAlert, Award, Star } from "lucide-react";

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: "deploy",
      title: "Chutes Hack Malaysia portal deployed",
      user: "Arlene McCoy",
      time: "2 hours ago",
      desc: "Successfully deployed the preview branch for Chutes Hack Malaysia 2026 to production.",
      icon: Rocket,
      color: "bg-emerald-500/10 text-emerald-400 border border-emerald-950/30",
    },
    {
      id: 2,
      type: "commit",
      title: "Refactored dashboard sidebar logic",
      user: "Austin Martin",
      time: "5 hours ago",
      desc: "Merged commit #bf39d10: Migrated sidebar to use dynamic routes and responsive layout state.",
      icon: GitCommit,
      color: "bg-indigo-500/10 text-indigo-400 border border-indigo-950/30",
    },
    {
      id: 3,
      type: "milestone",
      title: "100+ Hacker Registrations reached!",
      user: "Darlene Robertson",
      time: "1 day ago",
      desc: "Registration milestone achieved for Chutes Hack Malaysia. Over 100 builders signed up.",
      icon: Award,
      color: "bg-rose-500/10 text-rose-400 border border-rose-950/30",
    },
    {
      id: 4,
      type: "star",
      title: "Nyala Labs internal repo starred by partner",
      user: "System",
      time: "3 days ago",
      desc: "Chutes AI engineering lead starred the nyalalabs_internal repository.",
      icon: Star,
      color: "bg-amber-500/10 text-amber-400 border border-amber-950/30",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Activity</h1>
        <p className="text-sm text-zinc-400">Track system logs, deployments, and builder milestones.</p>
      </div>

      <div className="bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6 max-w-4xl">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((act, actIdx) => (
              <li key={act.id}>
                <div className="relative pb-8">
                  {actIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-zinc-800/60"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-4">
                    <div className="relative shrink-0">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${act.color}`}>
                        <act.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5 font-sans">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-zinc-200">
                          {act.title}
                        </div>
                        <div className="text-right text-xs text-zinc-500">
                          {act.time}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        By <span className="font-semibold text-zinc-300">{act.user}</span>
                      </p>
                      <p className="text-sm text-zinc-400 mt-2.5 bg-zinc-900/25 border border-zinc-800/40 p-3 rounded-xl">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
