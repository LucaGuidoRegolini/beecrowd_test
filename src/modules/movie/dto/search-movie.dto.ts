import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  year?: number;
}
