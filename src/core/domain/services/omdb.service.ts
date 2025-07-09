import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OmdbMovieDto {
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Actors: string;
  imdbRating: string;
  Plot: string;
  imdbID: string;
  Response: string;
  Error?: string;
}

import { Movie } from '../entities/movie.entity';

export interface IOmdbService extends OmdbMovieFetcher {
  getMovieByImdbId(imdbId: string): Promise<Movie>;
}

export interface OmdbAdapterFactory {
  createAdapter(): OmdbMovieFetcher;
}

@Injectable()
export abstract class OmdbMovieFetcher {
  constructor(protected readonly configService: ConfigService) {}

  async getMovieByImdbId(imdbId: string): Promise<Movie> {
    const url = this.buildUrl(imdbId);
    try {
      const response = await this.sendRequest(url);
      return this.parseResponse(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  protected abstract buildUrl(imdbId: string): string;
  protected abstract sendRequest(url: string): Promise<any>;
  protected abstract parseResponse(response: any): Promise<Movie>;
  protected abstract handleError(error: any): void;
}
