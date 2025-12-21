/*
  Warnings:

  - Added the required column `name` to the `Family` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "name" TEXT NOT NULL;
