import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OmdbAdapterFactory,
  OmdbMovieFetcher,
} from '../../domain/services/omdb.service';
import { HttpOmdbService } from './omdb.service';

@Injectable()
export class OmdbHttpAdapterFactory implements OmdbAdapterFactory {
  constructor(private readonly configService: ConfigService) {}

  createAdapter(): OmdbMovieFetcher {
    return new HttpOmdbService(this.configService);
  }
}
