import { Scissors } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      {/* Spinner */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-stone-200" />
        <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Scissors className="w-5 h-5 text-rose-500" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-600">Yükleniyor</p>
        <p className="text-xs text-stone-400 mt-0.5">Lütfen bekleyin...</p>
      </div>
    </div>
  );
}
