/*
  Warnings:

  - You are about to drop the column `multimedia_file` on the `nfts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "image" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "multimedia_file",
ADD COLUMN     "multimedia_file_url" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "image" SET DATA TYPE TEXT;
