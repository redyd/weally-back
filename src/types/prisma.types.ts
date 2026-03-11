// src/types/prisma.types.ts
import { Prisma, Meal } from '@prisma/client';

// ─── User ─────────────────────────────────────────────────────────────────────

// Profil de base — sans données sensibles ni relations BetterAuth internes
export type SafeUser = Prisma.UserGetPayload<{
    select: {
        id: true;
        email: true;
        name: true;
        emailVerified: true;
        image: true;
        familyId: true;
        createdAt: true;
        updatedAt: true;
    };
}>;

// Profil avec sa famille
export type UserWithFamily = Prisma.UserGetPayload<{
    select: {
        id: true;
        email: true;
        name: true;
        emailVerified: true;
        image: true;
        familyId: true;
        createdAt: true;
        updatedAt: true;
        family: { select: { id: true; name: true } };
    };
}>;

// ─── Family ───────────────────────────────────────────────────────────────────

// Famille seule
export type SafeFamily = Prisma.FamilyGetPayload<{
    select: {
        id: true;
        name: true;
        createdAt: true;
        updatedAt: true;
        creatorId: true;
    };
}>;

// Famille avec ses membres et créateur (vue détaillée)
export type FamilyWithMembers = Prisma.FamilyGetPayload<{
    select: {
        id: true;
        name: true;
        createdAt: true;
        updatedAt: true;
        creatorId: true;
        creator: {
            select: { id: true; name: true; email: true };
        };
        members: {
            select: { id: true; name: true; email: true; image: true };
        };
    };
}>;

// Famille avec repas
export type FamilyWithMeals = Prisma.FamilyGetPayload<{
    select: {
        id: true;
        name: true;
        createdAt: true;
        updatedAt: true;
        creatorId: true;
        meals: true;
    };
}>;

// ─── Meal ─────────────────────────────────────────────────────────────────────

// Repas seul — le modèle est simple, pas de champs sensibles
export type SafeMeal = Meal;

// Repas avec sa famille
export type MealWithFamily = Prisma.MealGetPayload<{
    include: {
        family: {
            select: { id: true; name: true };
        };
    };
}>;