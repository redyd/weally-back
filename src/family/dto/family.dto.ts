import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateFamilyDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la family est requis' })
  @MaxLength(100)
  name: string;
}

export class UpdateFamilyDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}

export class JoinFamilyDto {
  @IsString()
  @IsNotEmpty()
  familyId: string;
}
