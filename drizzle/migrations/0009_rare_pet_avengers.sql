ALTER TABLE `categories` ADD `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE `incomes` ADD `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE `incomes` ADD `updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;