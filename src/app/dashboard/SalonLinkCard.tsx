import Link from "next/link";

type SalonLinkCardProps = {
  slug: string;
};

export default function SalonLinkCard({ slug }: SalonLinkCardProps) {
  const url = `/salon/${slug}`;

  return (
    <div className="flex items-center justify-between gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-stone-500 mb-0.5">Salon linkiniz</p>
        <Link
          href={url}
          className="text-sm font-medium text-rose-600 hover:text-rose-700 break-all"
          target="_blank"
        >
          beautybook.app{url}
        </Link>
      </div>
    </div>
  );
}

