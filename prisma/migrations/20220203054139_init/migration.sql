-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "address" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "comment" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;
