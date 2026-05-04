# Wedding Site

A private wedding website with a passcode-protected guest experience and an admin panel for managing invitations.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) | 16.2.4 |
| Language | TypeScript | 5.9.3 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS v4 | 4.2.2 |
| Font | Cormorant Garamond via `next/font/google` | — |
| ORM | Prisma | 7.8.0 |
| Database | [Neon](https://neon.tech) (serverless PostgreSQL) | — |
| DB Driver | `@neondatabase/serverless` + `@prisma/adapter-neon` (HTTP) | 1.1.0 / 7.8.0 |

## Key Features

- **Passcode gate** — guests enter a passcode on the landing page to access the site; enforced via `proxy.ts` (Next.js v16 server proxy)
- **Admin panel** — `/admin` for site settings (passcode management) and `/admin/contacts` for invitation contacts
- **Contacts CRUD** — add, edit, delete, and filter contacts by group; stored in Neon PostgreSQL via Prisma

## Theme

- **Background:** Cloud Dancer (`#F0EDE8`)
- **Accent:** Viva Magenta (`#BB2649`)
- **Text:** Black

## Project Structure

```
app/
  page.tsx              # Landing page (passcode entry)
  welcome/              # Post-login welcome page
  admin/
    page.tsx            # Admin settings (passcode)
    contacts/           # Contacts management
  api/
    verify-passcode/    # POST — validate guest passcode
    contacts/           # GET, POST, PUT, DELETE contacts
    admin/settings/     # GET, POST site config (passcode)
lib/
  prisma.ts             # Prisma client singleton
prisma/
  schema.prisma         # Contact + SiteConfig models
proxy.ts                # Route protection (Next.js v16 proxy)
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` with your Neon connection string:
   ```
   DATABASE_URL="postgresql://..."
   ```

3. Push the schema to your database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000/admin](http://localhost:3000/admin) to set a passcode, then visit [http://localhost:3000](http://localhost:3000) to test the guest flow.
