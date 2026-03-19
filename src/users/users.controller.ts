import {Controller, Get, Param} from '@nestjs/common';
import {Session} from '@thallesp/nestjs-better-auth';
import type {UserSession} from '@thallesp/nestjs-better-auth';
import {UsersService} from './users.service';
import {User} from "../types/api.types";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @Get('me')
    async getMe(@Session() session: UserSession): Promise<User> {
        return await this.usersService.findById(session.user.id);
    }

    @Get(':id')
    async getUser(@Param('id') id: string): Promise<User> {
        return this.usersService.findById(id);
    }
}