"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";

export default function SalonLinkCard({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fullUrl = `${origin}/salon/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 flex items-center gap-2 mb-3">
        <span className="text-[11px] text-stone-400 font-mono truncate flex-1">
          {origin}/salon/<span className="text-rose-600 font-semibold">{slug}</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`/salon/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-xl transition-all"
        >
          <ExternalLink className="w-3 h-3" /> Görüntüle
        </a>
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
      </div>
    </>
  );
}