import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { IReviewRepository } from '../../domain/repositories/review.repository';
import { Review } from '../../domain/entities/review.entity';

describe('ReviewService', () => {
  let service: ReviewService;
  let mockReviewRepository: jest.Mocked<IReviewRepository>;

  beforeEach(async () => {
    mockReviewRepository = {
      create: jest.fn(),
      findByMovieId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: 'IReviewRepository', useValue: mockReviewRepository },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const review = new Review(
        '1',
        'movie1',
        'Great movie',
        5,
        new Date(),
        new Date(),
      );

      mockReviewRepository.create.mockResolvedValue(review);

      const result = await service.createReview(review);

      expect(result).toEqual(review);
      expect(mockReviewRepository.create).toHaveBeenCalledWith(review);
    });
  });

  describe('getReviewsByMovieId', () => {
    it('should return reviews for a movie', async () => {
      const movieId = 'movie1';
      const expectedReviews = [
        new Review('1', movieId, 'Great movie', 5, new Date(), new Date()),
        new Review('2', movieId, 'Average movie', 3, new Date(), new Date()),
      ];

      mockReviewRepository.findByMovieId.mockResolvedValue(expectedReviews);

      const result = await service.getReviewsByMovieId(movieId);

      expect(result).toEqual(expectedReviews);
      expect(mockReviewRepository.findByMovieId).toHaveBeenCalledWith(movieId);
    });

    it('should return empty array if no reviews found', async () => {
      const movieId = 'movie1';

      mockReviewRepository.findByMovieId.mockResolvedValue([]);

      const result = await service.getReviewsByMovieId(movieId);

      expect(result).toEqual([]);
      expect(mockReviewRepository.findByMovieId).toHaveBeenCalledWith(movieId);
    });
  });
});
