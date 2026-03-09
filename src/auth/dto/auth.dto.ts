import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Email invalide' })
    email: string;

    @IsString()
    @MinLength(8, {
        message: 'Le mot de passe doit faire au moins 8 caractères',
    })
    @MaxLength(72, { message: 'Mot de passe trop long' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Le prénom est requis' })
    @MaxLength(100)
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom est requis' })
    @MaxLength(100)
    lastName: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Email invalide' })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
