/*
  Warnings:

  - You are about to drop the column `userId` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `blockchainType` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `collectionId` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `multimediaFile` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `tokenId` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `nfts` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `facebookLink` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `instagramLink` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `linkedInLink` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `mainLink` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twitterLink` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token_id]` on the table `nfts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockchain_type` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collection_id` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `erc_type` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_url` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_id` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('COLLECTIBLE', 'PRODUCT_KEY_REAL_LIFE_ASSET', 'PRODUCT_KEY_VIRTUAL_ASSET');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ABSTRACT', 'PIXEL', 'CARTOON', 'CLASSIC', 'COMPUTER_GRAPHIC', 'VIDEO_GAME', 'SCENERY', 'PERFORMANCE', 'PHOTOGRAPHY', 'ACHITECTURE', 'MUSIC', 'MEME', 'DOMAIN_NAME', 'SPORTS_CARD', 'TRADING_CARD', 'CLOTHING_WEARABLE', 'BEAUTY_ACCESSORY', 'TOOL_EQUIPMENT', 'MATERIAL_MACHINE_PART', 'ELECTRONIC_APPLIANCE', 'GROCERY_FOOD', 'WEAPON', 'FURNITURE', 'REAL_ESTATE', 'TOY_GAME', 'HOME_SUPPLY', 'MEDICAL_MAGIC_ITEM');

-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_userId_fkey";

-- DropForeignKey
ALTER TABLE "nfts" DROP CONSTRAINT "nfts_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "nfts" DROP CONSTRAINT "nfts_userId_fkey";

-- DropIndex
DROP INDEX "nfts_tokenId_key";

-- DropIndex
DROP INDEX "users_userName_key";

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "blockchainType",
DROP COLUMN "collectionId",
DROP COLUMN "fileUrl",
DROP COLUMN "multimediaFile",
DROP COLUMN "tokenId",
DROP COLUMN "userId",
ADD COLUMN     "blockchain_type" TEXT NOT NULL,
ADD COLUMN     "category" "Category" NOT NULL DEFAULT E'ABSTRACT',
ADD COLUMN     "collection_id" INTEGER NOT NULL,
ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "end_sale_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "erc_type" TEXT NOT NULL,
ADD COLUMN     "file_url" TEXT NOT NULL,
ADD COLUMN     "is_metadata_frozen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_on_sale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_sensitive_content" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "multimedia_file" JSONB,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "properties" JSONB,
ADD COLUMN     "reviews" JSONB,
ADD COLUMN     "sale_type" "SaleType" NOT NULL DEFAULT E'COLLECTIBLE',
ADD COLUMN     "token_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "companyName",
DROP COLUMN "facebookLink",
DROP COLUMN "instagramLink",
DROP COLUMN "linkedInLink",
DROP COLUMN "mainLink",
DROP COLUMN "twitterLink",
DROP COLUMN "userName",
ADD COLUMN     "company_name" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "facebook_link" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "instagram_link" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "linked_in_link" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "main_link" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "twitter_link" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "user_name" TEXT NOT NULL,
ADD COLUMN     "verification_date" TIMESTAMP(3),
ADD COLUMN     "verification_link" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" SET DEFAULT E'',
ALTER COLUMN "description" SET DEFAULT E'';

-- CreateIndex
CREATE UNIQUE INDEX "nfts_token_id_key" ON "nfts"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
