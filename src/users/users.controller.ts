import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/JwtAuthGuard';
import { Roles } from '../auth/decorators/RolesDecorator';
import { UserClient } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<UserClient[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserClient | null> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('CHEF')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<UserClient | null> {
    return this.usersService.remove(id);
  }
}
