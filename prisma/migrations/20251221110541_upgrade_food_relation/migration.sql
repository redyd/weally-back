/*
  Warnings:

  - Added the required column `userId` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FoodFamily" (
    "foodId" INTEGER NOT NULL,
    "familyId" INTEGER NOT NULL,

    CONSTRAINT "FoodFamily_pkey" PRIMARY KEY ("familyId","foodId")
);

-- CreateIndex
CREATE INDEX "FoodFamily_familyId_idx" ON "FoodFamily"("familyId");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodFamily" ADD CONSTRAINT "FoodFamily_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodFamily" ADD CONSTRAINT "FoodFamily_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
