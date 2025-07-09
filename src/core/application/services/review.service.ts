import { Injectable, Inject } from '@nestjs/common';
import { IReviewRepository } from '../../domain/repositories/review.repository';
import { Review } from '../../domain/entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async createReview(review: Review) {
    return this.reviewRepository.create(review);
  }

  async getReviewsByMovieId(movieId: string) {
    return this.reviewRepository.findByMovieId(movieId);
  }
}
