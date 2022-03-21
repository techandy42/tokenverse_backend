/*
  Warnings:

  - You are about to drop the column `file_url` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `imagesKey` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `imagesValue` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `levelsKey` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `levelsValueDen` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `levelsValueNum` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `multimedia_file_url` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `propertiesKey` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `propertiesValue` on the `nfts` table. All the data in the column will be lost.
  - Added the required column `image` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "file_url",
DROP COLUMN "imagesKey",
DROP COLUMN "imagesValue",
DROP COLUMN "levelsKey",
DROP COLUMN "levelsValueDen",
DROP COLUMN "levelsValueNum",
DROP COLUMN "multimedia_file_url",
DROP COLUMN "propertiesKey",
DROP COLUMN "propertiesValue",
ADD COLUMN     "animation_url" TEXT,
ADD COLUMN     "attributes" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "external_url" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "youtube_url" TEXT NOT NULL DEFAULT E'';
