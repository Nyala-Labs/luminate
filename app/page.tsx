import Link from "next/link";
import Image from "next/image";
import logo from "@/public/nyalalabs.svg";
import { SignInWithGoogleButton } from "@/components/SignInWithGoogleButton";
import { getCurrentUser } from "@/lib/auth/server";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen bg-[#08090C] text-zinc-100 font-sans">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Nyala Labs" className="size-10" />
          <span className="text-xl font-bold tracking-tight">NYALALABS</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 bg-zinc-800 text-white rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="w-48">
              <SignInWithGoogleButton />
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Team Management Portal
        </h1>
        <p className="text-lg text-zinc-400 max-w-lg mb-10 leading-relaxed">
          The internal command center for Nyala Labs. Sign in to access your projects, 
          manage teams, and track operational metrics.
        </p>
        
        {!user && (
          <div className="w-64">
            <SignInWithGoogleButton />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-xs">
        © 2026 Nyala Labs. Internal System.
      </footer>
    </div>
  );
}
