-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "image" JSONB;
