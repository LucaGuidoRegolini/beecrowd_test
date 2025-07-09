import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OmdbHttpAdapterFactory } from '@src/core/infrastructure/services/omdb.factory';
import { HttpOmdbService } from '@src/core/infrastructure/services/omdb.service';

describe('OmdbHttpAdapterFactory', () => {
  let factory: OmdbHttpAdapterFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OmdbHttpAdapterFactory,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
      ],
    }).compile();

    factory = module.get<OmdbHttpAdapterFactory>(OmdbHttpAdapterFactory);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('createAdapter', () => {
    it('should create an instance of HttpOmdbService', () => {
      const adapter = factory.createAdapter();
      expect(adapter).toBeInstanceOf(HttpOmdbService);
    });

    it('should pass configService to HttpOmdbService', () => {
      const mockGet = jest.spyOn(configService, 'get');
      factory.createAdapter();
      expect(mockGet).toHaveBeenCalled();
    });
  });
});
