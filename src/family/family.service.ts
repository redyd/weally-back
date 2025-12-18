import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { DatabaseService } from '../database/database.service';
import { FamilyClient } from './entities/family.entity';

@Injectable()
export class FamilyService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Crée une nouvelle famille.
   *
   * @param createFamilyDto
   */
  async create(createFamilyDto: CreateFamilyDto): Promise<FamilyClient> {
    const plainFamily = await this.databaseService.family.create({ data: createFamilyDto });
    return new FamilyClient(plainFamily);
  }
}
