"use client";

export default function RsvpError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-cloud-dancer flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-deep-charcoal mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)" }}>
          Unable to load RSVP
        </h1>
        <p className="text-deep-charcoal/80 leading-relaxed mb-8" style={{ fontFamily: "var(--font-open-sans)" }}>
          We couldn&apos;t load the RSVP page. Please try again — if the problem persists,
          contact us directly at{" "}
          <a href="mailto:jingyang2102@gmail.com" className="text-viva-magenta hover:underline">
            jingyang2102@gmail.com
          </a>
          .
        </p>
        <button
          onClick={reset}
          className="bg-viva-magenta text-cloud-dancer px-8 py-3 text-sm tracking-[0.1em] uppercase hover:bg-viva-magenta-hover transition-colors duration-300"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
