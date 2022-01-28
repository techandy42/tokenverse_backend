/*
  Warnings:

  - Changed the type of `blockchain_type` on the `nfts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `erc_type` on the `nfts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BlockchainType" AS ENUM ('POLYGON');

-- CreateEnum
CREATE TYPE "ErcType" AS ENUM ('ERC_721', 'ERC_1155');

-- AlterEnum
ALTER TYPE "CollectibleCategory" ADD VALUE 'EXCLUSIVE';

-- AlterTable
ALTER TABLE "nfts" DROP COLUMN "blockchain_type",
ADD COLUMN     "blockchain_type" "BlockchainType" NOT NULL,
DROP COLUMN "erc_type",
ADD COLUMN     "erc_type" "ErcType" NOT NULL;
