import type { Metadata } from "next";
import AdminNav from "./nav";

export const metadata: Metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950" style={{ fontFamily: "var(--font-open-sans), sans-serif" }}>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {children}
      </div>
    </div>
  );
}
