import type { SelectorConfig } from "./cheerioAdapter";

const madaraSelectors: SelectorConfig = {
  search: {
    path: "/",
    item: ".c-tabs-item__content",
    title: ".post-title a",
    url: ".post-title a",
    cover: ".tab-thumb img"
  },
  manga: {
    title: ".post-title h1",
    description: ".summary__content p",
    cover: ".summary_image img",
    status: ".post-status .summary-content",
    genres: ".genres-content a",
    author: ".author-content a"
  },
  chapters: {
    list: ".listing-chapters_wrap",
    item: ".wp-manga-chapter",
    title: "a",
    url: "a",
    number: "a",
    date: ".chapter-release-date"
  },
  pages: {
    item: ".reading-content .page-break",
    image: "img"
  }
};

const kakalotSelectors: SelectorConfig = {
  search: {
    path: "/search/story",
    item: ".story_item",
    title: "h3 a",
    url: "h3 a",
    cover: "img"
  },
  manga: {
    title: ".story-info-right h1",
    description: "#panel-story-info-description",
    cover: ".story-info-left img",
    status: ".story-info-right .stre-value",
    genres: ".story-info-right a",
    author: ".story-info-right .table-value a"
  },
  chapters: {
    list: ".row-content-chapter",
    item: ".a-h",
    title: "a",
    url: "a",
    number: "a",
    date: ".chapter-time"
  },
  pages: {
    item: ".container-chapter-reader",
    image: "img"
  }
};

export const sourceConfigs: Record<string, { selectors: SelectorConfig; searchParam?: string }> = {
  olympusatff: { selectors: madaraSelectors },
  azuramoon: { selectors: madaraSelectors },
  "manga-starz": { selectors: madaraSelectors },
  mangalek: { selectors: madaraSelectors },
  "3asq": { selectors: madaraSelectors },
  mangaswat: { selectors: madaraSelectors },
  mangaareab: { selectors: madaraSelectors },
  "mangakakalot-ar": { selectors: kakalotSelectors, searchParam: "keyword" },
  mangakakalot: { selectors: kakalotSelectors, searchParam: "keyword" },
  manganelo: { selectors: kakalotSelectors, searchParam: "keyword" },
  manganato: { selectors: kakalotSelectors, searchParam: "keyword" },
  mangahere: { selectors: madaraSelectors }
};
