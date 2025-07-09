import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from '../../core/application/services/movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { SearchMovieDto } from './dto/search-movie.dto';
import { Movie } from '../../core/domain/entities/movie.entity';

describe('MovieController', () => {
  let controller: MovieController;
  let mockMovieService: jest.Mocked<MovieService>;

  beforeEach(async () => {
    mockMovieService = {
      createMovieWithReview: jest.fn(),
      searchMovies: jest.fn<Promise<Movie[]>, [string?, number?]>(),
    } as unknown as jest.Mocked<MovieService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [{ provide: MovieService, useValue: mockMovieService }],
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  describe('POST /movies/create', () => {
    it('should create movie with review', async () => {
      const createDto: CreateMovieDto = {
        imdb_id: 'tt1234567',
        user_opinion: 'Great movie',
        user_rating: 5,
      };

      const expectedMovie = new Movie(
        '1',
        createDto.imdb_id,
        'Test Movie',
        2023,
        'Action',
        'Director',
        ['Actor1', 'Actor2'],
        7.5,
        'Plot summary',
        [],
        new Date(),
        new Date(),
      );

      mockMovieService.createMovieWithReview.mockResolvedValue(expectedMovie);

      const result = await controller.createMovieWithReview(createDto);

      expect(result).toEqual(expectedMovie);
      expect(mockMovieService.createMovieWithReview).toHaveBeenCalledWith(
        createDto.imdb_id,
        createDto.user_opinion,
        createDto.user_rating,
      );
    });
  });

  describe('GET /movies/search', () => {
    it('should search movies with query params', async () => {
      const searchDto: SearchMovieDto = {
        title: 'Inception',
        year: 2010,
      };

      const expectedMovies = [
        new Movie(
          '1',
          'tt1375666',
          searchDto.title!,
          searchDto.year!,
          'Action',
          'Christopher Nolan',
          ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
          8.8,
          'A thief who steals corporate secrets...',
          [],
          new Date(),
          new Date(),
        ),
      ];

      mockMovieService.searchMovies.mockResolvedValue(expectedMovies);

      const result = await controller.searchMovies(searchDto);

      expect(result).toEqual(expectedMovies);
      expect(mockMovieService.searchMovies).toHaveBeenCalledWith(
        searchDto.title,
        searchDto.year,
      );
    });

    it('should search movies with title only', async () => {
      const searchDto: SearchMovieDto = {
        title: 'Inception',
      };

      const expectedMovies = [
        new Movie(
          '1',
          'tt1375666',
          searchDto.title!,
          2010,
          'Action',
          'Christopher Nolan',
          ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
          8.8,
          'A thief who steals corporate secrets...',
          [],
          new Date(),
          new Date(),
        ),
      ];

      mockMovieService.searchMovies.mockResolvedValue(expectedMovies);

      const result = await controller.searchMovies(searchDto);

      expect(result).toEqual(expectedMovies);
      expect(mockMovieService.searchMovies).toHaveBeenCalledWith(
        searchDto.title,
        undefined,
      );
    });
  });
});
