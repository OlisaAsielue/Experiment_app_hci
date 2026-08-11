import Link from "next/link";

/**
 * "/" - RWO funder explainer.
 *
 * PLACEHOLDER holding page. The full explainer (copy from
 * docs/rwo-explainer-copy.md, via content/rwo-copy.ts) is built in Step 11.
 * For now this just replaces the create-next-app boilerplate and links to /demo.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Placeholder landing page
      </p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-neutral-900">
        People are starting to trust AI without checking it.
      </h1>
      <p className="mt-4 text-lg leading-8 text-neutral-600">
        This project measures the moment that happens - and tests a way to
        slow it down. The full explainer for this page is coming soon.
      </p>
      <div className="mt-8">
        <Link
          href="/demo"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Try the demo &rarr;
        </Link>
      </div>
    </main>
  );
}
