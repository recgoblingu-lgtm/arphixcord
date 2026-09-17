CREATE TABLE `directMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `directMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voiceParticipants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`cameraOn` int NOT NULL DEFAULT 0,
	`micOn` int NOT NULL DEFAULT 1,
	`screenSharing` int NOT NULL DEFAULT 0,
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voiceParticipants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voiceRooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`channelId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voiceRooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` varchar(512);--> statement-breakpoint
CREATE INDEX `dm_sender_idx` ON `directMessages` (`senderId`);--> statement-breakpoint
CREATE INDEX `dm_recipient_idx` ON `directMessages` (`recipientId`);--> statement-breakpoint
CREATE INDEX `voice_participants_room_idx` ON `voiceParticipants` (`roomId`);--> statement-breakpoint
CREATE INDEX `voice_participants_user_idx` ON `voiceParticipants` (`userId`);--> statement-breakpoint
CREATE INDEX `voice_room_channel_idx` ON `voiceRooms` (`channelId`);