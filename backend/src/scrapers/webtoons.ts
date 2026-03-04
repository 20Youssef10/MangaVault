import { load } from "cheerio";
import type { Chapter, MangaDetails, MangaSummary, Page, SearchFilters } from "../types";
import type { Scraper } from "./Scraper";
import { ScraperBase } from "./base";

export class WebtoonsAdapter extends ScraperBase implements Scraper {
  key = "webtoons";
  name = "Webtoons";
  baseUrl = "https://www.webtoons.com";
  language = "en" as const;
  supportsSearch = true;
  supportsFilters = false;

  async search(query: string, _filters?: SearchFilters): Promise<MangaSummary[]> {
    const url = new URL("/en/search", this.baseUrl);
    url.searchParams.set("keyword", query);
    const html = await this.fetchHtml(url.toString(), { referer: this.baseUrl });
    const $ = load(html);
    const results: MangaSummary[] = [];
    $(".card_item").each((_, el) => {
      const title = $(el).find(".subj").text().trim();
      const href = $(el).find("a").attr("href") || "";
      const cover = $(el).find("img").attr("src") || undefined;
      if (!title || !href) return;
      results.push({
        id: new URL(href, this.baseUrl).toString(),
        source: this.key,
        title,
        coverUrl: cover,
        language: this.language
      });
    });
    return results;
  }

  async getManga(mangaId: string): Promise<MangaDetails> {
    const html = await this.fetchHtml(mangaId, { referer: this.baseUrl });
    const $ = load(html);
    const title = $(".detail_header .subj").first().text().trim();
    const description = $(".detail_header .summary").text().trim();
    const cover = $(".detail_header .thmb img").attr("src") || undefined;
    return {
      id: mangaId,
      source: this.key,
      title,
      coverUrl: cover,
      description,
      language: this.language
    };
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const html = await this.fetchHtml(mangaId, { referer: this.baseUrl });
    const $ = load(html);
    const chapters: Chapter[] = [];
    $("#_listUl li").each((_, el) => {
      const link = $(el).find("a").attr("href") || "";
      const title = $(el).find(".subj").text().trim();
      const date = $(el).find(".date").text().trim();
      if (!link) return;
      chapters.push({
        id: new URL(link, this.baseUrl).toString(),
        mangaId,
        source: this.key,
        title,
        language: this.language,
        publishAt: date
      });
    });
    return chapters;
  }

  async getPages(chapterId: string): Promise<Page[]> {
    const html = await this.fetchHtml(chapterId, { referer: this.baseUrl });
    const $ = load(html);
    const pages: Page[] = [];
    $(".viewer img").each((index, el) => {
      const src = $(el).attr("data-url") || $(el).attr("src") || "";
      if (!src) return;
      pages.push({ index, imageUrl: src });
    });
    return pages;
  }
}
