CREATE TABLE `categories` (
	`name` text NOT NULL,
	`label` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`isCustom` integer DEFAULT true NOT NULL,
	`type` text NOT NULL,
	PRIMARY KEY(`name`, `type`)
);
