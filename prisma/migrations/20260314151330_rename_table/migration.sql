/*
  Warnings:

  - You are about to drop the `FamilyInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FamilyMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FamilyInvitation" DROP CONSTRAINT "FamilyInvitation_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "FamilyInvitation" DROP CONSTRAINT "FamilyInvitation_familyId_fkey";

-- DropForeignKey
ALTER TABLE "FamilyInvitation" DROP CONSTRAINT "FamilyInvitation_usedBy_fkey";

-- DropForeignKey
ALTER TABLE "FamilyMember" DROP CONSTRAINT "FamilyMember_familyId_fkey";

-- DropForeignKey
ALTER TABLE "FamilyMember" DROP CONSTRAINT "FamilyMember_userId_fkey";

-- DropTable
DROP TABLE "FamilyInvitation";

-- DropTable
DROP TABLE "FamilyMember";

-- CreateTable
CREATE TABLE "families_members" (
    "familyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "FamilyRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "families_members_pkey" PRIMARY KEY ("familyId","userId")
);

-- CreateTable
CREATE TABLE "families_invitations" (
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "familyId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "usedBy" TEXT,

    CONSTRAINT "families_invitations_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "families_members_userId_key" ON "families_members"("userId");

-- AddForeignKey
ALTER TABLE "families_members" ADD CONSTRAINT "families_members_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "families_members" ADD CONSTRAINT "families_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "families_invitations" ADD CONSTRAINT "families_invitations_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "families_invitations" ADD CONSTRAINT "families_invitations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "families_invitations" ADD CONSTRAINT "families_invitations_usedBy_fkey" FOREIGN KEY ("usedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
