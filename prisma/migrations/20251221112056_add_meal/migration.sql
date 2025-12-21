/*
  Warnings:

  - You are about to drop the column `userId` on the `Food` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_userId_fkey";

-- DropForeignKey
ALTER TABLE "FoodAllergene" DROP CONSTRAINT "FoodAllergene_allergeneId_fkey";

-- DropForeignKey
ALTER TABLE "FoodFamily" DROP CONSTRAINT "FoodFamily_foodId_fkey";

-- DropForeignKey
ALTER TABLE "FoodTag" DROP CONSTRAINT "FoodTag_tagId_fkey";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "userId",
ADD COLUMN     "creatorId" INTEGER;

-- CreateTable
CREATE TABLE "Meal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "creatorId" INTEGER,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodTag" ADD CONSTRAINT "FoodTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAllergene" ADD CONSTRAINT "FoodAllergene_allergeneId_fkey" FOREIGN KEY ("allergeneId") REFERENCES "Allergene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodFamily" ADD CONSTRAINT "FoodFamily_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;
