/*
  Warnings:

  - You are about to drop the column `borrower_id` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `end_lease_date` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `priceLease` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `properties` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `start_lease_date` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `verification_link` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "nfts" DROP CONSTRAINT "nfts_borrower_id_fkey";

-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "borrower_id",
DROP COLUMN "end_lease_date",
DROP COLUMN "priceLease",
DROP COLUMN "properties",
DROP COLUMN "reviews",
DROP COLUMN "start_lease_date",
ADD COLUMN     "descriptions" TEXT[],
ADD COLUMN     "imagesKey" TEXT[],
ADD COLUMN     "imagesValue" TEXT[],
ADD COLUMN     "is_on_auction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "levelsKey" TEXT[],
ADD COLUMN     "levelsValueDen" INTEGER[],
ADD COLUMN     "levelsValueNum" INTEGER[],
ADD COLUMN     "propertiesKey" TEXT[],
ADD COLUMN     "propertiesValue" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verification_link";

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "nft_id" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_uuid_key" ON "Review"("uuid");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
