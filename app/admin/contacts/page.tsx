"use client";

import { cloneElement, useEffect, useState } from "react";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string | null;
  group: string;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  group: "",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterGroup, setFilterGroup] = useState("");

  async function fetchContacts() {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setContacts(data);
  }

  useEffect(() => { fetchContacts(); }, []);

  const groups = Array.from(new Set(contacts.map((c) => c.group))).sort();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/contacts/${editingId}` : "/api/contacts";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    setEditingId(null);
    await fetchContacts();
    setLoading(false);
  }

  function startEdit(contact: Contact) {
    setEditingId(contact.id);
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      email: contact.email,
      address: contact.address ?? "",
      group: contact.group,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  const filtered = filterGroup
    ? contacts.filter((c) => c.group === filterGroup)
    : contacts;

  return (
    <>
      <h1 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">
        Invitation Contacts
      </h1>

      {/* Add / Edit form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4"
      >
        <h2 className="text-lg font-normal text-zinc-800 dark:text-zinc-200">
          {editingId ? "Edit Contact" : "Add Contact"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" required>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </Field>
          <Field label="Last Name" required>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </Field>
          <Field label="Phone" required>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>
          <Field label="Group" required>
            <input
              type="text"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              placeholder="e.g. Family, Friends, Work"
              required
            />
          </Field>
          <Field label="Address (optional)">
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-viva-magenta text-white text-sm font-normal hover:bg-viva-magenta-hover disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving…" : editingId ? "Update Contact" : "Add Contact"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm(emptyForm); }}
              className="px-5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-normal hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Contacts table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
            {filterGroup && ` in "${filterGroup}"`}
          </p>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-1.5 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <option value="">All groups</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-3 font-normal">Name</th>
                <th className="px-6 py-3 font-normal">Phone</th>
                <th className="px-6 py-3 font-normal">Email</th>
                <th className="px-6 py-3 font-normal">Address</th>
                <th className="px-6 py-3 font-normal">Group</th>
                <th className="px-6 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-400">
                    No contacts yet
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b last:border-0 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-6 py-3 font-normal text-zinc-900 dark:text-zinc-100">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">{c.phone}</td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">{c.email}</td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">{c.address ?? "—"}</td>
                  <td className="px-6 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs">
                      {c.group}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right space-x-3">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactElement<{ className?: string }>;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-normal text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      {cloneElement(children, {
        className:
          "w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400",
      })}
    </label>
  );
}
