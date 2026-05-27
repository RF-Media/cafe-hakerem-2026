/**
 * Server-side JSON-LD emitter. Pass any JSON-serialisable object;
 * `null`/`undefined` properties are stripped before rendering so
 * partial schemas (e.g. geo missing) don't pollute the markup.
 */
export function JsonLd({ data }: { data: unknown }) {
  const clean = JSON.parse(JSON.stringify(data, (_k, v) => (v == null ? undefined : v)));
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean) }}
    />
  );
}
