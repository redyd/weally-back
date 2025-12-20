import { IsInt, IsPositive } from 'class-validator';

export class JoinFamilyDto{
  @IsInt()
  @IsPositive()
  newFamilyId: number;
}
