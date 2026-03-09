import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // GET /api/v1/users/me — alias vers le profil complet
    @Get('me')
    async getMe(@CurrentUser('id') userId: string) {
        return this.usersService.findById(userId);
    }

    // GET /api/v1/users/:id
    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.usersService.findById(id);
    }
}
