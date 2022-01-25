/*
  Warnings:

  - A unique constraint covering the columns `[item_id]` on the table `nfts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `item_id` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfts" ADD COLUMN     "item_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "nfts_item_id_key" ON "nfts"("item_id");
