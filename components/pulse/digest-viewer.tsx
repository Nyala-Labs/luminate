"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import logo from '@/public/nyalalabs.svg';
import { toast } from "sonner";

interface DigestViewerProps {
  digest: string;
}

export function DigestViewer({ digest }: DigestViewerProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(digest);
    toast.success("Digest copied to clipboard!");
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(digest)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weekly Digest</h1>
        <div className="flex gap-2">
            <Button onClick={copyToClipboard} variant="outline">
                <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button onClick={shareToWhatsApp} className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </Button>
        </div>
      </div>
      
      {/* Updated card styling for dark mode compatibility, keeping the WhatsApp-ish background */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center gap-4 border-b border-zinc-800">
          <Image src={logo} alt="Nyala Labs" width={64} height={64} className="rounded-full" />
          <CardTitle className="text-xl text-zinc-100">Nyala Pulse - Weekly Update</CardTitle>
        </CardHeader>
        <CardContent className="p-6 whitespace-pre-wrap font-mono text-sm text-zinc-300">
          {digest}
        </CardContent>
      </Card>
    </div>
  );
}
