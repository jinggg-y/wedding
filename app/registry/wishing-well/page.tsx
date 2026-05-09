"use client";

import Link from "next/link";
import Nav from "@/app/components/nav";

export default function WishingWellPage() {
  return (
    <div className="min-h-screen bg-cloud-dancer text-deep-charcoal flex flex-col">
      <Nav />

      <main className="flex-1 px-8 md:px-20 py-20 max-w-5xl w-full mx-auto">

        {/* Back link */}
        <div style={{ animation: "fadeUp 0.4s ease both" }} className="mb-16">
          <Link
            href="/registry"
            className="label text-deep-charcoal/65 hover:text-deep-charcoal transition-colors duration-300 text-[0.65rem]"
          >
            &larr; Registry
          </Link>
        </div>

        {/* Header */}
        <div style={{ animation: "fadeUp 0.6s ease both 0.1s" }}>
          <h1
            style={{
              fontFamily: "var(--font-cormorant-garamond)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginBottom: "2rem",
            }}
          >
            A Contribution<br />to Our Future
          </h1>
          <p
            style={{
              fontFamily: "var(--font-open-sans)",
              fontSize: "0.875rem",
              color: "rgba(28,26,23,0.80)",
              lineHeight: 1.85,
              maxWidth: "36rem",
              marginBottom: "3rem",
            }}
          >
            Your presence at our wedding is the most meaningful gift we could ask for. <br></br>If you would like to give something more, a contribution to our wishing well is warmly appreciated, for our honeymoon, our first home, and the adventures ahead.
          </p>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{ height: "1px", backgroundColor: "rgba(28,26,23,0.10)", marginBottom: "5rem", animation: "fadeUp 0.6s ease both 0.2s" }}
        />

        {/* Bank details */}
        <div style={{ animation: "fadeUp 0.6s ease both 0.3s" }} className="max-w-lg">
          <div className="label text-deep-charcoal/65 mb-10 text-[0.65rem]">Bank Transfer</div>

          <div className="space-y-8">
            <DetailRow label="Account name" value="Dimitrije &amp; Jing" />
            <DetailRow label="BSB" value="012-345" />
            <DetailRow label="Account number" value="123 456 789" />
            <DetailRow label="Reference" value="Your name" note="So we know who to thank" />
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{ height: "1px", backgroundColor: "rgba(28,26,23,0.10)", margin: "5rem 0", animation: "fadeUp 0.6s ease both 0.4s" }}
        />

        {/* Thank you note */}
        <div style={{ animation: "fadeUp 0.6s ease both 0.5s" }} className="max-w-xl">
          <p
            style={{
              fontFamily: "var(--font-cormorant-garamond)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 1.5,
              color: "rgba(28,26,23,0.75)",
            }}
          >
            &ldquo;Thank you for being part of our story.&rdquo;
          </p>
        </div>

      </main>
    </div>
  );
}

function DetailRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="label text-deep-charcoal/65 text-[0.65rem]"
        aria-hidden="true"
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-cormorant-garamond)",
          fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
          fontWeight: 300,
          letterSpacing: "0.04em",
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      {note && (
        <div
          style={{
            fontFamily: "var(--font-open-sans)",
            fontSize: "0.75rem",
            color: "rgba(28,26,23,0.65)",
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}
