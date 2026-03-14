import {Prisma, Meal, MealType} from '@prisma/client';

// confirmation
export type Confirmation = {
    message: string;
    status: 'ok' | 'error';
}

// ─── User ─────────────────────────────────────────────────────────────────────

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
        family: {
            select: {
                id: true;
                name: true;
                createdAt: true;
                updatedAt: true;
                creatorId: true;
            }
        };
    };
}>;

// ─── Family ───────────────────────────────────────────────────────────────────

export type SafeFamily = Prisma.FamilyGetPayload<{
    select: {
        id: true;
        name: true;
        createdAt: true;
        updatedAt: true;
        creatorId: true;
    };
}>;

export type FamilyWithMembers = Prisma.FamilyGetPayload<{
    select: {
        id: true;
        name: true;
        createdAt: true;
        updatedAt: true;
        creatorId: true;
        creator: {
            select: { id: true; name: true; email: true, image: true };
        };
        members: {
            select: { id: true; name: true; email: true; image: true };
        };
    };
}>;

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

export type SafeMeal = Meal;

export type MealWithFamily = Prisma.MealGetPayload<{
    include: {
        family: {
            select: { id: true; name: true };
        };
    };
}>;

// planning
export type MealsPerDay = {
    day: Date;
    meals: {
        id: string;
        label: string;
        description: string | null;
        type: MealType;
    }[];
}