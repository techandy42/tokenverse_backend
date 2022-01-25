/*
  Warnings:

  - You are about to drop the column `category` on the `nfts` table. All the data in the column will be lost.
  - Added the required column `owner` to the `nfts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollectibleCategory" AS ENUM ('MISCELLANEOUS', 'ABSTRACT', 'PIXEL', 'CARTOON', 'CLASSIC', 'COMPUTER_GRAPHIC', 'VIDEO_GAME', 'SCENERY', 'PERFORMANCE', 'PHOTOGRAPHY', 'ACHITECTURE', 'MUSIC', 'MEME', 'DOMAIN_NAME', 'SPORTS_CARD', 'TRADING_CARD');

-- CreateEnum
CREATE TYPE "ProductKeyRealLifeAssetCategory" AS ENUM ('MISCELLANEOUS', 'CLOTHING_WEARABLE', 'BEAUTY_ACCESSORY', 'TOOL_EQUIPMENT', 'MATERIAL_MACHINE_PART', 'ELECTRONIC_APPLIANCE', 'GROCERY_FOOD', 'WEAPON', 'FURNITURE', 'REAL_ESTATE', 'TOY_GAME', 'HOME_SUPPLY', 'MEDICAL_MAGIC_ITEM');

-- CreateEnum
CREATE TYPE "ProductKeyVirtualAssetCategory" AS ENUM ('MISCELLANEOUS', 'CLOTHING_WEARABLE', 'BEAUTY_ACCESSORY', 'TOOL_EQUIPMENT', 'MATERIAL_MACHINE_PART', 'ELECTRONIC_APPLIANCE', 'GROCERY_FOOD', 'WEAPON', 'FURNITURE', 'REAL_ESTATE', 'TOY_GAME', 'HOME_SUPPLY', 'MEDICAL_MAGIC_ITEM');

-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "category",
ADD COLUMN     "collectibleCategory" "CollectibleCategory" NOT NULL DEFAULT E'MISCELLANEOUS',
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "productKeyRealLifeAssetCategory" "ProductKeyRealLifeAssetCategory" NOT NULL DEFAULT E'MISCELLANEOUS',
ADD COLUMN     "productKeyVirtualAssetCategory" "ProductKeyVirtualAssetCategory" NOT NULL DEFAULT E'MISCELLANEOUS',
ADD COLUMN     "usersRefunded" TEXT[];

-- DropEnum
DROP TYPE "Category";
