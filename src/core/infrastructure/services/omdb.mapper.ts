import { Movie } from '../../domain/entities/movie.entity';
import { OmdbMovieDto } from '../../domain/services/omdb.service';

export class OmdbMapper {
  static toDomain(omdbMovie: OmdbMovieDto): Movie {
    return Movie.create({
      imdbId: omdbMovie.imdbID,
      title: omdbMovie.Title,
      year: parseInt(omdbMovie.Year),
      genre: omdbMovie.Genre,
      director: omdbMovie.Director,
      actors: omdbMovie.Actors.split(', '),
      imdbRating: parseFloat(omdbMovie.imdbRating),
      plot: omdbMovie.Plot,
    });
  }
}
