import * as React from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function CalendarPage() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonthDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const leadingEmptyDays = Array.from({ length: 1 }, (_, i) => null); // Starts on Mon

  const events = [
    { day: 4, title: "Sprint Review", time: "10:00 AM", type: "work" },
    { day: 12, title: "Nyala Labs Hackathon Prep", time: "2:00 PM", type: "nyala" },
    { day: 18, title: "Chutes Hack Malaysia Kickoff", time: "9:00 AM", type: "hackathon" },
    { day: 25, title: "Committee Meeting", time: "6:00 PM", type: "nyala" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
          <p className="text-sm text-zinc-400">Manage and view scheduled organizational events.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-rose-500/10">
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Monthly Calendar View */}
        <div className="lg:col-span-8 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">June 2026</h2>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-zinc-500 mb-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...leadingEmptyDays, ...currentMonthDays].map((day, idx) => {
              const hasEvents = events.filter((e) => e.day === day);
              const isToday = day === 18; // June 18, 2026

              return (
                <div
                  key={idx}
                  className={`min-h-24 p-2 rounded-xl border transition-all flex flex-col justify-between ${
                    day
                      ? isToday
                        ? "bg-rose-500/10 border-rose-500/40 text-rose-100 shadow-md shadow-rose-500/5"
                        : "bg-zinc-900/20 border-zinc-800/40 hover:bg-zinc-900/40"
                      : "border-transparent opacity-0 pointer-events-none"
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? "text-rose-400" : "text-zinc-400"}`}>
                    {day}
                  </span>
                  <div className="space-y-1 mt-1.5">
                    {hasEvents.map((evt, eIdx) => (
                      <div
                        key={eIdx}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                          evt.type === "hackathon"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-950/40"
                            : evt.type === "nyala"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-950/40"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events sidebar */}
        <div className="lg:col-span-4 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-xl hover:border-zinc-700/60 transition-colors flex items-start gap-4"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    evt.type === "hackathon"
                      ? "bg-indigo-500/10 text-indigo-400"
                      : evt.type === "nyala"
                      ? "bg-rose-500/10 text-rose-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    <CalendarIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-zinc-100 truncate">{evt.title}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{evt.time} (June {evt.day}, 2026)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 py-2.5 bg-zinc-800/40 hover:bg-zinc-800/70 text-zinc-300 hover:text-white font-medium text-xs rounded-xl border border-zinc-800/60 transition-all">
            View All Schedules
          </button>
        </div>
      </div>
    </div>
  );
}
