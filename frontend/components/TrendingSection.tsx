"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSources } from "../lib/api";

export function TrendingSection() {
  const { data } = useQuery({ queryKey: ["sources"], queryFn: fetchSources });
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Trending Sources</h2>
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Live</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {data?.map((source: any) => (
          <div key={source.key} className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <p className="font-semibold">{source.name}</p>
            <p className="text-xs text-[var(--color-muted)]">{source.language.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
