import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpOmdbService } from '@src/core/infrastructure/services/omdb.service';
import { OmdbMapper } from '@src/core/infrastructure/services/omdb.mapper';
import { Movie } from '@src/core/domain/entities/movie.entity';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpOmdbService', () => {
  let service: HttpOmdbService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpOmdbService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<HttpOmdbService>(HttpOmdbService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getMovieByImdbId', () => {
    it('should return a movie when request is successful', async () => {
      const mockResponse = {
        data: {
          Response: 'True',
          Title: 'Test Movie',
          imdbID: 'tt1234567',
          // ... outros campos necessários
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);
      jest
        .spyOn(OmdbMapper, 'toDomain')
        .mockReturnValue(
          new Movie(
            '1',
            'tt1234567',
            'Test Movie',
            2023,
            'Action',
            'Test Director',
            ['Test Actor'],
            8.5,
            'Test Plot',
            [],
            new Date(),
            new Date(),
          ),
        );

      const result = await service.getMovieByImdbId('tt1234567');

      expect(result).toBeInstanceOf(Movie);
      expect(result.imdbId).toBe('tt1234567');
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('should throw error when OMDb returns error response', async () => {
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Movie not found!',
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await expect(service.getMovieByImdbId('invalid-id')).rejects.toThrow(
        'Movie not found!',
      );
    });

    it('should throw error when request fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getMovieByImdbId('tt1234567')).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('buildUrl', () => {
    it('should build correct OMDb API URL', () => {
      const url = service['buildUrl']('tt1234567');
      expect(url).toBe(
        'http://www.omdbapi.com/?i=tt1234567&apikey=test-api-key',
      );
    });
  });
});
