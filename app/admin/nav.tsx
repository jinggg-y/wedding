"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <span className="font-normal text-sm tracking-widest uppercase text-viva-magenta">
          Admin
        </span>
        <div className="flex items-center gap-1">
          <NavLink href="/admin" active={pathname === "/admin"}>Settings</NavLink>
          <NavLink href="/admin/events" active={pathname === "/admin/events"}>Events</NavLink>
          <NavLink href="/admin/contacts" active={pathname === "/admin/contacts"}>Contacts</NavLink>
          <NavLink href="/admin/rsvp" active={pathname === "/admin/rsvp"}>RSVPs</NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-md text-sm font-normal text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-1.5 rounded-md text-sm font-normal transition-colors
        ${active
          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }`}
    >
      {children}
    </Link>
  );
}
