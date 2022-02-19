/*
  Warnings:

  - The values [CLOTHING_WEARABLE,BEAUTY_ACCESSORY,TOOL_EQUIPMENT,MATERIAL_MACHINE_PART,ELECTRONIC_APPLIANCE,GROCERY_FOOD,WEAPON,FURNITURE,REAL_ESTATE,TOY_GAME,HOME_SUPPLY,MEDICAL_MAGIC_ITEM] on the enum `ProductKeyAccessTokenCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductKeyAccessTokenCategory_new" AS ENUM ('MISCELLANEOUS');
ALTER TABLE "nfts" ALTER COLUMN "product_key_access_token_category" DROP DEFAULT;
ALTER TABLE "nfts" ALTER COLUMN "product_key_access_token_category" TYPE "ProductKeyAccessTokenCategory_new" USING ("product_key_access_token_category"::text::"ProductKeyAccessTokenCategory_new");
ALTER TYPE "ProductKeyAccessTokenCategory" RENAME TO "ProductKeyAccessTokenCategory_old";
ALTER TYPE "ProductKeyAccessTokenCategory_new" RENAME TO "ProductKeyAccessTokenCategory";
DROP TYPE "ProductKeyAccessTokenCategory_old";
ALTER TABLE "nfts" ALTER COLUMN "product_key_access_token_category" SET DEFAULT 'MISCELLANEOUS';
COMMIT;
