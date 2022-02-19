/*
  Warnings:

  - You are about to drop the column `product_key_real_life_asset_category` on the `nfts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "product_key_real_life_asset_category",
ADD COLUMN     "product_key_access_token_category" "ProductKeyAccessTokenCategory" NOT NULL DEFAULT E'MISCELLANEOUS';
