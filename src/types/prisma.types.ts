import {Prisma, Meal, MealType, FamilyRole} from '@prisma/client';

// IN USAGE

// == PLANNING & MEAL RELATED ==
export type MealsPerDay = {
    day: Date;
    meals: {
        id: string;
        label: string;
        description: string | null;
        type: MealType;
    }[];
}

// == FAMILY ==
export const familySelect = {
    select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        familyMembers: {
            select: {
                role: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        },
    },
} satisfies Prisma.FamilyDefaultArgs;

export type FamilyWithMembers = Prisma.FamilyGetPayload<typeof familySelect>;

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
        family: {}
    };
}>;

// OTHER

// confirmation
export type Confirmation = {
    message: string;
    status: 'ok' | 'error';
}

// ─── Family ───────────────────────────────────────────────────────────────────

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