import { Module } from '@nestjs/common';
import { ReviewService } from '../../core/application/services/review.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { ReviewRepository } from '../../core/infrastructure/repositories/review.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    ReviewService,
    {
      provide: 'IReviewRepository',
      useClass: ReviewRepository,
    },
  ],
  exports: [ReviewService, 'IReviewRepository'],
})
export class ReviewModule {}
