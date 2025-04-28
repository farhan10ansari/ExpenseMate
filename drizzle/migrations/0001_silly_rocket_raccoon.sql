ALTER TABLE `expenses` ADD `date_time` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `description` text;--> statement-breakpoint
ALTER TABLE `expenses` ADD `payment_method` text NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `expenses` ADD `recurring` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `receipt` text;--> statement-breakpoint
ALTER TABLE `expenses` ADD `currency` text DEFAULT 'INR' NOT NULL;