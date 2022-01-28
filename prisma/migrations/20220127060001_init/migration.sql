/*
  Warnings:

  - You are about to drop the column `creator` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `creator` on the `nfts` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" DROP COLUMN "creator";

-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "creator",
ADD COLUMN     "creator_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
