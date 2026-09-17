CREATE TABLE `channels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`name` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `channels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channelId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serverMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `serverMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `servers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`icon` varchar(4) NOT NULL DEFAULT 'A',
	`ownerId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `servers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `channels_server_idx` ON `channels` (`serverId`);--> statement-breakpoint
CREATE INDEX `messages_channel_idx` ON `messages` (`channelId`);--> statement-breakpoint
CREATE INDEX `messages_author_idx` ON `messages` (`userId`);--> statement-breakpoint
CREATE INDEX `server_members_server_idx` ON `serverMembers` (`serverId`);--> statement-breakpoint
CREATE INDEX `server_members_user_idx` ON `serverMembers` (`userId`);--> statement-breakpoint
CREATE INDEX `servers_owner_idx` ON `servers` (`ownerId`);