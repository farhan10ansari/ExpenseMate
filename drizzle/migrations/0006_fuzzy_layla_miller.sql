CREATE TABLE `categories` (
	`name` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`isCustom` integer DEFAULT true NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `expense_categories`;--> statement-breakpoint
DROP TABLE `income_sources`;