import * as React from "react";
import { MessageSquare, Send, Paperclip, Smile } from "lucide-react";

export default function MessagePage() {
  const chats = [
    {
      id: 1,
      sender: "Arlene McCoy",
      avatar: "AM",
      message: "Hey Austin! Did you manage to test the Supabase auth callback locally yet?",
      time: "10:14 AM",
      isSelf: false,
    },
    {
      id: 2,
      sender: "Austin Martin",
      avatar: "AM",
      message: "Yes! Callback works perfectly under /auth/callback. Just pushed the config to the dev branch.",
      time: "10:15 AM",
      isSelf: true,
    },
    {
      id: 3,
      sender: "Arlene McCoy",
      avatar: "AM",
      message: "Awesome work! I'll test it out now and start designing the dashboard interface.",
      time: "10:16 AM",
      isSelf: false,
    },
    {
      id: 4,
      sender: "Darlene Robertson",
      avatar: "DR",
      message: "Hey guys, quick update: Chutes AI approved our co-branded design files. We can proceed with the hackathon landing page!",
      time: "10:20 AM",
      isSelf: false,
    },
  ];

  return (
    <div className="space-y-8 pb-12 h-[calc(100vh-12rem)] flex flex-col justify-between">
      <div className="space-y-1 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white">Message</h1>
        <p className="text-sm text-zinc-400">Internal communication and updates with teammates.</p>
      </div>

      {/* Chat Window Container */}
      <div className="flex-1 min-h-0 bg-[#13151A]/30 border border-zinc-800/30 rounded-2xl flex flex-col justify-between mt-6 overflow-hidden">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-start gap-3.5 max-w-[70%] font-sans ${
                chat.isSelf ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  chat.isSelf
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-purple-500/20 text-purple-300"
                }`}
              >
                {chat.avatar}
              </div>

              {/* Message bubble */}
              <div className="space-y-1">
                <div className={`flex items-center gap-2 ${chat.isSelf ? "justify-end" : ""}`}>
                  <span className="text-xs font-bold text-zinc-300">{chat.sender}</span>
                  <span className="text-[10px] text-zinc-500">{chat.time}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed border ${
                    chat.isSelf
                      ? "bg-rose-950/20 border-rose-900/30 text-rose-100 rounded-tr-none"
                      : "bg-zinc-900/40 border-zinc-800/80 text-zinc-200 rounded-tl-none"
                  }`}
                >
                  {chat.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Text Input Footer */}
        <div className="p-4 border-t border-zinc-800/40 bg-zinc-950/30 flex items-center gap-3 shrink-0">
          <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full py-2.5 pl-4 pr-12 bg-zinc-900/50 focus:bg-zinc-950 border border-zinc-800/80 focus:border-rose-900/50 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-zinc-200 font-sans"
            />
            <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button className="p-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-rose-500/10 transition-colors">
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
