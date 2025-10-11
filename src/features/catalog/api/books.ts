import type { Book } from "@/features/catalog/types/book";

const OPEN_LIBRARY_SEARCH_ENDPOINT = "https://openlibrary.org/search.json";

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(`${OPEN_LIBRARY_SEARCH_ENDPOINT}?title=${encodeURIComponent(query)}`);
  const data = (await response.json()) as {
    docs?: Array<{
      key: string;
      title: string;
      author_name?: string[];
      cover_i?: number;
      first_publish_year?: number;
    }>;
  };

  // TODO: Enhance mapping with richer metadata and caching.
  return (
    data.docs?.slice(0, 12).map((doc) => ({
      id: doc.key.replace("/works/", ""),
      title: doc.title,
      author: doc.author_name?.[0] ?? "Unknown Author",
      cover: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : undefined,
      description: undefined,
      year: doc.first_publish_year,
      format: "Digital",
    })) ?? []
  );
}

export async function getBookById(id: string): Promise<Book | null> {
  // TODO: Implement a richer fetch using Open Library Works API or Firebase cache.
  const [book] = await searchBooks(id);
  return book ?? null;
}
