"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-cloud-dancer flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-deep-charcoal mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)" }}>
          Something went wrong
        </h1>
        <p className="text-deep-charcoal/80 leading-relaxed mb-8" style={{ fontFamily: "var(--font-open-sans)" }}>
          An unexpected error occurred. You can try again, or return to the home page.
        </p>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={reset}
            className="bg-viva-magenta text-cloud-dancer px-8 py-3 text-sm tracking-[0.1em] uppercase hover:bg-viva-magenta-hover transition-colors duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-deep-charcoal text-sm tracking-[0.1em] uppercase underline-offset-4 hover:underline transition-all duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
