/*
  Warnings:

  - You are about to drop the column `cart_id` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `liked_id` on the `nfts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "nfts" DROP CONSTRAINT "nfts_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "nfts" DROP CONSTRAINT "nfts_liked_id_fkey";

-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "cart_id",
DROP COLUMN "liked_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cartNfts" INTEGER[],
ADD COLUMN     "likedNfts" INTEGER[];
