import {Prisma, Meal, MealType} from '@prisma/client';

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
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        },
    },
} satisfies Prisma.FamilyDefaultArgs;

export type FamilyWithMembers = Prisma.FamilyGetPayload<typeof familySelect>;

export const userFamilySelect = {
    select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        family: {
            select: {
                role: true,
                family: {
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
                                        id: true,
                                        name: true,
                                        image: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} satisfies Prisma.UserDefaultArgs;

export type UserAndFamilyWithMembers = Prisma.UserGetPayload<typeof userFamilySelect>

// OTHER

// confirmation


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