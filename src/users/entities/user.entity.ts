import { Role } from './UserTypes';

export class UserClient {
  private readonly id: number;
  private readonly email: string;
  private readonly username: string;
  private readonly created_at: Date;

  private readonly role: Role | null;
  private readonly familyId: number | null;

  constructor(data: {
    id: number;
    email: string;
    username: string;
    createdAt: Date;
    member?: { role: Role; familyId: number } | null;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.created_at = data.createdAt;
    this.role = data.member?.role ?? null;
    this.familyId = data.member?.familyId ?? null;
  }

  basicInfo() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
    }
  }

  strictInfo() {
    return {
      id: this.id,
      email: this.email,
    };
  }

  hasFamily(): boolean {
    return this.role != null || this.familyId != null;
  }
}
