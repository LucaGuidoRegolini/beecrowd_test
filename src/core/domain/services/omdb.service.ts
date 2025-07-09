import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OmdbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Actors: string;
  imdbRating: string;
  Plot: string;
}

export interface IOmdbService extends OmdbMovieFetcher {
  getMovieByImdbId(imdbId: string): Promise<OmdbMovie>;
}

@Injectable()
export abstract class OmdbMovieFetcher {
  constructor(protected readonly configService: ConfigService) {}

  async getMovieByImdbId(imdbId: string): Promise<OmdbMovie> {
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
  protected abstract parseResponse(response: any): Promise<OmdbMovie>;
  protected abstract handleError(error: any): void;
}
