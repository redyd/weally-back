import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateMealDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    label: string;
}

export class UpdateMealDto {
    @IsString()
    @IsOptional()
    @MaxLength(200)
    label?: string;
}