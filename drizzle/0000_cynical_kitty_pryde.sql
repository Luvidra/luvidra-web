CREATE TABLE `waitlist_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'subscribed' NOT NULL,
	`placement` text,
	`source` text,
	`medium` text,
	`campaign` text,
	`consented_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_waitlist_entries_email` ON `waitlist_entries` (`email`);