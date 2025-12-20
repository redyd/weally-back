import { Family } from '@prisma/client';

export interface FamilyClient extends Family {}

export class FamilyClient {
  constructor(data: Family) {
    Object.assign(this, data);
  }
}
