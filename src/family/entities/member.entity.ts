import { Member } from '@prisma/client';

export interface MemberClient extends Member {}

export class MemberClient {
  constructor(data: Member) {
    Object.assign(this, data);
  }
}
