import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class MealService {
    constructor(private readonly prisma: PrismaService,) {
    }

}