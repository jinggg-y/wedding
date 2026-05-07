import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Remove any previously seeded test contacts (identified by group prefix "Test:")
  await prisma.contact.deleteMany({ where: { group: { startsWith: "Test:" } } });

  // ── Create contacts ──────────────────────────────────────

  const contacts = await Promise.all([
    // 1. All events, all attending, dietary note
    prisma.contact.create({ data: {
      firstName: "James", lastName: "Wilson",
      phone: "+61 400 111 001", email: "james.wilson@example.com",
      group: "Test: Family", invitedEvents: ["ceremony", "reception", "party"],
    }}),
    // 2. All events, mixed (attending some, declining others), with notes
    prisma.contact.create({ data: {
      firstName: "Sarah", lastName: "Chen",
      phone: "+61 400 111 002", email: "sarah.chen@example.com",
      group: "Test: Friends", invitedEvents: ["ceremony", "reception", "party"],
    }}),
    // 3. All events, fully declined
    prisma.contact.create({ data: {
      firstName: "Michael", lastName: "Brown",
      phone: "+61 400 111 003", email: "michael.brown@example.com",
      group: "Test: Work", invitedEvents: ["ceremony", "reception", "party"],
    }}),
    // 4. All events, pending (no RSVP submitted)
    prisma.contact.create({ data: {
      firstName: "Emma", lastName: "Thompson",
      phone: "+61 400 111 004", email: "emma.thompson@example.com",
      group: "Test: Family", invitedEvents: ["ceremony", "reception", "party"],
    }}),
    // 5. Ceremony + reception only, attending both, vegan
    prisma.contact.create({ data: {
      firstName: "David", lastName: "Kim",
      phone: "+61 400 111 005", email: "david.kim@example.com",
      group: "Test: Friends", invitedEvents: ["ceremony", "reception"],
    }}),
    // 6. Ceremony only, attending, vegetarian
    prisma.contact.create({ data: {
      firstName: "Priya", lastName: "Patel",
      phone: "+61 400 111 006", email: "priya.patel@example.com",
      group: "Test: Friends", invitedEvents: ["ceremony"],
    }}),
    // 7. Ceremony only, declined
    prisma.contact.create({ data: {
      firstName: "Tom", lastName: "Davis",
      phone: "+61 400 111 007", email: "tom.davis@example.com",
      group: "Test: Work", invitedEvents: ["ceremony"],
    }}),
    // 8. Reception + after party only, attending, nut allergy, with notes
    prisma.contact.create({ data: {
      firstName: "Lisa", lastName: "Nguyen",
      phone: "+61 400 111 008", email: "lisa.nguyen@example.com",
      group: "Test: Friends", invitedEvents: ["reception", "party"],
    }}),
    // 9. All events, partially responded (ceremony yes, rest pending)
    prisma.contact.create({ data: {
      firstName: "Alex", lastName: "Johnson",
      phone: "+61 400 111 009", email: "alex.johnson@example.com",
      group: "Test: Family", invitedEvents: ["ceremony", "reception", "party"],
    }}),
    // 10. Contact with no events assigned yet (admin hasn't set it up)
    prisma.contact.create({ data: {
      firstName: "Sophie", lastName: "Martinez",
      phone: "+61 400 111 010", email: "sophie.martinez@example.com",
      group: "Test: Work", invitedEvents: [],
    }}),
  ]);

  const [james, sarah, michael, , david, priya, tom, lisa, alex] = contacts;

  // ── Create RSVPs ─────────────────────────────────────────

  // James: all events, all attending, gluten free
  await Promise.all([
    prisma.rsvp.create({ data: { contactId: james.id, event: "ceremony",  attending: true,  dietary: "Gluten free" } }),
    prisma.rsvp.create({ data: { contactId: james.id, event: "reception", attending: true,  dietary: "Gluten free" } }),
    prisma.rsvp.create({ data: { contactId: james.id, event: "party",     attending: true,  dietary: null } }),
  ]);

  // Sarah: mixed — ceremony yes, reception yes, party no; with notes
  await Promise.all([
    prisma.rsvp.create({ data: { contactId: sarah.id, event: "ceremony",  attending: true,  dietary: null, notes: "Looking forward to it! We'll be flying in from Sydney." } }),
    prisma.rsvp.create({ data: { contactId: sarah.id, event: "reception", attending: true,  dietary: null } }),
    prisma.rsvp.create({ data: { contactId: sarah.id, event: "party",     attending: false, dietary: null } }),
  ]);

  // Michael: all declined, with notes
  await Promise.all([
    prisma.rsvp.create({ data: { contactId: michael.id, event: "ceremony",  attending: false, dietary: null, notes: "So sorry we can't make it — we'll be overseas." } }),
    prisma.rsvp.create({ data: { contactId: michael.id, event: "reception", attending: false, dietary: null } }),
    prisma.rsvp.create({ data: { contactId: michael.id, event: "party",     attending: false, dietary: null } }),
  ]);

  // Emma: no RSVP (pending) — nothing to insert

  // David: ceremony + reception only, both attending, vegan
  await Promise.all([
    prisma.rsvp.create({ data: { contactId: david.id, event: "ceremony",  attending: true, dietary: "Vegan" } }),
    prisma.rsvp.create({ data: { contactId: david.id, event: "reception", attending: true, dietary: "Vegan" } }),
  ]);

  // Priya: ceremony only, attending, vegetarian
  await prisma.rsvp.create({ data: { contactId: priya.id, event: "ceremony", attending: true, dietary: "Vegetarian" } });

  // Tom: ceremony only, declined
  await prisma.rsvp.create({ data: { contactId: tom.id, event: "ceremony", attending: false, dietary: null } });

  // Lisa: reception + party, both attending, nut allergy, notes
  await Promise.all([
    prisma.rsvp.create({ data: { contactId: lisa.id, event: "reception", attending: true,  dietary: "Nut allergy", notes: "Please ensure no nuts in any dishes — severe allergy." } }),
    prisma.rsvp.create({ data: { contactId: lisa.id, event: "party",     attending: true,  dietary: null } }),
  ]);

  // Alex: partial — only ceremony submitted so far, rest pending
  await prisma.rsvp.create({ data: { contactId: alex.id, event: "ceremony", attending: true, dietary: null } });

  console.log(`✓ Created ${contacts.length} test contacts with RSVPs`);
  console.log("  Scenarios covered:");
  console.log("  James Wilson    — all events, all attending (gluten free)");
  console.log("  Sarah Chen      — all events, mixed yes/yes/no, with notes");
  console.log("  Michael Brown   — all events, all declined, with notes");
  console.log("  Emma Thompson   — all events, no response yet (pending)");
  console.log("  David Kim       — ceremony + reception only, attending, vegan");
  console.log("  Priya Patel     — ceremony only, attending, vegetarian");
  console.log("  Tom Davis       — ceremony only, declined");
  console.log("  Lisa Nguyen     — reception + party, attending, nut allergy");
  console.log("  Alex Johnson    — all events, partial response (ceremony only)");
  console.log("  Sophie Martinez — no events assigned yet");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
