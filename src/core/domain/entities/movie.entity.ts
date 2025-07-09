import * as crypto from 'node:crypto';

export interface ReviewProps {
  id: string;
  movieId: string;
  userOpinion: string;
  userRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Movie {
  constructor(
    public readonly id: string,
    public readonly imdbId: string,
    public readonly title: string,
    public readonly year: number,
    public readonly genre: string,
    public readonly director: string,
    public readonly actors: string[],
    public readonly imdbRating: number,
    public readonly plot: string,
    public readonly reviews: ReviewProps[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    imdbId: string;
    title: string;
    year: number;
    genre: string;
    director: string;
    actors: string[];
    imdbRating: number;
    plot: string;
  }): Movie {
    return new Movie(
      crypto.randomUUID(),
      props.imdbId,
      props.title,
      props.year,
      props.genre,
      props.director,
      props.actors,
      props.imdbRating,
      props.plot,
      [],
      new Date(),
      new Date(),
    );
  }
}
