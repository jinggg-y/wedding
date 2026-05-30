"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#F4F0EB", color: "#1C1A17", fontFamily: "serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: "2rem", opacity: 0.8 }}>An unexpected error occurred. Please try again.</p>
          <button
            onClick={reset}
            style={{ backgroundColor: "#BB2649", color: "#F4F0EB", border: "none", padding: "0.75rem 2rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
