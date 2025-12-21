import { Test, TestingModule } from '@nestjs/testing';
import { CLoggingService } from './c-logging.service';

describe('CLoggingService', () => {
  let service: CLoggingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CLoggingService],
    }).compile();

    service = module.get<CLoggingService>(CLoggingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
