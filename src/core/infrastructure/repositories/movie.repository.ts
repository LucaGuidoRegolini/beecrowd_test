import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { IMovieRepository } from '../../domain/repositories/movie.repository';
import { Movie } from '../../domain/entities/movie.entity';
import { ReviewProps } from '../../domain/entities/movie.entity';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByImdbId(imdbId: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findUnique({
      where: { imdbId },
      include: { reviews: true },
    });

    if (!movie) return null;

    return new Movie(
      movie.id,
      movie.imdbId,
      movie.title,
      movie.year,
      movie.genre,
      movie.director,
      movie.actors,
      movie.imdbRating,
      movie.plot,
      movie.reviews.map((r) => ({
        id: r.id,
        movieId: r.movieId,
        userOpinion: r.userOpinion,
        userRating: r.userRating,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      movie.createdAt,
      movie.updatedAt,
    );
  }

  async save(movie: Movie): Promise<Movie> {
    const savedMovie = await this.prisma.movie.upsert({
      where: { imdbId: movie.imdbId },
      create: {
        id: movie.id,
        imdbId: movie.imdbId,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        director: movie.director,
        actors: movie.actors,
        imdbRating: movie.imdbRating,
        plot: movie.plot,
        createdAt: movie.createdAt,
        updatedAt: movie.updatedAt,
      },
      update: {
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        director: movie.director,
        actors: movie.actors,
        imdbRating: movie.imdbRating,
        plot: movie.plot,
        updatedAt: movie.updatedAt,
      },
    });

    return new Movie(
      savedMovie.id,
      savedMovie.imdbId,
      savedMovie.title,
      savedMovie.year,
      savedMovie.genre,
      savedMovie.director,
      savedMovie.actors,
      savedMovie.imdbRating,
      savedMovie.plot,
      [],
      savedMovie.createdAt,
      savedMovie.updatedAt,
    );
  }

  async searchByTitleAndYear(
    title?: string,
    year?: string | number,
  ): Promise<Movie[]> {
    const where: {
      title?: { contains: string };
      year?: number;
    } = {};
    if (title) where.title = { contains: title };
    if (year) where.year = typeof year === 'string' ? parseInt(year) : year;

    const movies = await this.prisma.movie.findMany({
      where,
      include: { reviews: true },
    });

    return movies.map(
      (movie) =>
        new Movie(
          movie.id,
          movie.imdbId,
          movie.title,
          movie.year,
          movie.genre,
          movie.director,
          movie.actors,
          movie.imdbRating,
          movie.plot,
          movie.reviews.map((r) => ({
            id: r.id,
            movieId: r.movieId,
            userOpinion: r.userOpinion,
            userRating: r.userRating,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          })),
          movie.createdAt,
          movie.updatedAt,
        ),
    );
  }
}
