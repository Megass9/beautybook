export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      {/* GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-4 bg-stone-200 rounded-md w-48 mb-2" />
          <div className="h-8 bg-stone-200 rounded-lg w-64" />
        </div>
        <div className="h-11 bg-stone-200 rounded-xl w-36" />
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-stone-100 rounded-xl" />
              <div className="w-4 h-4 bg-stone-100 rounded-full" />
            </div>
            <div className="h-7 bg-stone-200 rounded-md w-24 mb-2" />
            <div className="h-3 bg-stone-100 rounded-md w-32 mb-2" />
            <div className="h-3 bg-stone-100 rounded-md w-20" />
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* TODAY'S APPOINTMENTS */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-stone-100 rounded-xl" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-stone-200 rounded" />
                  <div className="h-2 w-16 bg-stone-100 rounded" />
                </div>
              </div>
              <div className="h-8 w-20 bg-stone-100 rounded-lg" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 py-3 border-b border-stone-50 flex items-center gap-3">
            <div className="flex-1 h-2 bg-stone-100 rounded-full" />
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-2 w-12 bg-stone-100 rounded" />
              <div className="h-2 w-12 bg-stone-100 rounded" />
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-stone-50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                <div className="w-12 text-center shrink-0 space-y-1">
                  <div className="h-4 w-10 mx-auto bg-stone-200 rounded" />
                  <div className="h-2 w-8 mx-auto bg-stone-100 rounded" />
                </div>
                <div className="w-1 h-10 bg-stone-100 rounded-full shrink-0" />
                <div className="w-9 h-9 bg-stone-100 rounded-full shrink-0" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="h-4 w-3/4 bg-stone-200 rounded" />
                  <div className="h-3 w-full bg-stone-100 rounded" />
                </div>
                <div className="h-5 w-12 bg-stone-200 rounded shrink-0" />
                <div className="h-5 w-16 bg-stone-100 rounded-full shrink-0 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          {/* PENDING APPROVALS */}
          <div className="bg-white border border-stone-200 rounded-2xl">
            <div className="px-5 py-3.5 border-b border-stone-100">
              <div className="h-5 w-32 bg-stone-200 rounded" />
            </div>
            <div className="p-3 space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-stone-100 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-3 w-20 bg-stone-200 rounded" />
                    <div className="h-2 w-16 bg-stone-100 rounded" />
                  </div>
                  <div className="h-6 w-8 bg-stone-200 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="px-5 py-4 border-b border-stone-100">
              <div className="h-4 w-24 bg-stone-200 rounded" />
            </div>
            <div className="p-3 space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-stone-100" />
                  <div className="h-4 flex-1 bg-stone-200 rounded" />
                  <div className="w-3.5 h-3.5 bg-stone-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
