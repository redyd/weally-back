import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMealDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    label: string;

    @IsString()
    @IsNotEmpty()
    familyId: string;
}

export class UpdateMealDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    label: string;
}