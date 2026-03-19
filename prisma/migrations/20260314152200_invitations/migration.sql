/*
  Warnings:

  - You are about to drop the column `usedAt` on the `families_invitations` table. All the data in the column will be lost.
  - You are about to drop the column `usedBy` on the `families_invitations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "families_invitations" DROP CONSTRAINT "families_invitations_usedBy_fkey";

-- AlterTable
ALTER TABLE "families_invitations" DROP COLUMN "usedAt",
DROP COLUMN "usedBy",
ADD COLUMN     "maxUses" INTEGER;

-- CreateTable
CREATE TABLE "family_invitation_uses" (
    "id" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "usedBy" TEXT NOT NULL,

    CONSTRAINT "family_invitation_uses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "family_invitation_uses_code_usedBy_key" ON "family_invitation_uses"("code", "usedBy");

-- AddForeignKey
ALTER TABLE "family_invitation_uses" ADD CONSTRAINT "family_invitation_uses_code_fkey" FOREIGN KEY ("code") REFERENCES "families_invitations"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_invitation_uses" ADD CONSTRAINT "family_invitation_uses_usedBy_fkey" FOREIGN KEY ("usedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
