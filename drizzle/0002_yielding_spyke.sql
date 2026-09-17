CREATE TABLE `invites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`createdBy` int NOT NULL,
	`expiresAt` timestamp,
	`uses` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `invites_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `messageReactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`userId` int NOT NULL,
	`emoji` varchar(16) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messageReactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moderationActions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`moderatorId` int NOT NULL,
	`targetUserId` int,
	`messageId` int,
	`action` varchar(32) NOT NULL,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moderationActions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `serverMembers` ADD `role` enum('owner','moderator','member') DEFAULT 'member' NOT NULL;--> statement-breakpoint
CREATE INDEX `invites_server_idx` ON `invites` (`serverId`);--> statement-breakpoint
CREATE INDEX `reactions_message_idx` ON `messageReactions` (`messageId`);--> statement-breakpoint
CREATE INDEX `reactions_user_idx` ON `messageReactions` (`userId`);--> statement-breakpoint
CREATE INDEX `moderation_server_idx` ON `moderationActions` (`serverId`);