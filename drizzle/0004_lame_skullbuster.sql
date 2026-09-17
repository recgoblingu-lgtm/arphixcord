CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(40) NOT NULL,
	`title` varchar(160) NOT NULL,
	`body` text NOT NULL,
	`link` varchar(255),
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voiceSignals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`type` varchar(16) NOT NULL,
	`payload` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voiceSignals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `directMessages` ADD `attachmentUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `directMessages` ADD `attachmentName` varchar(255);--> statement-breakpoint
ALTER TABLE `directMessages` ADD `attachmentType` varchar(120);--> statement-breakpoint
ALTER TABLE `directMessages` ADD `attachmentSize` int;--> statement-breakpoint
ALTER TABLE `messages` ADD `attachmentUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `messages` ADD `attachmentName` varchar(255);--> statement-breakpoint
ALTER TABLE `messages` ADD `attachmentType` varchar(120);--> statement-breakpoint
ALTER TABLE `messages` ADD `attachmentSize` int;--> statement-breakpoint
CREATE INDEX `notifications_user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `voice_signals_recipient_idx` ON `voiceSignals` (`recipientId`);--> statement-breakpoint
CREATE INDEX `voice_signals_room_idx` ON `voiceSignals` (`roomId`);