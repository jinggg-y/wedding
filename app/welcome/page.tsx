import Link from "next/link";
import CeremonyCountdown from "./ceremony-countdown";
import ScrollReveal from "./scroll-reveal";

export default function WelcomePage() {
  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-viva-magenta focus:text-cloud-dancer label"
      >
        Skip to main content
      </a>

      <main id="main-content" className="snap-container bg-cloud-dancer text-deep-charcoal">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          aria-label="Welcome"
          className="snap-section relative flex flex-col overflow-hidden"
        >
          {/* Masthead — inside hero */}
          <header
            aria-hidden="true"
            className="shrink-0 border-b border-deep-charcoal/10 px-8 md:px-20 py-4 flex justify-between items-center"
            style={{ animation: "fadeUp 0.5s ease both" }}
          >
            <span className="label text-deep-charcoal/35">D &amp; J</span>
            <span className="label text-deep-charcoal/35">2026 &middot; Brisbane</span>
          </header>

          {/* Hero content */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-20 relative">
            {/* Ghost year watermark — decorative */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute right-[-2vw] top-1/2 -translate-y-1/2"
              style={{
                fontFamily: "var(--font-cormorant-garamond)",
                fontSize: "clamp(10rem, 30vw, 28rem)",
                fontWeight: 300,
                lineHeight: 1,
                color: "rgba(28,26,23,0.04)",
                letterSpacing: "-0.02em",
              }}
            >
              2026
            </div>

            {/* Names */}
            <div style={{ animation: "fadeUp 0.6s ease both" }}>
              <h1
                aria-label="Dimitrije and Jing"
                style={{
                  fontSize: "clamp(3rem, 10.5vw, 9.5rem)",
                  fontWeight: 300,
                  letterSpacing: "0.06em",
                  lineHeight: 1.0,
                  textTransform: "uppercase",
                }}
              >
                Dimitrije
                <br />
                <em style={{ fontStyle: "italic" }}>&amp; Jing</em>
              </h1>
            </div>

            {/* Tagline */}
            <div
              className="mt-10 border-t border-deep-charcoal/10 pt-6 max-w-xs"
              style={{ animation: "fadeUp 0.6s 0.15s ease both" }}
            >
              <span className="label text-deep-charcoal/70">
                Invite you to celebrate their marriage
              </span>
            </div>

            {/* Scroll cue — decorative */}
            <div
              aria-hidden="true"
              className="absolute bottom-10 left-8 md:left-20 flex flex-col items-start gap-3"
              style={{ animation: "fadeUp 0.6s 0.3s ease both" }}
            >
              <span className="label text-deep-charcoal/25 text-[0.55rem]">Scroll</span>
              <div className="w-px h-10 bg-deep-charcoal/20" />
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN — dark ─────────────────────────────── */}
        <section
          aria-label="Ceremony countdown"
          className="snap-section bg-deep-charcoal flex items-center px-8 md:px-20"
        >
          <ScrollReveal className="w-full">
            <CeremonyCountdown />
          </ScrollReveal>
        </section>

        {/* ── RSVP ─────────────────────────────────────────── */}
        <section
          aria-label="RSVP"
          className="snap-section border-t border-deep-charcoal/10 flex flex-col items-center justify-center text-center px-8 md:px-20"
        >
          <ScrollReveal>
            <div aria-hidden="true" className="label text-deep-charcoal/30 mb-10">
              01 &mdash; RSVP
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant-garamond)",
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                color: "#1C1A17",
                marginBottom: "3.5rem",
                textTransform: "none",
              }}
            >
              Will you join us?
            </h2>
            <Link
              href="/rsvp"
              className="label inline-block px-12 py-4 bg-viva-magenta text-cloud-dancer hover:bg-viva-magenta-hover transition-colors duration-300"
            >
              Confirm Attendance
            </Link>
          </ScrollReveal>
        </section>

        {/* ── OUR STORY A — photo + dark text ──────────────── */}
        <section
          aria-label="Our story"
          className="snap-section border-t border-deep-charcoal/10 flex flex-col"
        >
          {/* Section label */}
          <div className="shrink-0 px-8 md:px-20 pt-10 pb-6">
            <ScrollReveal>
              <div aria-hidden="true" className="label text-deep-charcoal/30">
                02 &mdash; Our Story
              </div>
            </ScrollReveal>
          </div>

          {/* Gallery row A */}
          <div className="flex-1 grid md:grid-cols-12 min-h-0">
            {/* Photo 1 — large portrait */}
            <div
              role="img"
              aria-label="Photo of Dimitrije and Jing"
              className="md:col-span-7 flex items-end p-8 md:p-12"
              style={{ background: "rgba(28,26,23,0.05)" }}
            >
              <span aria-hidden="true" className="label text-deep-charcoal/20 text-[0.55rem]">
                Photo — Dimitrije &amp; Jing
              </span>
            </div>

            {/* Text block — dark */}
            <div
              className="md:col-span-5 bg-deep-charcoal flex flex-col justify-end p-10 md:p-16"
            >
              <ScrollReveal>
                <blockquote
                  style={{
                    fontFamily: "var(--font-cormorant-garamond)",
                    fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    lineHeight: 1.25,
                    color: "#F4F0EB",
                    marginBottom: "2rem",
                  }}
                >
                  &ldquo;Two cities, one moment,<br />a lifetime ahead.&rdquo;
                </blockquote>
                <p style={{ fontSize: "0.85rem", color: "rgba(244,240,235,0.65)", fontWeight: 300, lineHeight: 1.85 }}>
                  Placeholder — add a few sentences about how you met, what brought you together, and what this day means to you both.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── OUR STORY B — warm text + photo ──────────────── */}
        <section
          aria-label="Our story, continued"
          className="snap-section"
        >
          <div className="h-full grid md:grid-cols-12">
            {/* Text block — warm light */}
            <div
              className="md:col-span-5 flex flex-col justify-center p-10 md:p-16"
              style={{ background: "#E6E1DA" }}
            >
              <ScrollReveal>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant-garamond)",
                    fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.1,
                    color: "#1C1A17",
                    marginBottom: "1.5rem",
                  }}
                >
                  Brisbane<br />2026
                </div>
                <p style={{ fontSize: "0.8rem", color: "rgba(28,26,23,0.65)", fontWeight: 300, lineHeight: 1.85 }}>
                  Placeholder — a line about your connection to Brisbane, or a detail about the journey that brought you here.
                </p>
              </ScrollReveal>
            </div>

            {/* Photo 2 — wide landscape */}
            <div
              role="img"
              aria-label="Photo of Brisbane, 2026"
              className="md:col-span-7 flex items-end p-8 md:p-12"
              style={{ background: "rgba(28,26,23,0.06)" }}
            >
              <span aria-hidden="true" className="label text-deep-charcoal/20 text-[0.55rem]">
                Photo — Brisbane, 2026
              </span>
            </div>
          </div>
        </section>

        {/* ── CLOSING SCREEN ───────────────────────────────── */}
        <footer
          className="snap-section border-t border-deep-charcoal/10 flex flex-col items-center justify-center text-center gap-8 px-8 md:px-20"
        >
          <ScrollReveal>
            <div
              style={{
                fontFamily: "var(--font-cormorant-garamond)",
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                fontWeight: 300,
                letterSpacing: "0.08em",
                lineHeight: 1.05,
                color: "#1C1A17",
              }}
            >
              Dimitrije<br /><em style={{ fontStyle: "italic" }}>&amp; Jing</em>
            </div>
            <div className="label text-deep-charcoal/35 mt-6">Brisbane &middot; 2026</div>
          </ScrollReveal>
        </footer>

      </main>
    </>
  );
}
