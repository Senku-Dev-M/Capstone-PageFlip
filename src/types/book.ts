export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  year?: number;
  format?: string;
  tags?: string[];
}

// TODO: Extend with availability, ISBNs, reading progress, and cyberpunk metadata.
