import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/JwtAuthGuard';
import { NoAuthGuard } from '../auth/jwt/NoAuthGuard';
import { Roles } from '../auth/jwt/RolesDecorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Permet à un utilisateur de s'inscrire.
   * Ne nécessite aucune authentification.
   *
   * @param createUserDto ses informations basiques
   * (email, nom d'utilisateur, mot de passe)
   */
  @UseGuards(NoAuthGuard)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('CHEF')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
