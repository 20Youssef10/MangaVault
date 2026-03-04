import Link from "next/link";

export function MangaCard({ manga }: { manga: any }) {
  return (
    <Link
      href={`/${manga.language}/manga/${manga.source}/${encodeURIComponent(manga.id)}`}
      className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      <div className="h-20 w-14 overflow-hidden rounded-lg bg-black/10">
        {manga.coverUrl ? <img src={manga.coverUrl} alt={manga.title} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[var(--color-text)]">{manga.title}</p>
        <p className="text-xs text-[var(--color-muted)]">{manga.source}</p>
      </div>
    </Link>
  );
}
