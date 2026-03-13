-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateTable
CREATE TABLE "plannings" (
    "id" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mealId" TEXT NOT NULL,

    CONSTRAINT "plannings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
