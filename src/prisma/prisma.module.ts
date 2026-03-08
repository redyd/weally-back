import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Disponible dans toute l'app sans re-import
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}