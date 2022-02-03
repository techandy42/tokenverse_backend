/*
  Warnings:

  - You are about to drop the column `like` on the `nfts` table. All the data in the column will be lost.
  - Added the required column `cart_id` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liked_id` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "like",
ADD COLUMN     "cart_id" INTEGER NOT NULL,
ADD COLUMN     "liked_id" INTEGER NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_liked_id_fkey" FOREIGN KEY ("liked_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
