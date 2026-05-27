import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-32 text-center">
      <h1 className="text-5xl md:text-7xl font-display text-espresso">404</h1>
      <p className="mt-4 text-lg text-espresso-soft">העמוד שחיפשתם לא נמצא.</p>
      <p className="mt-2 text-base text-espresso-soft">
        <Link href="/" className="text-olive hover:text-espresso">חזרו לדף הבית</Link>
      </p>
    </section>
  );
}
