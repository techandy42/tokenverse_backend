/*
  Warnings:

  - Added the required column `creator` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "creator" TEXT NOT NULL;
