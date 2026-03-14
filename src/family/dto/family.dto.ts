import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateFamilyDto {
    @IsString()
    @IsNotEmpty({ message: 'Le nom de la family est requis' })
    @MaxLength(100)
    name: string;
}