import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AlimentService } from './aliment.service';
import { CreateAlimentDto, UpdateAlimentDto } from './dto/aliment.dto';

@Controller('aliment')
export class AlimentController {
    constructor(private readonly alimentService: AlimentService) {}

    @Post()
    create(@Body() createAlimentDto: CreateAlimentDto) {
        return this.alimentService.create(createAlimentDto);
    }

    @Get()
    findAll() {
        return this.alimentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.alimentService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAlimentDto: UpdateAlimentDto,
    ) {
        return this.alimentService.update(+id, updateAlimentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.alimentService.remove(+id);
    }
}
