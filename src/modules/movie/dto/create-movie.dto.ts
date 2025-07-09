import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  imdb_id: string;

  @IsString()
  @IsNotEmpty()
  user_opinion: string;

  @IsNumber()
  @IsNotEmpty()
  user_rating: number;
}
