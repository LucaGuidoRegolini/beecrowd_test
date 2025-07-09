import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { IReviewRepository } from '../../domain/repositories/review.repository';
import { Review } from '../../domain/entities/review.entity';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Review> {
    const createdReview = await this.prisma.review.create({
      data: {
        movieId: review.movieId,
        userOpinion: review.userOpinion,
        userRating: review.userRating,
      },
    });

    return new Review(
      createdReview.id,
      createdReview.movieId,
      createdReview.userOpinion,
      createdReview.userRating,
      createdReview.createdAt,
      createdReview.updatedAt,
    );
  }

  async findByMovieId(movieId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { movieId },
    });

    return reviews.map(
      (review) =>
        new Review(
          review.id,
          review.movieId,
          review.userOpinion,
          review.userRating,
          review.createdAt,
          review.updatedAt,
        ),
    );
  }
}
