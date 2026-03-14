// == MEAL ==
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export type MealsPerDay = {
    day: Date;
    meals: {
        id: string;
        label: string;
        description: string | null;
        type: MealType;
    }[];
}

export type FamilyWithMeals = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    meals: MealsPerDay[];
};

// == FAMILY ==

export type FamilyRole = 'CREATOR' | 'ADMIN' | 'MEMBER';

export type Member = {
    id: string;
    name: string;
    image: string | null;
    role: FamilyRole;
}

export type Family = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    familyMembers: Member[];
};

export type Invitation = {
    familyId: string;
    maxUses: number | null;
    code: string;
    expiresAt: Date;
    createdBy: string;
}

// == USER ==

export type User = {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    family: Family | null;
};