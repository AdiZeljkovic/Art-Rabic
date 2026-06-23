'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ title, author }: { title: string; author: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${title} — ${author}`, url }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(url).catch(() => null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted hover:text-graphite transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Share2 className="w-3 h-3" />}
      {copied ? 'Kopirano!' : 'Podijeli'}
    </button>
  );
}
