import { Prisma, Role } from '@prisma/client';

type UserWithMember = Prisma.UserGetPayload<{
  include: { member: true };
}>;

export interface UserClient extends Omit<UserWithMember, 'password'> {}

/**
 * Classe représentant l'utilisateur et sa possibilité d'être membre.
 */
export class UserClient {
  constructor(data: UserWithMember) {
    const { password, ...userWithoutPassword } = data;
    Object.assign(this, userWithoutPassword);
  }

  get role(): Role | null {
    return this.member?.role ?? null;
  }

  get familyId(): number | null {
    return this.member?.familyId ?? null;
  }

  basicInfo() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
    };
  }

  strictInfo() {
    return {
      id: this.id,
      email: this.email,
    };
  }

  hasFamily(): boolean {
    return this.role != null && this.familyId != null;
  }

  toJson() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      role: this.role,
      familyId: this.familyId,
      createdAt: this.createdAt,
    };
  }
}
