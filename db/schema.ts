import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const waitlistEntries = sqliteTable(
  "waitlist_entries",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    status: text("status").notNull().default("subscribed"),
    placement: text("placement"),
    source: text("source"),
    medium: text("medium"),
    campaign: text("campaign"),
    consentedAt: integer("consented_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [uniqueIndex("idx_waitlist_entries_email").on(table.email)],
);
