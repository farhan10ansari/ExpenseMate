CREATE TABLE `incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`date_time` integer NOT NULL,
	`description` text,
	`source` text NOT NULL,
	`recurring` integer DEFAULT false NOT NULL,
	`receipt` text,
	`currency` text DEFAULT 'INR' NOT NULL,
	`is_trashed` integer DEFAULT false NOT NULL
);
