"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/app/components/nav";

interface RegistryItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  url: string | null;
  store: string | null;
  imageUrl: string | null;
  purchased: boolean;
}

export default function RegistryPage() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [thankedItem, setThankedItem] = useState<RegistryItem | null>(null);

  useEffect(() => {
    fetch("/api/registry")
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function togglePurchased(item: RegistryItem) {
    setToggling(item.id);
    const claiming = !item.purchased;
    const res = await fetch(`/api/registry/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchased: claiming }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      if (claiming) setThankedItem(item);
    }
    setToggling(null);
  }

  const available = items.filter(i => !i.purchased);
  const claimed   = items.filter(i => i.purchased);

  return (
    <div className="min-h-screen bg-cloud-dancer text-deep-charcoal flex flex-col">
      <Nav />

      <main className="flex-1 px-8 md:px-20 py-20 max-w-5xl w-full mx-auto">

        {/* Header */}
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <div aria-hidden="true" className="label text-deep-charcoal/65 mb-16">
            &mdash; Gift Registry
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant-garamond)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Registry
          </h1>
          <p
            style={{
              fontFamily: "var(--font-open-sans)",
              fontSize: "0.875rem",
              color: "rgba(28,26,23,0.80)",
              lineHeight: 1.85,
              marginBottom: "5rem",
              maxWidth: "36rem",
            }}
          >
            Your presence is our greatest gift. If you would like to give something, we have listed a few ideas below. Please mark an item as claimed once you have purchased it.
          </p>
        </div>

        {/* Wishing Well card */}
        <div className="mb-12">
          <Link href="/registry/wishing-well" className="block group">
            <div className="bg-deep-charcoal text-cloud-dancer p-10 md:p-14 flex flex-col md:flex-row md:items-center gap-8 transition-opacity duration-300 group-hover:opacity-90">
              <div className="flex-1">
                <div className="label text-viva-magenta mb-4 text-[0.65rem]" aria-hidden="true">Wishing Well</div>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant-garamond)",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 300,
                    letterSpacing: "0.06em",
                    lineHeight: 1.15,
                    marginBottom: "1.25rem",
                  }}
                >
                  A Contribution to Our Future
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-open-sans)",
                    fontSize: "0.85rem",
                    color: "rgba(244,240,235,0.80)",
                    lineHeight: 1.85,
                  }}
                >
                  Your presence is the greatest gift of all. If you wish to give something more, a contribution to our honeymoon and future home is warmly appreciated.
                </p>
              </div>
              <div className="label text-[0.65rem] px-8 py-3 border border-cloud-dancer/30 text-cloud-dancer group-hover:border-viva-magenta group-hover:text-viva-magenta transition-colors duration-300 whitespace-nowrap self-start md:self-center">
                Wishing Well &rarr;
              </div>
            </div>
          </Link>
        </div>

        {loading && (
          <p className="label text-deep-charcoal/65 text-[0.72rem] mb-12">Loading…</p>
        )}

        {/* Available items */}
        {available.length > 0 && (
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-deep-charcoal/10">
              {available.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  toggling={toggling === item.id}
                  onToggle={() => togglePurchased(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Claimed items */}
        {claimed.length > 0 && (
          <div>
            <div className="label text-deep-charcoal/65 mb-8 text-[0.72rem]">
              Claimed
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-deep-charcoal/10">
              {claimed.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  toggling={toggling === item.id}
                  onToggle={() => togglePurchased(item)}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {thankedItem && (
        <ThankYouModal item={thankedItem} onClose={() => setThankedItem(null)} />
      )}
    </div>
  );
}

function ThankYouModal({ item, onClose }: { item: RegistryItem; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thank you"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(28,26,23,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50,
        padding: "2rem",
        animation: "fadeIn 0.25s ease both",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#F4F0EB",
          maxWidth: "28rem",
          width: "100%",
          padding: "3.5rem",
          animation: "fadeUp 0.3s ease both",
          position: "relative",
        }}
      >
        <div aria-hidden="true" className="label text-viva-magenta mb-8 text-[0.65rem]">
          Thank you
        </div>
        <div
          style={{
            fontFamily: "var(--font-cormorant-garamond)",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}
        >
          You&rsquo;re getting<br />
          <em style={{ fontStyle: "italic" }}>{item.name}.</em>
        </div>
        <p
          style={{
            fontFamily: "var(--font-open-sans)",
            fontSize: "0.825rem",
            color: "rgba(28,26,23,0.80)",
            lineHeight: 1.85,
            marginBottom: "2.5rem",
          }}
        >
          Dimitrije &amp; Jing are so grateful. We&rsquo;ve marked this gift as taken so no one else picks the same one.
        </p>
        <button
          onClick={onClose}
          className="label px-8 py-3 bg-deep-charcoal text-cloud-dancer hover:opacity-80 transition-opacity duration-300 text-[0.65rem]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  toggling,
  onToggle,
}: {
  item: RegistryItem;
  toggling: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="bg-cloud-dancer flex flex-col"
      style={{ opacity: item.purchased ? 0.5 : 1, transition: "opacity 0.3s" }}
    >
      {item.imageUrl && (
        <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "rgba(28,26,23,0.04)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}
      <div className="p-8 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontFamily: "var(--font-cormorant-garamond)",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 1.2,
              textDecoration: item.purchased ? "line-through" : "none",
            }}
          >
            {item.name}
          </div>
            {item.store && (
            <div className="label text-deep-charcoal/65 text-[0.65rem] mt-1">
              {item.store}
            </div>
          )}
        </div>
        {item.price != null && (
          <div
            style={{
              fontFamily: "var(--font-cormorant-garamond)",
              fontSize: "1.1rem",
              fontWeight: 300,
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
              color: item.purchased ? "rgba(28,26,23,0.5)" : "#1C1A17",
            }}
          >
            ${item.price.toFixed(0)}
          </div>
        )}
        </div>

        {item.description && (
          <p
            style={{
              fontFamily: "var(--font-open-sans)",
              fontSize: "0.8rem",
              color: "rgba(28,26,23,0.80)",
              lineHeight: 1.75,
            }}
          >
            {item.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-auto pt-2">
          {item.url && !item.purchased && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-viva-magenta hover:text-viva-magenta-hover transition-colors duration-300 text-[0.65rem]"
            >
              View gift &rarr;
            </a>
          )}
          {item.purchased ? (
            <button
              onClick={onToggle}
              disabled={toggling}
              className="label text-deep-charcoal/65 hover:text-deep-charcoal transition-colors duration-300 text-[0.65rem] disabled:opacity-40 ml-auto"
            >
              {toggling ? "…" : "Mark as available"}
            </button>
          ) : (
            <button
              onClick={onToggle}
              disabled={toggling}
              className="label px-6 py-2.5 bg-viva-magenta text-cloud-dancer hover:bg-viva-magenta-hover transition-colors duration-300 text-[0.65rem] disabled:opacity-40 ml-auto"
            >
              {toggling ? "…" : "I've got this"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
  