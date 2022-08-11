import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  take: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  page: number;
}
