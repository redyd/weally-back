export type Role = 'CHEF' | 'MEMBER';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}