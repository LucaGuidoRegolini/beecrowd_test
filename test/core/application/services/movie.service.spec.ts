import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from '@src/core/application/services/movie.service';
import { IMovieRepository } from '@src/core/domain/repositories/movie.repository';
import { Movie } from '@src/core/domain/entities/movie.entity';
import { HttpOmdbService } from '@src/core/infrastructure/services/omdb.service';
import { ReviewService } from '@src/core/application/services/review.service';
import { Review } from '@src/core/domain/entities/review.entity';

describe('MovieService', () => {
  let service: MovieService;
  let mockMovieRepository: jest.Mocked<IMovieRepository>;
  let mockOmdbService: jest.Mocked<HttpOmdbService>;
  let mockReviewService: jest.Mocked<ReviewService>;

  beforeEach(async () => {
    mockMovieRepository = {
      findByImdbId: jest.fn(),
      save: jest.fn(),
      searchByTitleAndYear: jest.fn(),
    };

    mockOmdbService = {
      getMovieByImdbId: jest.fn(),
    } as any;

    mockReviewService = {
      createReview: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        { provide: 'IMovieRepository', useValue: mockMovieRepository },
        { provide: HttpOmdbService, useValue: mockOmdbService },
        { provide: ReviewService, useValue: mockReviewService },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  describe('createMovieWithReview', () => {
    it('should create movie and review when movie does not exist', async () => {
      const imdbId = 'tt1234567';
      const userOpinion = 'Great movie';
      const userRating = 5;

      const mockMovie = new Movie(
        '1',
        imdbId,
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

      mockMovieRepository.findByImdbId.mockResolvedValueOnce(null);
      mockOmdbService.getMovieByImdbId.mockResolvedValueOnce(mockMovie);
      mockMovieRepository.save.mockResolvedValueOnce(mockMovie);
      mockMovieRepository.findByImdbId.mockResolvedValueOnce(mockMovie);

      const result = await service.createMovieWithReview(
        imdbId,
        userOpinion,
        userRating,
      );

      expect(result).toEqual(mockMovie);
      expect(mockMovieRepository.findByImdbId).toHaveBeenCalledWith(imdbId);
      expect(mockOmdbService.getMovieByImdbId).toHaveBeenCalledWith(imdbId);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(mockMovie);
      expect(mockReviewService.createReview).toHaveBeenCalled();
    });

    it('should only create review when movie exists', async () => {
      const imdbId = 'tt1234567';
      const userOpinion = 'Great movie';
      const userRating = 5;

      const existingMovie = new Movie(
        '1',
        imdbId,
        'Existing Movie',
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

      mockMovieRepository.findByImdbId
        .mockResolvedValueOnce(existingMovie)
        .mockResolvedValueOnce(existingMovie);

      const result = await service.createMovieWithReview(
        imdbId,
        userOpinion,
        userRating,
      );

      expect(result).toEqual(existingMovie);
      expect(mockMovieRepository.findByImdbId).toHaveBeenCalledWith(imdbId);
      expect(mockOmdbService.getMovieByImdbId).not.toHaveBeenCalled();
      expect(mockMovieRepository.save).not.toHaveBeenCalled();
      expect(mockReviewService.createReview).toHaveBeenCalled();
    });

    it('should throw error if movie cannot be created', async () => {
      const imdbId = 'tt1234567';
      const userOpinion = 'Great movie';
      const userRating = 5;

      mockMovieRepository.findByImdbId.mockResolvedValueOnce(null);
      mockOmdbService.getMovieByImdbId.mockRejectedValueOnce(
        new Error('Failed to fetch movie from OMDB'),
      );

      await expect(
        service.createMovieWithReview(imdbId, userOpinion, userRating),
      ).rejects.toThrow('Failed to fetch movie from OMDB');
    });
  });

  describe('searchMovies', () => {
    it('should search movies with title and year', async () => {
      const title = 'Inception';
      const year = 2010;
      const expectedMovies = [
        new Movie(
          '1',
          'tt1375666',
          'Inception',
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

      mockMovieRepository.searchByTitleAndYear.mockResolvedValue(
        expectedMovies,
      );

      const result = await service.searchMovies(title, year);

      expect(result).toEqual(expectedMovies);
      expect(mockMovieRepository.searchByTitleAndYear).toHaveBeenCalledWith(
        title,
        year,
      );
    });

    it('should search movies with title only', async () => {
      const title = 'Inception';
      const expectedMovies = [
        new Movie(
          '1',
          'tt1375666',
          'Inception',
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

      mockMovieRepository.searchByTitleAndYear.mockResolvedValue(
        expectedMovies,
      );

      const result = await service.searchMovies(title);

      expect(result).toEqual(expectedMovies);
      expect(mockMovieRepository.searchByTitleAndYear).toHaveBeenCalledWith(
        title,
        undefined,
      );
    });

    it('should search movies with year only', async () => {
      const year = 2010;
      const expectedMovies = [
        new Movie(
          '1',
          'tt1375666',
          'Inception',
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

      mockMovieRepository.searchByTitleAndYear.mockResolvedValue(
        expectedMovies,
      );

      const result = await service.searchMovies(undefined, year);

      expect(result).toEqual(expectedMovies);
      expect(mockMovieRepository.searchByTitleAndYear).toHaveBeenCalledWith(
        undefined,
        year,
      );
    });
  });
});
