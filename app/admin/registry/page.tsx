"use client";

import { cloneElement, useEffect, useState } from "react";

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

const emptyForm = { name: "", description: "", price: "", url: "", store: "", imageUrl: "" };

export default function AdminRegistryPage() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const res = await fetch("/api/admin/registry");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/registry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    await fetchItems();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this item?")) return;
    await fetch(`/api/admin/registry/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function togglePurchased(item: RegistryItem) {
    const res = await fetch(`/api/admin/registry/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchased: !item.purchased }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    }
  }

  return (
    <>
      <h1 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">Gift Registry</h1>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4"
      >
        <h2 className="text-lg font-normal text-zinc-800 dark:text-zinc-200">Add Item</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" required>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Store">
            <input type="text" value={form.store} onChange={e => setForm({ ...form, store: e.target.value })} placeholder="e.g. Myer, Amazon" />
          </Field>
          <Field label="Price (AUD)">
            <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
          </Field>
          <Field label="Link">
            <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://…" />
          </Field>
          <Field label="Image URL" className="sm:col-span-2">
            <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional short description" />
          </Field>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-viva-magenta text-white text-sm font-normal hover:bg-viva-magenta-hover disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding…" : "Add Item"}
        </button>
      </form>

      {/* Items table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {items.length} item{items.length !== 1 ? "s" : ""} · {items.filter(i => i.purchased).length} claimed
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-3 font-normal">Item</th>
                <th className="px-4 py-3 font-normal">Store</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-400">No items yet</td>
                </tr>
              )}
              {items.map(item => (
                <tr key={item.id} className="border-b last:border-0 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-3 text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded shrink-0" />
                      )}
                      <div>
                        <div className="font-normal">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-zinc-400 mt-0.5">{item.description}</div>
                        )}
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-viva-magenta hover:underline mt-0.5 block truncate max-w-[200px]">
                            {item.url}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{item.store ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {item.price != null ? `$${item.price.toFixed(0)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePurchased(item)}
                      className={`inline-flex items-center gap-1 text-xs font-normal px-2 py-0.5 rounded-full transition-colors ${
                        item.purchased
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200"
                      }`}
                    >
                      {item.purchased ? "✓ Claimed" : "Available"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactElement<{ className?: string }>;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="text-sm font-normal text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      {cloneElement(children, {
        className: "w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400",
      })}
    </label>
  );
}
