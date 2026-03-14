/*
  Warnings:

  - You are about to drop the column `creatorId` on the `families` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FamilyRole" AS ENUM ('CREATOR', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "families" DROP CONSTRAINT "families_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_familyId_fkey";

-- AlterTable
ALTER TABLE "families" DROP COLUMN "creatorId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "familyId";

-- CreateTable
CREATE TABLE "FamilyMember" (
    "familyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "FamilyRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("familyId","userId")
);

-- CreateTable
CREATE TABLE "FamilyInvitation" (
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "familyId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "usedBy" TEXT,

    CONSTRAINT "FamilyInvitation_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_userId_key" ON "FamilyMember"("userId");

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_usedBy_fkey" FOREIGN KEY ("usedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
