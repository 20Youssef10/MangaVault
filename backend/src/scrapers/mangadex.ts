import type { Chapter, MangaDetails, MangaSummary, Page, SearchFilters } from "../types";
import type { Scraper } from "./Scraper";
import { ScraperBase } from "./base";

type MangaDexTag = { attributes?: { name?: Record<string, string> } };
type MangaDexRelationship = { type: string; attributes?: { fileName?: string } };
type MangaDexManga = {
  id: string;
  attributes: {
    title: Record<string, string>;
    description?: Record<string, string>;
    status?: string;
    rating?: { bayesian?: number };
    year?: number;
    tags?: MangaDexTag[];
    altTitles?: Record<string, string>[];
    author?: string;
    artist?: string;
  };
  relationships?: MangaDexRelationship[];
};
type MangaDexSearchResponse = { data: MangaDexManga[] };
type MangaDexMangaResponse = { data: MangaDexManga };
type MangaDexChapter = {
  id: string;
  attributes: { title?: string; chapter?: string; publishAt?: string };
};
type MangaDexChapterResponse = { data: MangaDexChapter[] };
type MangaDexAtHomeResponse = { baseUrl: string; chapter: { hash: string; data: string[] } };

export class MangaDexAdapter extends ScraperBase implements Scraper {
  key = "mangadex";
  name = "MangaDex";
  baseUrl = "https://mangadex.org";
  apiBase = "https://api.mangadex.org";
  language = "en" as const;
  supportsSearch = true;
  supportsFilters = true;

  async search(query: string, filters?: SearchFilters): Promise<MangaSummary[]> {
    const url = new URL(`${this.apiBase}/manga`);
    url.searchParams.set("title", query);
    url.searchParams.set("limit", "20");
    if (filters?.year) url.searchParams.set("year", String(filters.year));
    if (filters?.status) url.searchParams.set("status[]", filters.status);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("MangaDex search failed");
    const json = (await response.json()) as MangaDexSearchResponse;
    return json.data.map((item) => {
      const attributes = item.attributes;
      const title = attributes.title.en || Object.values(attributes.title)[0];
      const coverRel = item.relationships?.find((rel) => rel.type === "cover_art");
      const coverFileName = coverRel?.attributes?.fileName;
      const coverUrl = coverFileName ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}` : undefined;
      return {
        id: item.id,
        source: this.key,
        title,
        coverUrl,
        language: this.language,
        rating: attributes.rating?.bayesian ?? undefined,
        year: attributes.year ?? undefined,
        genres: attributes.tags?.map((tag) => tag.attributes?.name?.en).filter(Boolean) ?? []
      } as MangaSummary;
    });
  }

  async getManga(mangaId: string): Promise<MangaDetails> {
    const response = await fetch(`${this.apiBase}/manga/${mangaId}?includes[]=cover_art`);
    if (!response.ok) throw new Error("MangaDex manga failed");
    const json = (await response.json()) as MangaDexMangaResponse;
    const item = json.data;
    const attributes = item.attributes;
    const title = attributes.title.en || Object.values(attributes.title)[0];
    const coverRel = item.relationships?.find((rel) => rel.type === "cover_art");
    const coverFileName = coverRel?.attributes?.fileName;
    const coverUrl = coverFileName ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}` : undefined;
    return {
      id: item.id,
      source: this.key,
      title,
      coverUrl,
      description: attributes.description?.en || Object.values(attributes.description ?? {})[0],
      status: attributes.status,
      author: attributes.author,
      artist: attributes.artist,
      altTitles: attributes.altTitles?.map((alt) => Object.values(alt)[0]).filter(Boolean),
      genres: attributes.tags?.map((tag) => tag.attributes?.name?.en).filter(Boolean) ?? [],
      language: this.language
    };
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const url = new URL(`${this.apiBase}/chapter`);
    url.searchParams.set("manga", mangaId);
    url.searchParams.set("limit", "100");
    url.searchParams.set("order[chapter]", "asc");
    url.searchParams.set("translatedLanguage[]", this.language);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("MangaDex chapters failed");
    const json = (await response.json()) as MangaDexChapterResponse;
    return json.data.map((item) => ({
      id: item.id,
      mangaId,
      source: this.key,
      title: item.attributes.title,
      number: item.attributes.chapter ? Number.parseFloat(item.attributes.chapter) : undefined,
      language: this.language,
      publishAt: item.attributes.publishAt
    }));
  }

  async getPages(chapterId: string): Promise<Page[]> {
    const response = await fetch(`${this.apiBase}/at-home/server/${chapterId}`);
    if (!response.ok) throw new Error("MangaDex pages failed");
    const json = (await response.json()) as MangaDexAtHomeResponse;
    const baseUrl = json.baseUrl;
    const hash = json.chapter.hash;
    const data = json.chapter.data;
    return data.map((file: string, index: number) => ({
      index,
      imageUrl: `${baseUrl}/data/${hash}/${file}`
    }));
  }
}
