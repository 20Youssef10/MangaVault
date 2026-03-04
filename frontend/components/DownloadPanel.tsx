"use client";

import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { buildPdf, buildZip } from "../lib/downloadClient";
import { fetchPages, imageProxyUrl } from "../lib/api";

type Chapter = { id: string; number?: number; title?: string };
type Mode = "single" | "range" | "all";

export function DownloadPanel({
  source,
  mangaTitle,
  chapters
}: {
  source: string;
  mangaTitle: string;
  chapters: Chapter[];
}) {
  const [mode, setMode] = useState<Mode>("single");
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]?.id ?? "");
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [format, setFormat] = useState<"zip" | "cbz" | "pdf">("zip");
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
  }, [chapters]);

  async function startDownload() {
    if (!sortedChapters.length) return;
    setBusy(true);
    setStatus("Preparing pages...");
    try {
      const list = resolveChapters();
      const pages: string[] = [];
      for (const chapter of list) {
        const chapterPages = await fetchPages(source, chapter.id);
        chapterPages.forEach((page: { imageUrl: string }) => pages.push(imageProxyUrl(page.imageUrl)));
        setStatus(`Loaded ${pages.length} pages...`);
      }

      const filename = `${slugify(mangaTitle)}.${format}`;
      if (format === "pdf") {
        await buildPdf(pages, filename);
      } else {
        await buildZip(pages, filename, quality);
      }
      setStatus("Download ready.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Download failed");
    } finally {
      setBusy(false);
    }
  }

  function resolveChapters() {
    if (mode === "single") {
      return sortedChapters.filter((chapter) => chapter.id === selectedChapter);
    }
    if (mode === "all") {
      return sortedChapters;
    }
    const from = Number(rangeFrom);
    const to = Number(rangeTo);
    const ranged = sortedChapters.filter((chapter) => {
      if (chapter.number === undefined) return false;
      if (!Number.isNaN(from) && chapter.number < from) return false;
      if (!Number.isNaN(to) && chapter.number > to) return false;
      return true;
    });
    return ranged.length ? ranged : sortedChapters;
  }

  return (
    <section className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Download (Client)</h2>
        {status ? <span className="text-xs text-[var(--color-muted)]">{status}</span> : null}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="rounded-xl border border-black/10 px-3 py-2 text-sm">
          <option value="single">Single chapter</option>
          <option value="range">Range</option>
          <option value="all">Full manga</option>
        </select>
        {mode === "single" ? (
          <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} className="rounded-xl border border-black/10 px-3 py-2 text-sm">
            {sortedChapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title || `Chapter ${chapter.number ?? ""}`}
              </option>
            ))}
          </select>
        ) : null}
        {mode === "range" ? (
          <div className="flex gap-2">
            <input
              value={rangeFrom}
              onChange={(e) => setRangeFrom(e.target.value)}
              placeholder="From"
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
            />
            <input
              value={rangeTo}
              onChange={(e) => setRangeTo(e.target.value)}
              placeholder="To"
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
            />
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="rounded-xl border border-black/10 px-3 py-2 text-sm">
          <option value="zip">ZIP</option>
          <option value="cbz">CBZ</option>
          <option value="pdf">PDF</option>
        </select>
        <select value={quality} onChange={(e) => setQuality(e.target.value as any)} className="rounded-xl border border-black/10 px-3 py-2 text-sm">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button onClick={startDownload} disabled={busy}>
          {busy ? "Preparing..." : "Download"}
        </Button>
      </div>
    </section>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}
