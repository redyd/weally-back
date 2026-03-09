import { Module } from '@nestjs/common';
import { AlimentService } from './aliment.service';
import { AlimentController } from './aliment.controller';

@Module({
    controllers: [AlimentController],
    providers: [AlimentService],
})
export class AlimentModule {}
