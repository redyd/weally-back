import { Expose, Type } from 'class-transformer';

class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  label: string;
}

class TagDto {
  @Expose()
  id: number;

  @Expose()
  label: string;
}

class AllergeneDto {
  @Expose()
  id: number;

  @Expose()
  label: string;
}

export class FoodDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  image?: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];

  @Expose()
  @Type(() => AllergeneDto)
  allergenes: AllergeneDto[];
}

class PaginationDto {
  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  totalCount: number;

  @Expose()
  totalPages: number;
}

export class GetAllFoodResponseDto {
  @Expose()
  @Type(() => FoodDto)
  data: FoodDto[];

  @Expose()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
