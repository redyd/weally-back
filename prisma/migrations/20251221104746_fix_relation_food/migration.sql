/*
  Warnings:

  - You are about to drop the column `foodId` on the `Allergene` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Allergene" DROP CONSTRAINT "Allergene_foodId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_foodId_fkey";

-- AlterTable
ALTER TABLE "Allergene" DROP COLUMN "foodId";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "foodId";

-- CreateTable
CREATE TABLE "FoodTag" (
    "foodId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "FoodTag_pkey" PRIMARY KEY ("foodId","tagId")
);

-- CreateTable
CREATE TABLE "FoodAllergene" (
    "foodId" INTEGER NOT NULL,
    "allergeneId" INTEGER NOT NULL,

    CONSTRAINT "FoodAllergene_pkey" PRIMARY KEY ("foodId","allergeneId")
);

-- CreateIndex
CREATE INDEX "FoodTag_tagId_idx" ON "FoodTag"("tagId");

-- CreateIndex
CREATE INDEX "FoodAllergene_allergeneId_idx" ON "FoodAllergene"("allergeneId");

-- AddForeignKey
ALTER TABLE "FoodTag" ADD CONSTRAINT "FoodTag_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodTag" ADD CONSTRAINT "FoodTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAllergene" ADD CONSTRAINT "FoodAllergene_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAllergene" ADD CONSTRAINT "FoodAllergene_allergeneId_fkey" FOREIGN KEY ("allergeneId") REFERENCES "Allergene"("id") ON DELETE CASCADE ON UPDATE CASCADE;
