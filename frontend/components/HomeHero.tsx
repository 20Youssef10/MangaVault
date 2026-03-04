"use client";

import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";

export function HomeHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-[32px] border border-black/10 bg-white/70 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5"
    >
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">MangaVault</p>
        <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
          Read. Download. Switch sources instantly. Built for Arabic and English readers.
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Unified manga discovery, offline downloads, and a reader that adapts to RTL and LTR flows.
        </p>
      </div>
      <div className="mt-8">
        <SearchBar />
      </div>
    </motion.section>
  );
}
