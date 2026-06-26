ALTER TABLE `user`
  ADD COLUMN `mobile` VARCHAR(15) NULL,
  ADD COLUMN `district` VARCHAR(191) NULL,
  ADD COLUMN `state` VARCHAR(191) NULL,
  ADD COLUMN `pin` VARCHAR(255) NULL;

CREATE UNIQUE INDEX `user_mobile_key` ON `user`(`mobile`);

CREATE TABLE `user_device_mappings` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `deviceId` VARCHAR(191) NOT NULL,
  `friendlyName` VARCHAR(191) NULL,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `mappedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `user_device_mappings_userId_active_idx`
  ON `user_device_mappings`(`userId`, `active`);

CREATE INDEX `user_device_mappings_deviceId_active_idx`
  ON `user_device_mappings`(`deviceId`, `active`);

ALTER TABLE `user_device_mappings`
  ADD CONSTRAINT `user_device_mappings_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_device_mappings_deviceId_fkey`
    FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
