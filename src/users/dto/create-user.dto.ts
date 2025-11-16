import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
} from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;
}