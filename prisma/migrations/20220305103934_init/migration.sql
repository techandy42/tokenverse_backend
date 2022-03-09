/*
  Warnings:

  - You are about to drop the column `cartNfts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `likedNfts` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "cartNfts",
DROP COLUMN "likedNfts",
ADD COLUMN     "cart_nfts" INTEGER[],
ADD COLUMN     "liked_nfts" INTEGER[];
