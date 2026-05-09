"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/welcome",  label: "Welcome"  },
  { href: "/rsvp",     label: "RSVP"     },
  { href: "/registry", label: "Registry" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Site navigation"
      className="shrink-0 bg-cloud-dancer border-b border-deep-charcoal/10 px-8 md:px-20 py-5 flex justify-between items-center"
    >
      <Link
        href="/welcome"
        className="label text-deep-charcoal hover:text-viva-magenta transition-colors duration-[400ms]"
        style={{ letterSpacing: "0.18em" }}
      >
        Dimitrije &amp; Jing
      </Link>

      <div className="flex items-center gap-10">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="label text-[0.72rem] transition-colors duration-[400ms]"
              style={{ color: active ? "#BB2649" : "rgba(28,26,23,0.65)" }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
