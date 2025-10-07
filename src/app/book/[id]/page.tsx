import BookDetail from "@/components/BookDetail";

type BookPageProps = {
  params: { id: string };
};

export default function BookPage({ params }: BookPageProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm uppercase tracking-[0.4em] text-fuchsia-400">Book Details</p>
        <h1 className="text-3xl font-semibold text-slate-100">
          {/* TODO: Replace placeholder title with fetched data */}
          Tome #{params.id}
        </h1>
      </header>
      <BookDetail bookId={params.id} />
    </section>
  );
}
