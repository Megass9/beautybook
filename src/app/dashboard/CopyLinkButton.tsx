"use client";
import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2 rounded-xl transition-all"
    >
      {copied ? (
        <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Kopyalandı!</>
      ) : (
        <><Copy className="w-3 h-3" /> Kopyala</>
      )}
    </button>
  );
}
