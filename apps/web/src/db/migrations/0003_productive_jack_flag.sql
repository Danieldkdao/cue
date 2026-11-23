PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_snippets` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`body` text NOT NULL,
	`language` text,
	`use_case` text DEFAULT '',
	`tags` text DEFAULT '[]' NOT NULL,
	`pinned` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_snippets`("id", "kind", "name", "body", "language", "use_case", "tags", "pinned", "created_at", "updated_at") SELECT "id", "kind", "name", "body", "language", "use_case", "tags", "pinned", "created_at", "updated_at" FROM `snippets`;--> statement-breakpoint
DROP TABLE `snippets`;--> statement-breakpoint
ALTER TABLE `__new_snippets` RENAME TO `snippets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;