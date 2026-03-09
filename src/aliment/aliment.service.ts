import { Injectable } from '@nestjs/common';
import { CreateAlimentDto, UpdateAlimentDto } from './dto/aliment.dto';

@Injectable()
export class AlimentService {
    create(createAlimentDto: CreateAlimentDto) {
        return 'This action adds a new aliment';
    }

    findAll() {
        return `This action returns all aliment`;
    }

    findOne(id: number) {
        return `This action returns a #${id} aliment`;
    }

    update(id: number, updateAlimentDto: UpdateAlimentDto) {
        return `This action updates a #${id} aliment`;
    }

    remove(id: number) {
        return `This action removes a #${id} aliment`;
    }
}
