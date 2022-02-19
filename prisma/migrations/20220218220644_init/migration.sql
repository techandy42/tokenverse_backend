/*
  Warnings:

  - You are about to drop the column `nft_id` on the `Review` table. All the data in the column will be lost.
  - Added the required column `nft_token_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_nft_id_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "nft_id",
ADD COLUMN     "nft_token_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_nft_token_id_fkey" FOREIGN KEY ("nft_token_id") REFERENCES "nfts"("token_id") ON DELETE CASCADE ON UPDATE CASCADE;
