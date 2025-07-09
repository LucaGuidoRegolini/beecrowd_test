import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from '../../core/application/services/movie.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { OmdbService } from '../../core/infrastructure/services/omdb.service';
import { MovieRepository } from '../../core/infrastructure/repositories/movie.repository';
import { ReviewModule } from '../review/review.module';
import { ReviewService } from '../../core/application/services/review.service';

@Module({
  imports: [PrismaModule, ReviewModule],
  controllers: [MovieController],
  providers: [
    MovieService,
    OmdbService,
    ReviewService,
    {
      provide: 'IMovieRepository',
      useClass: MovieRepository,
    },
  ],
  exports: [MovieService],
})
export class MovieModule {}
