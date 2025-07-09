import { Movie } from '../entities/movie.entity';

export interface IMovieRepository {
  findByImdbId(imdbId: string): Promise<Movie | null>;
  save(movie: Movie): Promise<Movie>;
  searchByTitleAndYear(title?: string, year?: number): Promise<Movie[]>;
}
