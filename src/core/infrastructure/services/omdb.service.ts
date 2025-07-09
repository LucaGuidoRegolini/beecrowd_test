import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  IOmdbService,
  OmdbMovieFetcher,
} from '../../domain/services/omdb.service';
import { OmdbMapper } from './omdb.mapper';
import { Movie } from '../../domain/entities/movie.entity';

@Injectable()
export class HttpOmdbService extends OmdbMovieFetcher implements IOmdbService {
  private readonly apiKey: string;
  private readonly baseUrl = 'http://www.omdbapi.com/';

  constructor(configService: ConfigService) {
    super(configService);
    const apiKey = configService.get<string>('OMDB_API_KEY');
    if (!apiKey) {
      throw new Error('OMDB_API_KEY is not configured');
    }
    this.apiKey = apiKey;
  }

  protected buildUrl(imdbId: string): string {
    return `${this.baseUrl}?i=${imdbId}&apikey=${this.apiKey}`;
  }

  protected async sendRequest(url: string): Promise<any> {
    const response = await axios.get(url);
    return response.data;
  }

  protected async parseResponse(response: any): Promise<Movie> {
    if (response.Response === 'False') {
      throw new Error(response.Error || 'Failed to fetch movie from OMDb');
    }
    return OmdbMapper.toDomain(response);
  }

  protected handleError(error: any): void {
    console.error('OMDb API error:', error.message);
  }
}
