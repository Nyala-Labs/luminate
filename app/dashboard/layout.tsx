import * as React from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#08090C] text-zinc-100 font-sans relative">
      {/* Background radial gradient glow for premium Nyala Labs red-purple undertone */}
      <div className="absolute top-0 right-0 w-[600px] h-150 bg-gradient-to-br from-rose-500/10 via-purple-600/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute -bottom-20 -left-20 w-100 h-[400px] bg-gradient-to-tr from-indigo-600/5 via-rose-500/5 to-transparent blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {children}
        </main>
      </div>
    </div>
  );
}
