/*
  Warnings:

  - You are about to drop the column `previousPrice` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `previous_purchase_date` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `users_refunded` on the `nfts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "previousPrice",
DROP COLUMN "previous_purchase_date",
DROP COLUMN "users_refunded";
