-- AlterTable
ALTER TABLE "nfts" ADD COLUMN     "previousPrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "previous_purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
