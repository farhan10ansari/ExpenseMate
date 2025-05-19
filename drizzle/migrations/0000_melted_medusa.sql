CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`date_time` integer NOT NULL,
	`description` text,
	`payment_method` text,
	`category` text NOT NULL,
	`recurring` integer DEFAULT false NOT NULL,
	`receipt` text,
	`currency` text DEFAULT 'INR' NOT NULL
);
