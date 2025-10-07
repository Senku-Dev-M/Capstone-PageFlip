import type { Book } from "@/types/book";

const OPEN_LIBRARY_SEARCH_ENDPOINT = "https://openlibrary.org/search.json";
const DEFAULT_QUERY = "it";

const STATUS_COLORS = ["available", "borrowed"] as const;

export type BookStatus = (typeof STATUS_COLORS)[number];

function buildCoverUrl(doc: {
  cover_i?: number;
  cover_edition_key?: string;
}): string | undefined {
  if (doc.cover_i) {
    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  }

  if (doc.cover_edition_key) {
    return `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`;
  }

  return undefined;
}

export async function fetchBooks(query: string = DEFAULT_QUERY): Promise<Book[]> {
  const response = await fetch(
    `${OPEN_LIBRARY_SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&limit=40`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache responses so catalog loads fast while still refreshing periodically.
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books from Open Library");
  }

  const data = (await response.json()) as {
    docs?: Array<{
      key: string;
      title: string;
      author_name?: string[];
      cover_i?: number;
      cover_edition_key?: string;
      first_publish_year?: number;
      edition_count?: number;
      subject?: string[];
    }>;
  };

  const docs = data.docs ?? [];

  return docs.slice(0, 40).map((doc, index) => ({
    id: doc.key.replace("/works/", ""),
    title: doc.title,
    author: doc.author_name?.[0] ?? "Unknown Author",
    cover: buildCoverUrl(doc),
    year: doc.first_publish_year,
    format: "Digital", // Placeholder until richer metadata is surfaced.
    status: STATUS_COLORS[index % STATUS_COLORS.length],
    popularity: doc.edition_count ?? 0,
    category: inferCategory(doc.subject),
  }));
}

type CatalogCategory = NonNullable<Book["category"]>;

const CATEGORY_KEYWORDS: Record<CatalogCategory, string[]> = {
  Fiction: ["fiction", "novel", "fantasy", "literature", "story", "drama"],
  Science: ["science", "scientific", "physics", "biology", "chemistry", "technology"],
  History: ["history", "historical", "biography", "civilization", "war"],
};

function inferCategory(subjects: string[] | undefined): CatalogCategory {
  if (!subjects?.length) {
    return "Fiction";
  }

  const normalizedSubjects = subjects.map((subject) => subject.toLowerCase());

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (
      normalizedSubjects.some((subject) =>
        keywords.some((keyword) => subject.includes(keyword)),
      )
    ) {
      return category as CatalogCategory;
    }
  }

  return "Fiction";
}
