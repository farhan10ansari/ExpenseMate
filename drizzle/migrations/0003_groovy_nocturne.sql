CREATE TABLE `expense_categories` (
	`name` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`deletable` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `income_sources` (
	`name` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`deletable` integer DEFAULT true NOT NULL
);
