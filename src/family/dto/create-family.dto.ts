import { IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateFamilyDto implements Prisma.FamilyCreateInput{
  @IsNotEmpty()
  @IsString()
  name: string;
}
