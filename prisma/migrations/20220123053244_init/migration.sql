/*
  Warnings:

  - You are about to drop the column `collectibleCategory` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `productKeyRealLifeAssetCategory` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `productKeyVirtualAssetCategory` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `usersRefunded` on the `nfts` table. All the data in the column will be lost.
  - Added the required column `borrower_id` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "collectibleCategory",
DROP COLUMN "owner",
DROP COLUMN "productKeyRealLifeAssetCategory",
DROP COLUMN "productKeyVirtualAssetCategory",
DROP COLUMN "usersRefunded",
ADD COLUMN     "borrower_id" INTEGER NOT NULL,
ADD COLUMN     "collectible_category" "CollectibleCategory" NOT NULL DEFAULT E'MISCELLANEOUS',
ADD COLUMN     "end_lease_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "product_key_real_life_asset_category" "ProductKeyRealLifeAssetCategory" NOT NULL DEFAULT E'MISCELLANEOUS',
ADD COLUMN     "product_key_virtual_asset_category" "ProductKeyVirtualAssetCategory" NOT NULL DEFAULT E'MISCELLANEOUS',
ADD COLUMN     "start_lease_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "users_refunded" TEXT[];

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
