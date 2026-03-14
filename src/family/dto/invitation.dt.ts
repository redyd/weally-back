import { IsInt, IsOptional, Min } from 'class-validator'

export class InviteToFamilyDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    maxUses: number | null
}