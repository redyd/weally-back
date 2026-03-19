import {Controller} from '@nestjs/common';
import {MealService} from './meal.service';

@Controller('meals')
export class MealController {
    constructor(private mealService: MealService) {
    }
}