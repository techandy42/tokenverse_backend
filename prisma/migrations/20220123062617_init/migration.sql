/*
  Warnings:

  - Made the column `name` on table `collections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "name" SET NOT NULL;
