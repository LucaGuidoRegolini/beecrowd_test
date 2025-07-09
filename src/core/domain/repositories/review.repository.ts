import { Review } from '../entities/review.entity';

export interface IReviewRepository {
  create(
    review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Review>;
  findByMovieId(movieId: string): Promise<Review[]>;
}
