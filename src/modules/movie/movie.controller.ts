import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MovieService } from '../../core/application/services/movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { SearchMovieDto } from './dto/search-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('create')
  async createMovieWithReview(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovieWithReview(
      createMovieDto.imdb_id,
      createMovieDto.user_opinion,
      createMovieDto.user_rating,
    );
  }

  @Get('search')
  async searchMovies(@Query() searchMovieDto: SearchMovieDto) {
    return this.movieService.searchMovies(
      searchMovieDto.title,
      searchMovieDto.year,
    );
  }
}
