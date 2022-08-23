import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Transform(value => Number(value))
  @IsNotEmpty()
  @Min(1)
  take: number;

  @IsNumber()
  @Transform(value => Number(value))
  @IsNotEmpty()
  @Min(1)
  page: number;
}
